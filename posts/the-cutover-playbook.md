---
title: "The cutover playbook: swap a base URL, add a pipe, prove it on auth first"
date: 2026-06-23
description: "How we move frontend modules from legacy endpoints to a new backend one constructor at a time, and why the first cutover is the one that matters."
tags: ["frontend", "api-design", "legacy", "migration"]
---

Six modules of the analytics platform I lead are already implemented in the new backend architecture. The frontends still call the old endpoints for all six. Closing that gap is the "cutover" category of our refactor program, and it is the category where the work is cheapest and the process matters most, because it is the playbook we will reuse for everything after.

## Why cutover is cheap

The frontends have one property that makes this tractable: API configuration is centralised. Each service class sets its base URL once in its constructor, something like `${environment.baseUrl}/v1/hotels`, rather than scattering full URLs across call sites. A cutover is therefore a constructor-level change per service, not a search through the codebase.

The second ingredient is a response pipe. The old backend returns snake_case keys; the new architecture returns a different shape and the frontend expects camelCase. Rather than touching every component, the service wraps responses in an `objectToCamelCase` transformation. Two services, roles and users, were migrated during the auth work and now serve as the reference implementations. When a team member starts a cutover, the instruction is: look at how those two do it, do the same.

So a cutover is: swap the base URL in the constructor, add the pipe on responses, then find and handle any stray call sites that bypassed the service. That last step is where the surprises live.

## Prove it on auth first

Auth is essentially done. Its remaining defect is a single stray call: an update to the terms-and-conditions agreement that still goes to an old user endpoint from inside the auth service.

That single call is the pilot. Fixing it proves the whole playbook end to end on the lowest-risk module: the constructor change, the pipe, the stray-call hunt, the testing, the deploy through the security-gated pipeline, the verification in staging. If any step of the playbook is wrong, we find out on one call in a module we understand completely, rather than on hotel data with nine endpoints and a contacts sub-resource.

Only after the pilot do the others follow, in rough order of blast radius: enterprise, brand and sub-brand with four or five endpoints each in both frontends, then hotels with nine endpoints and a sub-resource, then ownership groups, which are already on the new path prefix but still on old-architecture code.

## The build category shares one template

Four analytics modules do not exist in the new architecture at all: visits and revenue, source traffic, top referring domains and channel mix. They are the "build" category, and the plan for them follows the same instinct as the cutover plan: do one carefully, then copy.

Visits and revenue goes first because it has the cleanest schema and the lowest complexity. It becomes the template: the module layout, the query patterns, the response shapes, the tests. Source traffic and top referring domains copy it almost directly. Channel mix copies it with one added complication, a multi-source rollup, which is easier to add to a working template than to design from scratch.

One rule attached to this: the scheduled job that pulls analytics data travels with its data module. The sync cron serves all four modules, so it migrates with the first of them rather than as a separate work stream that could drift out of step.

## Why order matters more than speed

It would be faster, on paper, to assign all six cutovers at once to six people. It would also mean six people discovering the same stray-call pattern independently, six slightly different pipe implementations and no playbook at the end.

Sequencing the pilot first costs a sprint. It buys a written procedure, two reference implementations that are known to be correct, and a team that has seen the whole path once before doing it under more pressure. For the year-three rewrites, where the modules are thousands of lines, that shared understanding is the difference between a plan and a hope.

## What the stray calls teach

Every stray call we have found so far is a small story about how the old code grew: a component that needed one field and called the endpoint directly rather than through the service, a utility written before the service existed, a quick fix that was never routed back. None of them are wrong on their own. Together they are the reason "swap the base URL" is not the whole job and why the playbook explicitly includes hunting for them.

## Takeaway

Make the first migration the smallest one, do it completely, and write down what you did. The constructor swap and the pipe are the easy part; the playbook that comes out of the pilot is the actual deliverable.
