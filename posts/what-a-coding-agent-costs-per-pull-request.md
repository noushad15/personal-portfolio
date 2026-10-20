---
title: "What a coding agent costs per pull request"
date: 2026-02-25
description: "Why I built a per-run cost ledger into my coding agent, and how knowing the price of a pull request changed which tickets I give it."
tags: [llm, agents, cost, python]
---

The monthly invoice from a model provider tells you almost nothing useful. It tells you that you spent money. It does not tell you which run spent it, whether that run produced a mergeable pull request, or whether the ticket was worth automating in the first place. When I built the agent that turns tickets into pull requests, I added cost tracking before I added most of the features, and I am glad I did.

## The ledger

Every call to a model API returns token usage. The agent's provider layer, one class for Claude and one for OpenAI, records that usage after each call and multiplies it by a price table per model. The result goes into SQLite: a row per call, keyed by day, model and provider, with input tokens, output tokens and the computed price.

SQLite was the deliberate choice. The ledger has to survive restarts, it has to work on a laptop and in a container, and it must not require another service. Python ships with it. A single file in the run directory is enough.

On top of the table there are a handful of aggregation functions and, in the FastAPI variant of the agent, a few endpoints:

- `/costs/current` for today's spend,
- `/costs/daily/{date}` for a given day,
- `/costs/total` over a date range,
- `/costs/model/{model}` for one model's history,
- `/costs/pricing` to see the price table in effect.

Nothing clever. The value is entirely in the granularity.

## Cost per run, not per month

Because every run has a task identifier, the ledger can answer the question I actually care about: what did this pull request cost? That number varies far more than I expected between tickets that look similar in the tracker.

A few patterns emerged quickly, and I will describe them without quoting figures, because the figures depend on the model, the prices on the day and the repository, and any number I printed here would be stale and misleading.

- Runs on tickets with a precise description and a named test file are cheap and short. The model reads a few files, makes a targeted edit, runs the tests, and is done.
- Runs on tickets that require exploring the codebase to find where a behaviour lives are expensive, and the cost rises faster than the quality of the result. The model reads file after file, and much of what it reads is irrelevant.
- Runs that hit a failing test the model cannot fix are the most expensive of all, because the loop keeps trying until the iteration limit. Those runs usually produce nothing mergeable.

Seeing this per run, rather than as an undifferentiated monthly total, made the next decision obvious.

## Choosing the tickets

The agent is cheapest and most useful on exactly the tickets a senior engineer finds boring: cutovers from one endpoint to another, adding a field through model, schema and endpoint, repetitive fixes with a known pattern. It is expensive and unreliable on tickets that are really design questions wearing a ticket's clothing.

So the selection rules moved into the process. A ticket is eligible for the agent only when it names the files or module involved, states the acceptance test, and carries the base and target branch in its description. That is also, not coincidentally, the description of a well-written ticket for a human. The agent became a forcing function for better tickets.

The per-repository instruction file carries the rest: coding conventions, how to run the tests, what not to touch. The combination of a precise ticket and a good instruction file does more for cost than any choice of model.

## Why keep the ledger even now

Prices change, models change, and the tracker lets me compare without guessing. When a new model appears, I can run the same set of historical tickets through it and see cost and outcome side by side. When a run looks surprisingly expensive, the ledger is the first place I look, and the answer is almost always "the ticket was vague".

## Takeaway

If you are running an agent that spends money per call, record the spend per call, per run, in a store you control, from the first day. Monthly totals hide the one fact that lets you improve the system: that some kinds of work are cheap to automate and some are not, and the difference is visible only at the level of the individual run.
