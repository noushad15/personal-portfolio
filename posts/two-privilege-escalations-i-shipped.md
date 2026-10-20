---
title: "Two privilege escalations I shipped, and the rules that came out of it"
date: 2026-08-25
description: "InkPigeon's custom-roles feature passed its tests and still had two ways to escalate privileges. What a dedicated adversarial pass found, and the rules it produced."
tags: [security, authorization, inkpigeon, engineering-practice]
---

In early August I shipped custom roles for InkPigeon: an organisation owner can define a role, give it an allow-list of modules, and assign it to members. The feature had unit tests, the happy paths worked, and the dashboard looked right.

It also had two privilege-escalation holes. Neither was caught by the tests, because the tests checked that the feature did what it should. They did not check what else it allowed. The holes were found only when I sat down afterwards and attacked the change as if I were a hostile member of a tenant.

## The access model

For context, the model is in two dimensions.

Capability is a ladder: `viewer < member < admin < owner`, enforced by a `require_user_role` dependency. Modules are an allow-list on custom roles: a role with `modules = ["messages", "contacts"]` can only reach those routers, and `modules = NULL` means everything. The allow-list is enforced by a `require_module(<name>)` dependency attached at router level to every tenant router. Owners and API keys bypass the module gates.

One module, called `settings`, is organisation administration: members, custom roles, API keys, SMTP credentials, audit logs, billing and editing the organisation itself. All of it sits behind a single gate. The only ungated organisation route is `GET /org`, because every page needs to load it.

## Hole one: a route that could mint a stronger credential

The module gates were on the routers I thought of as sensitive. One route for creating API keys was not behind the `settings` gate. On its own that route looked harmless: a member creating a key to use the API.

But API keys in InkPigeon act organisation-wide and bypass module gates. So a member restricted to the `contacts` module could create an API key and, with it, reach every module. The restriction was decorative. Anything that can create an API key, create an SMTP credential, or invite an admin is equivalent to full access, and must sit behind the strictest gate.

## Hole two: editing your own membership

Member management let an admin change a member's role or custom role. The check was that the caller was an admin. It did not check that the target was someone else.

An admin could therefore promote themselves to owner, and a member with a custom role that happened to include the settings module could edit their own row to remove the restriction. Once I saw it, it was obvious. Before I saw it, it was a feature working as designed.

## The rules

Both fixes were small. The value was in writing down why they were needed, so the same shape of mistake does not come back in the next authorisation change. These are now in the project's standards file, and any change to auth, roles, permissions, members, API keys or invites must end with an explicit adversarial review before it counts as done.

**Map the full bypass surface, not just the obvious routes.** A restriction is worthless if any ungated route can produce a stronger credential. When adding a router or a new permission dimension, list every `APIRouter(` in the codebase and decide its gate explicitly. The absence of a gate must be a decision, never an omission.

**No self-service on your own access.** Nobody may modify their own member row, their own role or their own custom role. This is enforced in the service layer, not in the UI, so it holds for the API too.

**Every router's gate is explicit.** Router-level dependencies, not per-route decorators that are easy to forget on the next endpoint someone adds.

**Attack your own change.** The happy-path tests prove the feature works. A separate pass, with the question "how would I abuse this", proves it does not work too well. That pass is now part of the definition of done for anything touching access.

## Why tests did not catch it

This is the part worth dwelling on. The tests were good tests of the feature. The holes were not in the feature; they were in the interaction between the feature and routes that already existed. A test for "custom role cannot reach the messages module" passes even when the same role can create an API key that can.

Unit tests check what you thought of. Adversarial review is for what you did not. The two are not substitutes.

## What I'd do differently

I would have done the adversarial pass before shipping rather than after. The gap between the two was short and nothing was exploited, but that was luck, not process. The rule that fixes this is the mandatory review step, and it exists because I needed it, not because a checklist said so.

I would also have started from the bypass surface rather than the feature. The right first question for any permission work is "what, today, can produce a credential or elevate a role", and the answer is a list that the new feature must not extend.
