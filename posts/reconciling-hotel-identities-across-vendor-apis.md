---
title: "One hotel, five identifiers: reconciling identities across vendor APIs"
date: 2026-03-24
description: "Why the hardest problem in a multi-source analytics platform is agreeing on which hotel a row belongs to, and how we made that explicit."
tags: [data-engineering, analytics, postgresql, data-quality]
---

Every data source the analytics platform I lead talks to has its own idea of what a hotel is. Google Analytics 4 has a property. Google Ads has an account and campaigns whose names may or may not contain the hotel's name. Meta has ad accounts and pages. Review platforms have listings. A brand's own data files use a hotel code that changes when the property is rebranded or sold. The platform's job is to show one property's performance across all of them, which means the first problem is not analytics at all. It is identity.

## How it starts

In the early days of a platform like this, identity is handled where it is noticed: in the query. A paid-media module joins campaigns to hotels by matching a name substring. A source-traffic module has a `CASE` expression that maps a vendor's channel labels onto ours. Each works, each is a few lines, and each is slightly different from the others.

This is fine for three modules. We have eighteen. When a hotel's code changed after an ownership change, we found out which modules had their own matching logic by watching which reports went wrong, one at a time, over the following weeks.

## Mapping tables, not matching code

The change that stuck was to make every identity decision a row in a table rather than a line in a query.

**Source mappings.** Paid-media source mapping and source-traffic source mapping tables record, per hotel, which vendor account, campaign or channel label corresponds to which of our entities. A module reads the mapping; it does not guess. A new vendor label that has no mapping shows up as unmapped, which is a data-quality finding, not a silent misattribution.

**Hotel-code change requests.** When a property's code changes, nobody edits rows by hand. There is a change-request workflow: the request records the old code, the new code, the effective date and who approved it, and a process applies it across the tables that carry the code. The history is kept. A year later, when someone asks why a hotel's numbers jump in a particular month, the answer is one query away.

**A matching service.** Some sources do not give us an identifier we control, only a name. For those we have a hotel-matching service with a name matcher that proposes candidates and a confidence, and a person confirms. The confirmed match becomes a mapping row. The matcher is a tool for creating mappings, never a runtime shortcut.

## Why "fix it in the query" fails

The argument for inline matching is always the same: it is quick and the mapping table feels like ceremony. Here is what the ceremony buys.

- **One place to fix.** A mapping error is corrected in one row and every module is correct on the next run.
- **Auditability.** Mappings have timestamps and authors. Query logic has a git blame at best.
- **Completeness checks.** You can count unmapped identifiers. You cannot count the cases a substring match silently got wrong.
- **Onboarding.** Adding a hotel is a set of mapping rows, which the admin frontend can create. It is not a code change.

In the ETL redesign we started this year, this became a principle: an identifier-resolution hierarchy is defined once, and every layer resolves identity through it before any transformation runs.

## The residue

Not every identity question has a clean answer. Campaigns that advertise several hotels at once, review listings that cover a complex of properties, ad accounts shared across a brand: these need rules, and the rules need owners. What the mapping-table approach gives you is a place to put the rule and a way to see when it does not apply. What it does not give you is the rule itself. That still takes a conversation with the people who know the portfolio.

## Takeaway

In a multi-source platform, identity is data, not logic. Put it in tables with history, make "unmapped" a visible state, route changes through a workflow with an approver, and keep matchers as tools for humans rather than as runtime magic. It feels slower for the first three hotels. It is the only thing that works for the next three hundred.
