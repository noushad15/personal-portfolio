---
title: "Four tools are enough: designing a bounded coding-agent loop"
date: 2026-02-11
description: "How I built an agent that turns well-specified tickets into pull requests with four tools, hard limits and a provider abstraction."
tags: [llm, agents, python, automation]
---

I wanted a way to turn the well-specified, low-risk tickets in our backlog into reviewable pull requests without a person sitting in an IDE for each one. The result is an agent that reads tasks from ClickUp, clones the target repository, lets a model implement the change with tests, opens a pull request and reports back to the task. This post is about the design, and specifically about keeping the loop small.

## Two versions

The first version was written in Node.js and drove the Claude Code CLI as a subprocess. It worked, but it meant an external binary, a login, and an interaction model I did not control. The second version is Python and calls the model APIs directly, using their native tool-calling. No CLI, no shell-out to an editor, and I can run it as an MCP server for Claude Desktop or Cursor, as a command-line tool, or headless behind a small FastAPI service.

## The loop

The core is an ordinary agentic loop:

1. Fetch tasks from a ClickUp list that match a configured status, skip any that already carry a `created_pr` tag, and sort by priority.
2. For each task, read the base and target branch names from the description, check whether a pull request already exists, and clone the repository onto a feature branch.
3. Fetch the project's instruction file from GitHub (cached), build the prompt, and start the conversation with the model.
4. Loop: the model calls a tool; the harness executes it and returns the result; repeat until the model declares it has implemented the change, written tests, run them, committed and pushed.
5. Open the PR with the GitHub CLI, post the URL as a comment on the task, add the tag.

The model only ever acts through four tools: `bash`, `read_file`, `write_file` and `str_replace`. That is deliberately fewer than most agent frameworks offer, and it has held up.

## Why four tools

Every tool you add is a surface the model can misuse and a surface you must sandbox. The four above cover what a developer actually does: look at code, change code, run things. Git operations, test runners and package managers are all reachable through `bash`, so they do not need their own tools. The `str_replace` tool exists because models are far more reliable at targeted edits than at rewriting whole files, and a targeted edit is easier to review in the run log.

```python
TOOLS = [
    {"name": "bash", "description": "Run a shell command in the repo", ...},
    {"name": "read_file", ...},
    {"name": "write_file", ...},
    {"name": "str_replace", "description": "Replace one exact occurrence", ...},
]
```

The provider abstraction is a single interface with two implementations, Claude and OpenAI. Switching is one environment variable. The two APIs differ in how they represent tool calls, and keeping that difference inside the provider class means the loop itself has no idea which model is running.

## Bounds

The loop is bounded in three ways, and all three have fired in practice.

- **Iterations.** A maximum number of tool calls per run. A model that is thrashing on a failing test will not run forever.
- **Timeout.** A wall-clock limit per run, because a `bash` call that starts a dev server never returns on its own.
- **Output budget.** Every tool result is truncated to a configurable number of characters. The first time a model ran a test suite with verbose logging, the result blew the context window in one call. Truncation with a clear "output truncated" marker fixed it, and the model learned to grep.

There is also a dry-run mode that walks the task list and prints what it would do without cloning anything. I used it constantly while tuning the selection rules.

## What the harness owns

The model proposes; the harness decides. Branch naming, the skip-if-PR-exists check, the tag that prevents reprocessing, the retry policy and the cost ledger all live in code, not in the prompt. That split is the whole design. A prompt that says "please don't open duplicate PRs" is a hope. A check against the GitHub API before the loop starts is a guarantee.

## What I'd do differently

Sandboxing. The agent currently runs with the permissions of the user who starts it. For my own use that is acceptable; for a team it is not. The next version runs each task in a disposable container with the repository mounted and nothing else. I would also have the agent run the project's CI locally before opening the PR, so the first thing a reviewer sees is green rather than a red check and a follow-up commit.
