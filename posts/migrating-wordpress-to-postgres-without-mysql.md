---
title: "Migrating a WordPress site to Postgres without running MySQL"
date: 2026-09-15
description: "Two education platforms moved from WordPress to FastAPI and Postgres 16. The migration pipeline is reproducible, keeps a safety net, and lets old passwords keep working."
tags: [postgresql, migration, fastapi, wordpress]
---

This year I rebuilt two education platforms that had grown up on WordPress, one of them on a learning-management plugin, onto a stack I can actually maintain: FastAPI and PostgreSQL 16 on the backend, Next.js on the frontend, Docker for everything, GitHub Actions for deploys.

The interesting engineering was not the new code. It was moving years of users, courses, orders and media across without losing anything and without asking anybody to reset a password.

## The constraint: no MySQL

What I had from the old sites was a phpMyAdmin SQL dump and the `wp-content/uploads` directory. The obvious approach is to stand up MySQL, restore the dump, and write an ETL from MySQL to Postgres. I did not want MySQL anywhere in the new project, not even as a migration tool, because every extra runtime is one more thing a future rebuild of the pipeline depends on.

So the first script, `mysql2pg.py`, reads the MySQL dump directly and loads it into Postgres. It handles the dialect differences: backtick quoting, MySQL-specific types, the `INSERT` batching style phpMyAdmin produces. The destination is a schema called `wp` inside the Postgres database, with the WordPress tables as they were. No transformation at this stage, just a faithful copy in a different engine.

## Two schemas, one database

The second script, `transform.py`, maps the raw `wp` schema into the clean application schema: users, courses, enrolments, progress, orders, reviews, vouchers, certificates. This is where WordPress's post-meta sprawl, where a course is a row in `wp_posts` and its properties are twenty rows in `wp_postmeta`, becomes real columns with real types and foreign keys.

Both schemas live in the migration database at the same time, which turned out to be the most useful decision in the project. Every time the transform produced something odd, I could join the clean table back to the raw one and see exactly where the data came from. When a stakeholder asked why a particular enrolment was missing, the answer was a query, not a guess.

The raw `wp` schema is kept as a safety net but excluded from the clean dump that ships with the application. So the deployed database is only the clean schema, and the pipeline database keeps the evidence.

## Reproducible from the original backups

The whole pipeline reruns from the original dump with one command. That mattered more than I expected, because the migration was not a single event. The old site stayed live while the new one was built, so I reran the migration several times against fresher dumps, and each run had to produce the same result plus whatever had changed.

The result of the final run is a Postgres dump checked into the repository as `aos_clean.dump`. `make up` starts the stack and, if the database is empty, restores that dump automatically. A new developer, or me on a new machine, gets the real data in one command.

## Old passwords keep working

The part users would notice most is the one they never noticed. WordPress stores password hashes in its own phpass format. Rather than force a reset on every account, the new backend understands that format: on login, if the stored hash is a WordPress hash, it is verified with the WordPress algorithm, and on success the password is re-hashed with bcrypt and the row is updated.

So every migrated account signs in with the password it always had, and the legacy hash format disappears from the database one login at a time. After enough time, the WordPress verifier can be deleted.

Admin accounts came across with their role, so the people running the site were administrators on the new one from the first minute.

## Everything else

Media was extracted from `wp-content/uploads` into a media directory the new application serves. It is created by the setup, not committed to git.

Payments moved to Stripe Checkout with a webhook on `checkout.session.completed`. Until the keys are configured, checkout returns a clear error and the rest of the site works, which made it possible to deploy and test before going live with payments.

One thing I found in the old codebase deserves its own warning: a plugin had third-party API credentials hardcoded in source. They were rotated before the new integration was wired up. If you migrate a WordPress site, grep the plugins directory for credentials before you do anything else.

## What I'd do differently

I would have written the data-quality checks before the transform rather than after. Counts per table, orphaned foreign keys, users without emails, orders without items: those queries were how I found most transform bugs, and I wrote them reactively.

I would also keep the raw-to-clean lineage more explicit. The joins back to the `wp` schema were ad hoc. A `source_id` column on each clean table, pointing at the raw row, would have made every "where did this come from" question trivial.
