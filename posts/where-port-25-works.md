---
title: "Where port 25 works: hosting an email platform in 2026"
date: 2026-09-01
description: "Most cloud providers will not let you send mail on port 25. How that constraint shaped where and how InkPigeon runs."
tags: [email, infrastructure, hosting, inkpigeon]
---

If you build an email service provider, your hosting decision is made for you before you compare prices or regions. You need to open outbound connections on port 25 to arbitrary mail servers on the internet, and most clouds will not let you.

This is not a misconfiguration you can fix with a support ticket. On DigitalOcean, GCP and Azure, outbound SMTP on port 25 is blocked for new accounts and, in practice, never unblocked for a small customer. The providers are protecting their IP reputation from spammers, and from their point of view a new account that wants to send mail directly looks like a spammer. The ones that do unblock typically want a history you cannot have yet.

## Where InkPigeon runs

InkPigeon runs on a Contabo VPS: Ubuntu 24.04, Docker Compose, Caddy for TLS. Port 25 is open both ways, which is the whole reason it is there.

The trade is that a VPS provider gives you less than a hyperscaler: no managed database, no managed queue, no load balancer, no magic autoscaling. For InkPigeon that is fine, because the architecture is a modular monolith on one machine by design and the queue lives in PostgreSQL. The things I would be giving up are things I had already decided not to use.

What I do have to do myself is operations: backups, restores, metrics, alerts, server bootstrap. Those are scripts in the repository, and a runbook describes them.

## Reputation is infrastructure

Delivering mail directly to recipient MX servers means my IP addresses are what receiving servers judge. That makes several things that are usually "DNS chores" into load-bearing infrastructure.

Every sending IP has a reverse DNS record that matches its forward name. Each customer domain is verified for SPF, DKIM and DMARC before it can send, and the platform signs outgoing mail with DKIM keys it holds for that domain. Sending goes through a multi-IP pool, so that reputation can be managed per IP and a new IP can be warmed up gradually rather than blasting from a cold address.

I am deliberately not going to put deliverability numbers in this post. Reputation is a moving target, and the honest answer at this stage is that the mechanics are in place and the warm-up is ongoing.

## From Postfix to an in-process stack

The first iteration of the sending side was a Postfix multi-instance configuration, one instance per IP in the pool. Postfix is excellent, and the configuration worked.

The problem was ownership. The platform needs to know, per message and per tenant, exactly what happened: which IP sent it, what the remote server said, whether to retry and when. Getting that out of Postfix means parsing logs and reconciling them with queue state, and the queue state was already in my database.

The current stack keeps SMTP inside the Python processes. Inbound submission and MX use `aiosmtpd`; outbound delivery uses `aiosmtplib` with `dkimpy` for signing and `dnspython` for MX lookups. A delivery worker claims a message from the Postgres queue, signs it, resolves the MX, delivers, and writes the result to the same row. No log parsing, no reconciliation, and the per-IP behaviour is a parameter of the worker rather than a separate daemon.

The Postfix configuration still exists in the history, and I learned a lot from it. It is just the wrong boundary for a product whose main job is to know what happened to each message.

## The rest of the operations

Caddy terminates TLS for the dashboard and API and renews certificates on its own. Backups are a script that dumps PostgreSQL and the volumes, with a restore script that has been exercised, not just written. Prometheus scrapes the application's metrics and Grafana shows them: queue depth, delivery outcomes, bounce rates, worker health. Alerts are defined on the metrics that would wake me up.

CI deploys to the server over SSH only after the test suite, including an end-to-end send through Mailpit, passes on `main`.

## What I'd do differently

I would have picked the VPS first and designed around it, rather than designing first and then discovering the port-25 constraint. In this case the designs matched, but that was partly luck.

I would also have started the IP warm-up schedule as soon as the addresses were allocated, before the platform was finished. Reputation takes calendar time, and that clock does not care whether your dashboard is done.
