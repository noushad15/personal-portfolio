---
title: "Missing data should be a state, not a silence"
date: 2026-01-28
description: "How the analytics platform I lead turned silent gaps in vendor data into tracked states with monitors, triggers and automatic resolution."
tags: [data-quality, data-pipelines, celery, analytics]
---

A report that says "no data for March" is a report you can act on. A report that quietly shows March as zero, or omits it, or rolls the quarter up without it, is a report that costs you a customer's trust the moment they compare it to the vendor's own dashboard. For a long time the analytics platform I lead produced the second kind more often than I would like to admit. This post is about how we moved from fixing gaps by hand to treating missing data as a first-class state.

## Where gaps come from

The platform ingests marketing data for hotel portfolios from several vendor APIs and from files uploaded by brands. Gaps appear for mundane reasons:

- A vendor token expires and the sync fails for a few days.
- A hotel's account is reconnected under a new identifier and the old one stops returning rows.
- The vendor finalises numbers late, so yesterday's sync returned partial data that will be different tomorrow.
- A brand uploads a file with a month missing, or with a hotel code that doesn't match ours.

None of these are bugs in the usual sense. They are the normal weather of a multi-source pipeline. The failure was that nothing in the system represented them. A failed sync logged an exception and moved on. The next report simply had less data.

## The first attempt: fix it in the report

Our early instinct was to defend at the edges. Report queries learned to detect missing months and show a dash; the PDF generator learned to annotate charts. This helped the reader, but it meant every one of our analytics modules carried its own copy of the detection logic, each slightly different. Fixing a case in one module did not fix it in the others. With eighteen modules, this stopped scaling quickly.

## Making it a state

The change that worked was to add a layer whose only job is to know what data we have, per hotel, per source, per period, and to run it as scheduled work alongside the syncs.

**Data-completeness refresh.** After each vendor sync, a task recomputes a completeness table: for every hotel and source, which periods have rows and which do not. It is a materialised answer to "what is missing?", and the modules read from it instead of inferring gaps on the fly.

**Data-quality monitors.** A second set of tasks checks the data that *is* there against expectations: values that are suddenly zero, metrics that disagree with each other, rows whose hotel identifier is unknown. Findings are written as records with a status, not as log lines.

**Missing-data triggers.** When completeness drops for a hotel and source, a trigger task decides what to do. Often the right action is simply to re-run the sync for the missing window. A re-run that succeeds closes the finding automatically.

**Auto-resolution.** Some failure patterns are so familiar that the resolution can be scripted: re-mapping a renamed campaign, re-fetching a period after the vendor's settlement window, marking a known-empty period as "expected empty" so it stops alerting. Each pattern gets an auto-resolution task; anything it cannot resolve stays open for a human.

The important property is that an open finding is visible. The admin frontend shows the data-quality queue; reports read the completeness table and label gaps consistently; and when someone asks why a hotel's paid-media numbers look low, the answer is in the system rather than in someone's memory.

## What it changed

The obvious effect is fewer surprises in reports. The less obvious effect is on the team. Before, a data gap was an interrupt: someone noticed, pinged an engineer, and the engineer went spelunking. After, it is a queue with a status, and most items close themselves. The engineers who used to spend afternoons on one-off fixes now spend them on the pipeline that prevents the fix being needed.

It also changed how we design new sources. A new ingestion is not finished until it writes to the completeness table and has at least one monitor. That rule came out of the ETL redesign we started later in the year and it is now the default.

## Takeaway

If a value can legitimately be absent, model the absence. A pipeline that only has "present" and "exception" has no way to tell you the difference between "the vendor had nothing" and "we never asked", and your reports will quietly pick one. Give missing data a row, a status and an owner, run the checks on the same scheduler as the syncs, and let the common cases close themselves.
