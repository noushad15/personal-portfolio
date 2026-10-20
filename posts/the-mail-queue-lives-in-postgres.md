---
title: "The mail queue lives in PostgreSQL"
date: 2026-08-18
description: "InkPigeon's delivery workers claim messages with FOR UPDATE SKIP LOCKED instead of a Redis or Celery queue. The reasoning and the trade-off."
tags: [postgresql, queues, python, inkpigeon]
---

Every email platform has a queue at its heart. A message arrives through the API or the SMTP submission port, is written somewhere durable, and then a worker picks it up, signs it, finds the recipient's mail server and delivers it, possibly retrying for hours. The question is where "somewhere durable" is.

The conventional answer in the Python world is Celery with Redis or RabbitMQ. InkPigeon's answer, locked in the spec, is PostgreSQL. The mail queue is a table.

## How a claim works

The core of it is one query. A delivery worker asks for a batch of messages that are due, locks them so no other worker sees them, and marks them in flight, all in one transaction:

```sql
UPDATE messages
SET    status = 'delivering', claimed_at = now(), attempts = attempts + 1
WHERE  id IN (
  SELECT id
  FROM   messages
  WHERE  status = 'queued' AND next_attempt_at <= now()
  ORDER  BY next_attempt_at
  LIMIT  50
  FOR UPDATE SKIP LOCKED
)
RETURNING *;
```

`FOR UPDATE` locks the rows the worker selected. `SKIP LOCKED` tells other workers to skip rows that are already locked instead of waiting on them. Run that from ten workers at once and each gets a disjoint batch, with no coordinator and no duplicate deliveries.

If the worker dies mid-delivery, its transaction never commits the final status, and a sweep job returns stale `delivering` rows to `queued`. If delivery fails with a temporary error, the worker writes the next attempt time with backoff and the row goes back to waiting. The retry state is just columns.

## Why not Redis or Celery

I have run Celery in production for years on other systems, and it is fine for what it is. For a mail queue it has three costs I did not want to pay.

The first is durability semantics. A message in a broker is somewhere between "accepted" and "delivered", and reconciling that state with the database record of the message is a constant source of edge cases. With the queue in Postgres, the message row and its queue state are the same row, in the same transaction. Accepting a message and queuing it is one commit.

The second is retry state. Email retries are long-lived and need to be inspectable: when is the next attempt, how many so far, what was the last error. Celery's retry mechanism keeps that in the task, which is the wrong place for state a customer may want to see in a dashboard. In a table it is a query.

The third is simply one fewer system. Redis is still there for rate limits and sessions, where its data model fits, but it is not on the critical path for mail. If Redis restarts, no message is lost.

## The surrounding rules

A few decisions make this work cleanly rather than merely work.

Identifiers are UUIDv7 everywhere. They sort by time, which means the index on `id` is nearly append-only and ordering by creation is free. Every timestamp is `timestamptz` in UTC, which removes a whole class of "why did this send at the wrong hour" bugs when customers are in different time zones.

The claim query is one of the very few places in the codebase where raw SQL is allowed. Everything else goes through SQLAlchemy 2.0 async. Keeping raw SQL rare means the tenant-isolation rule, that every query filters by `org_id`, stays reviewable.

And the workers are plain Python processes, not Celery workers. They loop, claim, deliver, commit. There is nothing to learn beyond the SQL.

## The trade-off

What I give up is raw throughput. A Postgres row-lock queue will not match a purpose-built broker at hundreds of thousands of messages a second. Each claim is a write, and the table needs vacuuming like any other hot table.

That is a real limit, and I know roughly where it is. It is also far above where the product is, and the ceiling is lifted in boring ways: a dedicated queue table partitioned by status, more workers, bigger batches, or at the far end, moving the queue out. Because the claim is behind one service function, that migration would touch one module.

## When it would stop being enough

The honest trigger is not volume alone. It is when the queue needs behaviour Postgres does not express well: fan-out to many consumers of the same message, or priority lanes with strict ordering across tenants, or sub-millisecond latency. Mail delivery needs none of those. It needs durability, visibility and retries, and a table is the best tool I know for all three.

## Takeaway

Before adding a queueing system, ask what the queue state needs to be consistent with. If the answer is "the row in the database", the queue probably belongs in the database. `FOR UPDATE SKIP LOCKED` has been in PostgreSQL since 9.5. It is not clever; it is just enough.
