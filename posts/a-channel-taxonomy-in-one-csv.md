---
title: "A channel taxonomy in one CSV"
date: 2026-10-13
description: "The most useful thing to come out of a dbt spike was fifteen lines of CSV: one place where every vendor's channel name maps to ours."
tags: [data-engineering, dbt, analytics, data-quality]
---

The dbt spike I ran for our transform layer produced three gold models, a findings document and a draft decision. The thing I would keep even if we threw all of that away is a file called `seeds/channel_taxonomy.csv`. It is fifteen lines long.

## The problem it solves

Our analytics platform reports marketing performance for hotels across several feeds. Each feed has its own vocabulary for the same concept. Google Ads reports campaign types such as `SEARCH` and `PERFORMANCE_MAX`. GA4 has its own default channel groupings. Meta has placements. Our product reports on channels like Paid Search, Paid Social and Organic, which is what a hotel's marketing director actually thinks in.

Somewhere, every feed-specific name has to become one of ours. The question is where.

In the old code, the answer was "in several places". A `CASE` expression in one query. A dictionary in a Python module. A constant in the frontend that decides which bucket a row renders into. Each of them was written by a different person at a different time, and each of them was mostly right. The visible symptom was a ticket that had been open for a while: Performance Max campaigns appearing in two places in the paid section of a report, because one mapping treated `PERFORMANCE_MAX` as Paid Search and another did not know about it at all.

## The seed

In the spike, the mapping is a CSV committed to git:

```csv
source,source_channel,canonical_channel
google_ads,SEARCH,Paid Search
google_ads,PERFORMANCE_MAX,Paid Search
google_ads,DISPLAY,Display
ga4,Organic Search,Organic
meta,feed,Paid Social
```

dbt loads it as a seed table. The three gold models reference it through a single `{{ ref('channel_taxonomy') }}` and join on `(source, source_channel)`. There is no other place in the project where a vendor's channel name is interpreted.

That gives three things at once. A reviewer can read the entire taxonomy in one screen and argue about a line of it in a pull request. A change to the mapping is a one-line diff with a commit message, not an archaeology exercise through query files. And when the three consuming models disagree, they can't, because they consume the same table.

## Failing loudly when a vendor changes

Vendors add channel types without telling you. The test that makes the seed safe is small:

```sql
-- tests/assert_no_unmapped_channels.sql
select source, source_channel
from {{ ref('int_channel_activity') }}
where canonical_channel is null
```

If that query returns rows, the build fails, and the failure names the exact source and channel that nobody has mapped yet. The alternative, which is what most pipelines do, is a left join that turns the new channel into `NULL`, which the report then either drops or files under "Other". Totals come out a little short and nobody notices for a quarter.

The test turned a silent gap into a build failure with a one-line fix. That is the whole trade.

## Why this mattered beyond the spike

The spike was supposed to answer "should we adopt dbt?". The taxonomy seed answers a different question that had been open for longer: where is the channel taxonomy defined? Before, the honest answer was "ask whoever wrote that query". Now it is a file path.

That holds whatever we decide about dbt. If the transform layer ends up in Python, the CSV becomes a table loaded by the ingestion code and the test becomes a pytest assertion. The mapping and the loud failure are the asset; the tool that reads them is a detail.

## Where taxonomies hide

If you want to find out whether your own pipeline has this problem, grep for the vendor's names rather than yours. Search for `PERFORMANCE_MAX` or `Organic Search` across the backend and frontend. Every hit outside one file is a place where the taxonomy is defined again, and every pair of hits is a potential disagreement. I found them in `WHERE` clauses, in a chart's series configuration, and in a spreadsheet someone used to check the numbers by hand.

## Takeaway

Reference data that decides how numbers roll up deserves the same treatment as code: one definition, in version control, with a test that fails when reality drifts from it. Fifteen lines of CSV did more for the consistency of our reports than the three models that consumed it.
