---
title: "Replacing a five-year rewrite with a bounded migration"
date: 2026-05-26
description: "Our plan to migrate all 18 modules to a new architecture would have taken 3.5 to 6 years. Here is how we replaced it with a target the company could actually reach."
tags: ["architecture", "legacy", "leadership", "estimation"]
---

In the spring of 2025 the analytics platform I lead committed to a refactor program: migrate every module from the old architecture to a new one, then sunset the old one. It was the right ambition and the wrong plan. This month I wrote the engineering brief that replaced it. This post is about how we got from one to the other.

## What the first year taught us

The first module to move was authentication and permissions, together with the foundations every later module would need: the new service structure, role-based access, the request pipeline. It took roughly eight to eleven months, depending on where you draw the start line.

Some of that was foundation work that will not repeat. But a fuller audit of what "all modules" actually meant made the picture worse, not better. The original work breakdown had undercounted several subsystems that had grown since it was written: data quality, data completeness, the parser pipeline for hotel data files, the AI report service. With those included and the observed pace applied, full sunset of the old architecture came out at three and a half to six years on current capacity.

The company's strategic timeline does not have six years in it. Nobody's does.

## The new target

The brief sets a different goal: a clean, modern core with a bounded, documented legacy tail, demonstrated migration competence, and a realistic window of one and a half to two and a half years. Not "the old architecture is gone", but "the old architecture is small, known, stable and wrapped".

The important word is bounded. A legacy tail that nobody has listed is a liability. A legacy tail with a written disposition for every module is a maintained part of the system.

## Seven categories, one per module

The program now sorts every module into exactly one of seven categories.

**Cutover.** Six modules already implemented in the new architecture, with frontends still calling the old endpoints. The work is a switch, not a build.

**Delete.** Seven groups of old endpoints that a code audit shows have no callers anywhere. These will be removed, after access logs confirm there are no external consumers the code audit could not see.

**Straggler.** Four groups with one or a handful of remaining calls each. Each needs a specific decision: migrate the call, build the equivalent, or keep the old endpoint alive deliberately.

**Build.** Four analytics modules that need to exist in the new architecture and do not yet. They share enough structure that one template drives all four.

**Wrap.** Stable, low-churn modules that stay on the old architecture indefinitely, behind the proxy. They work, they rarely change, and migrating them buys nothing.

**Out of scope.** Subsystems managed separately: the parser pipeline, data quality, data completeness, the task manager. If a refactor ticket turns up in these areas, it is moved out.

**Year three.** The hardest rewrites, planned in year two and executed in year three: paid media at around five thousand lines of accumulated logic, scorecards, social, reviews, and a report module that is a single three-thousand-line file. Last to rewrite, because every other migration teaches us something about how to do these.

The rule that each module maps to exactly one category sounds trivial. It is the thing that ended the ambiguity. Before, every module was implicitly "to be migrated eventually". Now a module in "wrap" is not a failure of the program, it is a decision of the program.

## What we finish first

The brief is also explicit about closing out current commitments before ramping into the new plan: the tail of the auth project, tagging every in-flight ticket with its new category, adding the fields to the tracker that let us measure sprint commitment reliability, and piloting the cutover on the lowest-risk module to prove the playbook before applying it elsewhere.

## Lessons about estimates

The original estimate was not careless. It was made before anyone had migrated a module, and it was made against a scope that had since grown. Both are normal. The failure would have been continuing to plan against it after we had evidence it was wrong.

The hard part of writing the brief was not the categories. It was writing the sentence "full sunset is achievable but takes 3.5 to 6 years" and sending it to people who had approved a shorter plan. The alternative, letting the program run on and discovering the gap in year three, would have cost far more than the uncomfortable paragraph.

Two things made that sentence easier to send. First, it came with the evidence: the measured duration of the first module, the audit of undercounted scope. Second, it came with an alternative that the company could actually reach. A problem without a proposal is a complaint; a problem with a bounded plan attached is a decision.

## What I'd do differently

I would have put the measurement instrument in place at the start of the program, not a year in. Knowing in month four that one module was tracking to ten months would have triggered this rethink two quarters earlier. The categories could have been drawn then, with less sunk cost on both sides.
