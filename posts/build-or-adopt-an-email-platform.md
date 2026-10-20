---
title: "Build or adopt: why InkPigeon doesn't run on Mailu or Postal"
date: 2026-08-04
description: "I evaluated five open-source mail products before building InkPigeon's own pipeline. Here is what each one is, and why only two components survived."
tags: [email, architecture, build-vs-buy, inkpigeon]
---

The first serious question in building InkPigeon was not technical. It was whether to build at all. Email is one of the oldest problems on the internet, and there are mature open-source projects that will run a mail server for you in an afternoon. If one of them could carry a multi-tenant email service provider, writing my own SMTP pipeline would be vanity.

So before any code, I spent the planning phase asking the question properly, product by product.

## What InkPigeon has to be

The scope is fixed in the spec and it has three surfaces.

The core is an outbound email service provider in the SendGrid or Mailgun sense. A customer adds their own domain, verifies SPF, DKIM and DMARC records, and then sends transactional mail through an SMTP relay or a REST API. On top of that sit marketing campaigns, automations and templates. The platform delivers directly to recipient MX servers, processes bounces and complaints, tracks opens and clicks, fires webhooks and shows analytics.

The second surface is optional: hosted mailboxes on the customer's domain, with IMAP and a built-in webmail. A tenant who only wants to send never touches it.

The third is billing: Stripe subscriptions with metered overage.

Any product I adopted would have to carry most of that, or at least not fight it.

## The mailbox products

Mail-in-a-Box, Mailu, Zimbra and Carbonio all came up early because they are what people recommend when you say "self-hosted email". They are good at what they do. But what they do is mailboxes and groupware: accounts, folders, calendars, admin panels for one organisation.

None of them has a multi-tenant SaaS layer where unrelated customers bring their own domains and are isolated from each other. None of them has a send API with API keys, a campaign engine, click tracking, IP warm-up or metered billing. Those are not missing features that a plugin could add; they are a different product category.

Adopting one would have meant running a second user and admin system in parallel with my own, and then spending the life of the project reconciling the two. Every customer-facing feature would have been a workaround.

## Postal

Postal is the closest thing to an open-source ESP, and I took it seriously. It is outbound-focused, it has a proper sending model, and it is used in production by real companies.

Two things ruled it out. It is written in Ruby, and InkPigeon's stack is Python 3.12 with FastAPI and SQLAlchemy. Adopting Postal would have meant either maintaining two stacks or abandoning the one I know best and had already designed the rest of the platform around. And it is outbound-only, so the hosted mailbox surface would still have needed something else.

The deeper problem was roadmap control. An ESP is the product. If the sending pipeline, reputation handling and bounce processing live in someone else's codebase, then the product's most important behaviour is decided by someone else's priorities.

## What survived: two commodity components

The evaluation did produce two clear adoptions. Dovecot handles IMAP and LMTP for hosted mailboxes, and Rspamd handles spam filtering. Both run as containers next to the platform.

The reasoning is symmetrical to the reasoning above. An IMAP server and a spam filter are commodities: well-specified protocols, decades of hardening, and nothing customer-facing that I would want to differentiate on. Writing my own IMAP server would be the vanity project; running Dovecot is just sound engineering.

Everything the customer sees or pays for is built in the platform: domains and DNS verification, API keys and SMTP credentials, the message queue, delivery, bounces, tracking, campaigns, automations, templates, billing, the dashboard.

## Why the line sits where it does

The rule I ended up with is simple: adopt where the protocol is the product, build where the customer experience is the product.

IMAP is a protocol. Spam scoring is a well-understood service with no tenant-specific behaviour I care about. Both go behind a container boundary.

Sending mail for many tenants from a shared infrastructure, with per-tenant reputation, billing and isolation, is the entire business. That is where every design decision should be mine, and where I should be able to change behaviour in an afternoon without filing an upstream issue.

The decision is recorded in the spec with the rejected options and the reasons, so that in a year I don't re-litigate it when some new project appears on Hacker News.

## What I'd do differently

I would write the "rejected, with reasons" table on day one rather than at the end of the evaluation. I had the conclusions in my head for a week before they were on paper, and during that week I kept half-reopening the question. The written table closed it.

I would also have looked at Postal's bounce-classification logic in more detail before building my own. Not to adopt the code, but because the categories it uses encode years of real-world bounces, and reading them is cheaper than rediscovering them.
