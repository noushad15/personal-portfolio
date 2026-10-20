---
title: "Idempotent ingestion: run IDs, file hashes and row hashes"
date: 2026-04-21
description: "How the bronze layer of our ETL v2 design makes every load safe to re-run, and why a data contract has to exist before the first table does."
tags: ["data-engineering", "etl", "postgresql", "design"]
---

The oldest ingestion code in the analytics platform I lead was written to run once. Every path assumed the file was new, the API response was fresh and nobody would ever click "upload" twice. Years later, the most common support request is some version of "we re-sent the file, now the numbers are doubled". That is not a bug in a single script. It is a missing property of the whole layer: idempotency.

When we designed the second version of the ETL pipeline this spring, the first decision was that re-running any load, at any layer, must produce the same result as running it once. Everything else in the bronze and silver design follows from that.

## Three identifiers on every row

The bronze layer is raw storage: whatever arrived, as it arrived, plus enough metadata to reason about it later. Each row carries three things.

An `ingestion_run_id` ties the row to one execution of one job. Every run, whether a scheduled vendor sync or a manual upload, gets a fresh identifier before it touches the database. If a run fails halfway, we can find and remove exactly its rows. If a run succeeds and later turns out to be wrong, we can find and remove exactly its rows. Without this, "undo the Tuesday load" means guesswork over timestamps.

A `file_hash` identifies the input. For uploaded files it is a hash of the bytes; for API pulls it is a hash of the normalised response. The ingestion job checks the hash before doing anything else. A file we have already processed is skipped, with a log line saying so, instead of being loaded again. This is what turns "they uploaded it twice" from an incident into a no-op.

A `row_hash` identifies the content of one record after normalisation. It is how we detect change. When a vendor re-delivers last month's data with three corrected rows, the file hash differs, so the run proceeds, but only the three rows with a new hash produce updates. The rest are recognised as already present.

## Audit tables, not log lines

Logs tell you what happened if you know where to look. Tables let you ask questions. The design adds two audit tables alongside the data.

`ingestion_run_log` has one row per run: source, started and finished timestamps, status, counts of rows seen, inserted, updated, skipped and failed, and the file hash. Most operational questions ("did last night's sync for this source run, and how much did it load?") become a single query, and a monitor can alert on a run that finished with zero rows when it normally loads thousands.

`row_failure_log` has one row per record that could not be loaded: the run, the raw payload, the rule that rejected it and why. Rejected rows do not silently vanish and they do not poison the good rows in the same batch. The run completes, the failures are recorded, and a person can fix the mapping and replay only the failed rows.

## What silver adds

Silver is the cleaned, typed layer the rest of the platform reads from. Two more columns matter there.

`rules_version` records which version of the cleaning rules produced the row. Cleaning logic changes: a new channel appears, a vendor renames a field, a unit changes. When the rules change, we need to know which rows were produced by the old rules so they can be rebuilt. Versioning the rules and stamping each row makes a rebuild a filter, not a full reload.

An anomaly flag marks rows that passed validation but look wrong: a negative spend, a day with ten times the usual sessions, a hotel that reported for the first time in a year. These rows stay in silver so reports are complete, but they are visible to the data-quality monitors and excluded from some aggregates until reviewed.

## Contracts come first

The part that took the longest to agree on was not a table. It was the rule that a data contract for each source has to exist before the bronze and silver tasks for that source are started. The contract names the fields, their types, which are required, how identifiers are resolved to a hotel, and what counts as a failure.

Without that dependency, the schema gets designed from whichever sample file someone has open, and the validation rules get written from whichever bug was most recent. With it, the contract is the specification that bronze loads against, silver validates against and the downstream models can trust. In the task breakdown this is an explicit dependency: no bronze or silver work for a source until its contract is reviewed.

## Why this is worth the overhead

Every one of these columns costs something: a little storage, a hash computation per row, a slightly longer task. Against that, consider what the old pipeline cost us. Every duplicate load was a manual clean-up. Every vendor correction meant comparing files by eye. Every change to cleaning logic meant a full reload with no way to tell which rows had changed. The overhead of idempotency is paid once, at design time. The overhead of its absence is paid on every incident.

## What I'd do differently

I would have introduced `file_hash` alone, years earlier, into the old pipeline. It needs no schema redesign, it blocks the single most common failure, and it would have bought the team time to design the rest properly instead of under pressure.
