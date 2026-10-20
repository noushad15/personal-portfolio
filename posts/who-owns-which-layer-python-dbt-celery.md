---
title: "Who owns which layer: Python, dbt and Celery"
date: 2026-05-05
description: "Before choosing a transform tool for our ETL v2 platform, we fixed which layer each component owns. The boundaries outlived the tool decision."
tags: ["data-engineering", "dbt", "celery", "architecture"]
---

The question on the table was whether to adopt dbt for the transform layer of the analytics platform I lead. That is a tool decision, and tool decisions attract opinions. Before letting the discussion start, I wanted one thing settled that would hold regardless of the outcome: which part of the pipeline each component is responsible for, and which parts it is forbidden to touch.

The result is three sentences that are now written into the project's documentation and respected by every task.

## The boundaries

Python owns ingestion, parsing, normalisation and validation of the silver contract. Everything from "a file arrived" or "the vendor API responded" up to "a clean, typed, validated row exists in silver" is Python code: the parser pipeline, the cleaning rules, the hashing and run tracking, the contract checks.

dbt, if adopted, owns silver-to-gold SQL and gold business-rule tests. Aggregating cleaned rows into the shapes reports need, joining feeds on a common grain, applying the channel taxonomy, and testing that the results obey business rules: that is SQL work, and it belongs to the tool built for SQL work.

Celery owns orchestration: scheduling, retries and alerting. It decides when things run and what to do when they fail. It does not decide what the things are.

Two negative rules make the boundaries real. dbt never writes to silver. Celery never contains SQL.

## Why decide this before the tool

If the tool had been chosen first, the boundaries would have been drawn around whatever the tool found convenient. dbt can run Python models; a few of them, and suddenly normalisation is split across two codebases. Celery tasks can execute SQL strings; a few of them, and the transform logic has no single home and no tests.

Both of those happened in the first version of the pipeline, not through bad decisions but through the absence of a decision. Cleaning scripts lived in several places. Some aggregation happened in SQL, some in pandas, some in the API layer at request time. Nobody could say where a number came from without reading three repositories.

Fixing the ownership first meant the dbt evaluation had a precise question to answer: how does dbt behave as the owner of exactly this layer, on our data, our Postgres and our Celery? Not "is dbt good", which is unanswerable, and not "should we rewrite the pipeline in dbt", which is the wrong scope.

## Why these particular boundaries

Python for ingestion is not controversial, but the detail matters: validation of the silver contract is Python's job, not dbt's. dbt tests run after the model builds, which is too late for ingestion failures. We want a malformed file rejected, logged and reported before it reaches silver, with its rows in a failure log, not discovered the next morning because a downstream test went red.

dbt for silver-to-gold is where the tool is strongest. Models as versioned SQL files with dependencies declared through references, a lineage graph for free, tests that live next to the model, contracts that refuse to build a model whose columns changed type. The spike later confirmed all of that works on our data, with caveats I will write about separately.

Celery for orchestration is the pragmatic choice. The platform already runs Celery with a database-backed scheduler for every vendor sync. Adding a second orchestrator for the transform layer would mean two schedules, two retry policies and two places to look when something did not run. Instead, a Celery task invokes a dbt build and reads its result; dbt stays a library-like component that Celery drives.

## What the negative rules prevent

"dbt never writes to silver" protects the contract. Silver is the layer with a specification; if a transformation can modify it, the specification no longer describes what is in the table. The direction of data flow is one way, and the layer with the guarantee stays guaranteed.

"Celery never contains SQL" protects testability. A query embedded in a task is invisible to the lineage graph, has no test and is exercised only when the task runs. Keeping all SQL in dbt means all SQL has a model file, a place in the graph and the option of a test.

## The boundaries in practice

When the spike repository was built, the layout followed the boundaries exactly: a Python script writes silver, a dbt project reads it, and an orchestration folder holds the Celery side. The seed script that generates test data at target scale is Python, because generating silver is an ingestion-side concern. The business rule that a channel must be mapped is a dbt test, because it is a gold-layer rule. The schedule and the retry on failure are Celery, because that is orchestration.

The pleasant surprise was how much argument this removed. Questions that would have become debates ("should the cleaning script be a dbt model?") had an answer by construction.

## Takeaway

Decide ownership before you decide tools. A boundary written down as a sentence anyone can repeat is worth more than a tool comparison matrix, and it is still correct after the tool changes.
