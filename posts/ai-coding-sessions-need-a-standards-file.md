---
title: "AI coding sessions need a standards file"
date: 2026-07-14
description: "I use AI coding assistants heavily. The thing that keeps them from drifting is not a better prompt but a written standards file that outranks the model."
tags: ["ai-assisted-development", "engineering-practice", "llm", "process"]
---

I use AI coding assistants for a large share of the implementation work on my own products, and an agent I built turns tracked tickets into pull requests at work. I am not shy about this. What I have learned is that the quality of what comes out has very little to do with the model and a great deal to do with one file: the written standards the session is required to follow.

## It started as an instruction file for the agent

The coding agent fetches a per-repository instruction file from GitHub before it starts a task. The file says how the project is structured, how tests are run, what a finished change looks like. The agent compresses it, caches it and includes it in every prompt for that repository.

The first version of that file was short and the agent's pull requests were plausible but wrong in recognisable ways: tests that asserted the code ran rather than that it was right, helper functions duplicated because the existing one was in a module the agent never opened, changes to one layer that should have been in another. Every one of those was a missing rule, not a missing capability. Each time, the fix was a sentence in the file, and the failure stopped recurring.

That is the whole insight. A model follows the rules it is given with more consistency than most people do. If the rules are not written, it follows whatever it inferred from the last file it read.

## What the standards file says

For my own products, the standards file sits at the root of the repository and every session reads it first. The rules that earn their place are the ones that prevented a real failure.

**The spec is final.** The product has a set of locked design documents: stack, schema, API shapes, naming, conventions. The standards file says the session may not re-decide any of them. If the session believes something in the spec is wrong, it must stop and say so, never silently deviate. When a detail is unspecified, it picks the most boring option consistent with the spec and notes the choice in its summary. This single rule removed the most expensive category of problem: a confidently implemented alternative design.

**One task per commit.** Work proceeds through a numbered build plan, one task at a time, in order. The commit message names the task. This makes the history reviewable and makes it impossible to half-finish three things.

**Acceptance criteria must show real output.** Before a task counts as done, the session runs that task's acceptance checks, the backend test suite, the frontend build, and shows the output. Zero failed, zero skipped. "The tests should pass" is not an acceptable sentence.

**No placeholder implementations left behind.** If a task is too big for a session, it finishes a coherent vertical slice and lists exactly what remains. A function that raises "not implemented" with a comment is a lie about progress.

**Module boundaries.** Modules import each other only through their service layer. Routers stay thin: parse, call service, respond. Every tenant table carries the organisation identifier and every query filters on it, and violating that is a priority-zero bug, not a style issue.

**Operational hygiene.** New environment variables go into the config module, the example env file and the documentation in the same commit. Schema changes are new migrations, never edits to applied ones. Secrets are never logged.

## Rules learned the hard way get a section of their own

After an adversarial review of the custom-roles feature found two privilege-escalation paths that the ordinary tests had not caught, I added a section to the standards file that applies to any change touching authorisation. It says: map the full bypass surface, not just the obvious routes; nobody may modify their own access; every router's gate is an explicit decision, never an omission; and any authorisation change ends with an adversarial pass where the session attacks its own change before delivery.

That section exists because the model, like a person, tests the happy path unless told otherwise. Telling it, in writing, in a file it must read, is what changed the outcome.

## What this is not

It is not a prompt. Prompts are per task; the standards file is per project and outranks any prompt. It is not documentation for humans, though humans benefit from it. It is the contract that lets me treat the session's output as a draft from a competent colleague who has read the rules, rather than as output to be checked line by line.

And it is not a way to avoid responsibility. The architecture is mine, the rules are mine, every review is mine. The standards file is how I make those decisions once and have them applied consistently, instead of re-explaining them in every session and discovering the gaps in production.

## What I'd do differently

I would have written the file before the first session, not after the third surprise. Every rule in it today maps to a failure I could have predicted. The cost of writing a rule is a minute; the cost of discovering its absence is a pull request to unpick.
