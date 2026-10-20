---
title: "A modular monolith on one VPS"
date: 2026-08-11
description: "InkPigeon is one Python codebase deployed as about eight containers that scale independently. Why that beats microservices on a single server."
tags: [architecture, python, docker, inkpigeon]
---

When I describe InkPigeon's architecture, people sometimes hear "eight containers" and assume microservices. It is the opposite. There is one Python package, one database schema, one set of tests, and one deploy. The eight containers are the same code started with different entrypoints.

The spec calls this a modular monolith, multi-process, and it was a deliberate choice against the microservices option that I also wrote down and rejected.

## What runs

The platform is deployed as roughly these processes:

- `api`: the FastAPI service for the dashboard and the REST sending API
- `smtp-submission`: accepts mail from customers' SMTP clients on 587 and 465
- `smtp-mx`: accepts inbound mail on port 25, including bounces and complaints
- `delivery-worker`: takes queued messages, signs them, looks up MX records and delivers
- `general-worker`: campaigns, automations, webhooks, tracking events
- `scheduler`: periodic jobs such as warm-up steps and retention cleanup
- `frontend`: the Next.js dashboard
- infrastructure: PostgreSQL, Redis, Dovecot, Rspamd, Caddy

The Python containers all build from the same image. Scaling means changing a replica count in the Compose file for the process that is busy, which in practice is the delivery worker.

## Why not microservices

The microservices argument is usually about independent deployment, independent scaling and team autonomy. On a single VPS with one engineer, two of those three do not apply.

Independent scaling I get anyway, because each process is its own container. Independent deployment I do not want: the schema is shared, and deploying the API without the worker that understands the new column is how you get a 3 a.m. incident. Team autonomy is not a concern for a team of one.

What microservices would add is failure points. Every service boundary is a network call that can time out, a serialisation format that can drift, and a second place to configure secrets. On one machine, the network between services is the loopback interface, so I would be paying the full complexity cost for none of the isolation benefit.

The spec is blunt about it: no benefit on a single VPS, many more failure points.

## Where the modularity actually lives

A monolith goes wrong when it becomes a ball of mud, so the boundaries are inside the package rather than between deployments. Each domain is a module: auth, orgs, domains, messages, delivery, bounces, tracking, templates, campaigns, automations, contacts, mailboxes, billing, and so on.

The rules are written down and enforced in review:

- A module may import another module only through that module's `service.py`. Models are importable for relationships, nothing else.
- Routers stay thin. A route parses input, calls a service function, and returns the response. No business logic in the HTTP layer.
- Service functions take `org_id` explicitly. That is the tenant boundary, and it is a signature-level rule rather than a convention.
- Raw SQL is allowed only where the spec names it: the queue claim and a few analytics queries. Everything else is SQLAlchemy 2.0 async.

That last rule matters more than it looks. Raw SQL is where tenant filters get forgotten, so confining it to a handful of reviewed places keeps the security boundary auditable.

## The deployment

Docker Compose runs it all, with Caddy in front for TLS and routing. There is a production Compose file and a development one, a Makefile for the common operations, and scripts for server bootstrap, backup and restore.

A deploy is a pull, a rebuild and a migration, triggered by CI after the test suite passes on `main`. Because every process is the same image, there is no version skew between containers after a deploy.

## When this stops being right

A modular monolith has a ceiling, and it is worth knowing where. If one process needed a different language runtime, or if the delivery workers needed to live in several regions for reputation reasons, or if there were ever several teams, then some of those modules would become services. The module boundaries are designed so that extracting one is a mechanical change: the `service.py` interface becomes a client, and the callers do not know the difference.

Until then, the boring option wins. One codebase, one schema, one deploy, eight processes.

## Takeaway

The architecture question is not "monolith or microservices". It is "where are the boundaries, and what do they cost to cross". Put the boundaries in the code, where crossing them is a function call and breaking them is a code-review comment. Put them between deployments only when something real, such as a second team or a second region, forces it.
