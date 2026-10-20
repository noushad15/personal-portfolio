---
title: "A week with dbt Core and its sharp defaults"
date: 2026-10-06
description: "A time-boxed spike to decide whether dbt fits our silver-to-gold layer: it did everything asked, and showed how easily it produces silently wrong data."
tags: [dbt, data-engineering, postgresql, etl]
---

We had a decision to make for the ETL v2 platform: build the silver-to-gold transform layer ourselves in Python, or adopt dbt Core. The discussion had started to go in circles, with opinions on both sides and no measurements on either. So I took a week, built a throwaway repository, and asked one question: how does dbt Core behave on our data, our Postgres and our Celery orchestration?

The spike had a fixed set of responsibility boundaries that would hold whatever the outcome. Python owns ingestion, parsing, normalisation and silver contract validation. dbt, if adopted, owns silver-to-gold SQL and gold business-rule tests. Celery owns orchestration, scheduling, retries and alerting. dbt never writes to silver, and Celery never contains SQL.

## What I built

Three gold models over channel-mix data, fed by three staging models that normalise three feeds onto one grain and one intermediate model that unions them.

| Model | Materialisation | Grain |
|---|---|---|
| `gold_channel_mix_daily` | incremental, `delete+insert` | hotel × day × channel |
| `gold_channel_mix_monthly` | table | hotel × month × channel |
| `gold_hotel_channel_trend` | table | hotel × channel |

The seed script generated synthetic data at target scale. The daily model ended up at 5.2 million rows, enough to make incremental behaviour and build times real rather than theoretical. Everything ran against PostgreSQL 16 with a Celery task calling `dbt build`, and every number in the findings document is reproducible from a runbook.

## The short answer

dbt Core did everything the checklist asked of it. Nothing in the spike produced a limitation that would stop adoption.

What it does not do is give you fail-loud behaviour or incremental correctness by default. The ticket had said as much; the spike confirmed it with measurements instead of assuming it either way. Over the week, nine distinct ways to get silently wrong data turned up, four of them serious. None of the fixes exceeded a few dozen lines, and each one is now covered by a test that fails if it regresses. That is the honest shape of the decision: dbt is a good tool with sharp defaults, and adopting it means adopting a specific set of conventions alongside it, not just installing it.

## Incremental models are correct only if you make them so

An incremental model that appends is cheap and wrong the moment a late-arriving row updates a day that already exists. The daily model uses `delete+insert` keyed on the grain, so a re-run of a window replaces that window rather than duplicating it. That is a choice you have to make deliberately, and a choice you have to test, because the default behaviour will happily double-count and tell you nothing.

## Model contracts are real, and stricter than expected

`gold_channel_mix_daily` declares `contract: enforced: true` with a type for every column. It rejected the model twice during development. `sum(integer)` widens to `bigint`, and `sum(bigint) over (...)` widens to `numeric`, so three columns had silently changed type between what I declared and what Postgres produced. dbt refused to build.

That was the closest dbt came to failing loud on its own, and it is worth noting that it only did so because I had opted in. Without the contract the model builds, the downstream model reads a `numeric` where it expects an integer, and the first anyone hears of it is a rounding difference in a report.

## Unmapped channels

Every feed names its channels differently. The spike puts the mapping in a seed, and a test called `assert_no_unmapped_channels` fails the build the first time a vendor introduces a channel name that nobody has mapped. Without that test, the new channel rolls up into nothing, and the totals are quietly short. I have written about the taxonomy seed separately because it turned out to be useful regardless of the dbt decision.

## The item I could not close

Checklist item eight was team ramp: how long does it take a second engineer to make a change to this project? I wrote a scoped exercise for it. It needs a second engineer for about two hours, and it cannot be automated or estimated by the person who built the thing. The decision document was left in draft until that number existed, because a transform layer the rest of the team can't change is not a transform layer.

## What I'd do differently

I would write the regression tests first, before the models, and treat the "silently wrong" list as the deliverable rather than the models themselves. The models were the easy part. The list of conventions, each backed by a test, is what the team actually adopts if it adopts dbt, and it is what the Python alternative has to match if it doesn't.
