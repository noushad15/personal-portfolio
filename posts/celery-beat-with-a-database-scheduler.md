---
title: "Running periodic vendor syncs with Celery beat and a database scheduler"
date: 2026-01-14
description: "Why the analytics platform I lead keeps its sync schedules in PostgreSQL rather than in code, and what went wrong before it did."
tags: [celery, python, data-pipelines, operations]
---

The analytics platform I lead pulls marketing data for hotel portfolios from several vendors: Google Analytics 4, Google Ads, Meta, review platforms and a handful of file-based sources. None of those vendors deliver on the same rhythm. Ad platforms finalise numbers days after the fact, review sites trickle in, and a brand's data files arrive whenever someone remembers to upload them. Almost everything that keeps the platform current is therefore a scheduled job, and the scheduling layer is one of the least glamorous and most important parts of the system.

This is how that layer is built, and the things it took us a while to get right.

## Workers and beat

The shape is standard Celery. A FastAPI service handles requests; Celery workers run the sync tasks; Celery beat decides when to enqueue them. Each vendor has its own task module: one for GA4, one for Google Ads, one for Meta ads, one for organic social, one for each review source, and so on. A task takes a hotel or a batch of hotels and a date range, calls the vendor API, and persists the response before any transformation happens.

The decision that matters is where the schedule lives. Celery's default beat scheduler reads a dictionary from your settings module. That is fine for a prototype and wrong for a product, for one reason: the schedule becomes a deployment artefact. Changing a cron expression means a code change, a review, a build and a rollout. When a vendor's API has an outage and you want to pause one sync for a day, that is far too slow.

## Schedules in the database

We run beat with a database-backed scheduler, the SQLAlchemy port of `django-celery-beat`. Periodic tasks, their crontab or interval definitions and their enabled flags are rows in PostgreSQL. Beat polls the table and picks up changes without a restart.

```python
# core/celery.py (illustrative)
app = Celery("platform")
app.conf.beat_scheduler = "celery_sqlalchemy_scheduler.schedulers:DatabaseScheduler"
app.conf.beat_dburi = settings.CELERY_BEAT_DB_URI
```

The practical consequences are what sold the approach:

- Pausing a sync is an `UPDATE`, not a deploy.
- Per-hotel or per-brand schedules can be created by the application itself when a new property is onboarded, instead of someone editing a settings file.
- The schedule is visible. Support can answer "when did the Google Ads sync last run and when is the next one?" from a table.

We later exposed this through a task-manager API so the admin frontend can list, enable and trigger periodic tasks. That turned the scheduler from infrastructure into a feature.

## Pitfalls we hit

**Duplicate triggers.** Running two beat processes is the classic mistake, and we made a version of it during a deployment where the old and new beat pods overlapped. Beat must be a singleton. On Kubernetes that means a deployment with exactly one replica and a rollout strategy that does not keep two alive. Our production rollout restarts `web`, `celery-worker` and `celery-beat` as separate deployments precisely so beat can be treated differently from workers.

**Long-running tasks.** A full-history backfill for a hotel can take far longer than the interval between scheduled runs. If the next trigger fires while the previous run is still going, you get overlapping writes and double API spend. The fix was to make tasks idempotent and short: a scheduled task enqueues per-hotel work rather than doing it inline, and backfills are separate, manually triggered tasks.

**Pool choice.** Locally we run `--pool=solo` for debuggability. In production, prefork workers with sensible concurrency are the right default for I/O-heavy vendor calls, but the memory footprint of pandas-heavy tasks pushed us to keep worker concurrency lower than the CPU count would suggest.

**Observability.** Flower gives a live view of queues and workers, and Sentry's Celery integration captures task failures with their arguments. Without both, a silently failing sync looks exactly like a vendor that has nothing new to report.

## Monitors are tasks too

Once the scheduler was reliable, we started treating data quality as scheduled work rather than as something a person notices. Data-completeness refreshes, data-quality monitors, auto-resolution for known failure patterns and missing-data triggers are all Celery tasks on the same beat. They run after the syncs they check and record their findings as state, which is the subject of the next post.

## What I'd do differently

I would introduce the database scheduler on day one, before any schedule existed in code, because the migration from settings-based schedules was an annoying one-off that produced a few weeks of "which one is authoritative?" confusion. I would also add the task-manager API earlier. The moment non-engineers could see and pause schedules, the number of "is the sync broken?" messages dropped, and that was worth more than any optimisation of the tasks themselves.
