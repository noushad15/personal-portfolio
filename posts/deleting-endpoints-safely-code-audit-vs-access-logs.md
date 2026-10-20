---
title: "Deleting endpoints safely: a code audit is not enough"
date: 2026-06-09
description: "Seven groups of old API endpoints have zero callers in our code. We still are not deleting them until the access logs agree."
tags: ["api-design", "legacy", "operations", "architecture"]
---

Part of the refactor program for the analytics platform I lead is deleting old endpoints rather than migrating them. Deletion is the cheapest kind of migration, which is exactly why it deserves the most care. A migrated endpoint that goes wrong is a bug. A deleted endpoint that someone still needed is an outage you cannot roll forward from.

## What the audit found

We audited every v1 endpoint group against three consumers: the main analytics frontend, the admin frontend and the backend itself, in case any endpoint called another internally. The result split cleanly.

Seven groups had zero callers anywhere: channel mix, visits, the analytics side of source traffic, paid media, Instagram, the v1 report endpoints and the v1 review endpoints. Their v2 equivalents had taken over and the frontends had moved without anyone deleting the originals.

Four groups were stragglers, with a small remaining footprint: one call to the top-referrers list, one to the social platforms list, one to add a note, and five calls in a display-ads service.

Everything else was in use and belongs to a different category of the program.

## Why zero callers is not zero consumers

A code audit answers one question: does anything we build call this? It cannot answer the question that actually matters for deletion: does anything call this?

This platform has existed for years. Over that time there have been integrations, scripts, scheduled jobs on other systems, and at least the possibility of a customer or partner pointed at an endpoint directly. None of those appear in our repositories. Some of them might not appear in anyone's memory either.

So the rule in the brief is explicit: the seven groups can be deleted, but only after access-log monitoring confirms there is no runtime traffic from external or third-party consumers. The code audit decides what is a candidate. The logs decide what is safe.

## Making the logs answer the question

Confirming absence from logs needs some care, because "I looked at yesterday's logs and saw nothing" proves little. Some consumers run monthly. Some run only at quarter end. The monitoring window has to be long enough to cover the slowest plausible cadence, and the check has to be specific to the endpoint paths in question rather than a general traffic graph.

The practical approach is to tag the candidate paths, count requests per path per day over the window, and treat any non-zero count as a finding to investigate rather than noise to explain away. A single request from an unfamiliar client is not "probably a scanner". It is a consumer until identified.

The window also runs in parallel with other work, so it costs calendar time but not engineering time. Deletion tickets are prepared, reviewed and held, not blocked.

## Stragglers get a decision each

The four straggler groups are more interesting than the deletions, because each needs a specific answer rather than a rule. For each one: does a v2 equivalent already exist? If yes, migrate the remaining calls and the group joins the delete list. If no, either build the equivalent, which is a small piece of work for a single call, or decide deliberately to keep the v1 endpoint alive and document that it is kept.

The display-ads group, with five remaining calls, is the one where access logs matter in a second way: they help decide between migrating and dropping. If the feature behind those five calls has no real usage, building a v2 equivalent for it is waste.

The thing to avoid is the fourth option that happens by default: leaving the calls in place with nobody having decided anything. That is how the stragglers came to exist in the first place.

## Why deletion is a category, not a chore

Earlier versions of the program treated deletion as something that would happen naturally once modules migrated. It did not happen, which is how we ended up with seven endpoint groups duplicating their v2 versions for months. Making "delete" a first-class category with its own entry criteria (zero code callers), exit criteria (clean logs over the window) and owner gave it the same weight as building something.

It also changed the conversation with the people who approve the roadmap. "We are migrating eighteen modules" is a wall. "Seven groups are being deleted, six are being cut over, four are being built" is a plan with visibly different costs per line.

## Takeaway

Treat deletion with the same evidence standard as a schema change. A code audit tells you what is a candidate; only runtime traffic over a long enough window tells you what is safe. And give every remaining call an explicit decision, because the calls nobody decided about are the ones that become next year's stragglers.
