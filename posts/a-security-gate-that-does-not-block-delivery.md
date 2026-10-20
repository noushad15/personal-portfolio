---
title: "A security gate that doesn't block delivery"
date: 2026-04-07
description: "How I built our GitHub Actions staging pipeline to fail on security findings by default while letting a reviewer approve a deployment with a record."
tags: [ci-cd, github-actions, security, kubernetes]
---

Security scanning in a deployment pipeline has a well-known failure mode: it starts strict, blocks a release on a finding nobody can fix that day, and within a month someone adds `continue-on-error: true` and the scan becomes decoration. I wanted the staging pipeline for the analytics platform I lead to stay strict without becoming the thing the team routes around. This is the design that has held up.

## What runs

The workflow runs on pushes to the staging branch and can be dispatched by hand. It has five stages.

**Snyk.** Dependency and code scanning on the repository, then a scan of the Docker image we are about to ship. Reports are uploaded as workflow artefacts.

**Trivy.** A second opinion on the same image and filesystem, configured for vulnerabilities, secrets, licences and misconfigurations. Two scanners overlap, but they catch different things, and the cost is a couple of minutes.

**Notify.** A job that reads both report artefacts and posts a summary of findings to the team's task tracker, so a finding becomes a ticket with an owner rather than a red icon on a page nobody opens.

**Security gate.** A job that requires a reviewer's approval before anything is built. It uses a GitHub environment with required reviewers, so the approval is recorded with a name and a timestamp.

**Build and deploy.** Build an ARM image, push it to ECR, update the kubeconfig for the EKS cluster and roll out the `web`, `celery-worker` and `celery-beat` deployments.

## Fail by default, approve with a record

The gate is the part worth explaining. Scans fail the pipeline by default. There is no silent pass. But a failing scan does not end the story; it routes to a human.

When a scan reports findings, the gate job waits. A reviewer looks at the findings in the tracker and either fixes them, which re-runs the pipeline, or approves the deployment anyway. If they approve, the workflow writes exactly what happened into the step summary: which scans failed, what the outcomes were, and a warning that the deployment proceeded with known findings.

```yaml
- name: Deployment approved — proceeding despite security findings
  run: |
    echo "A reviewer approved deployment with the following scan outcomes:" >> "$GITHUB_STEP_SUMMARY"
    echo "::warning::Deployment approved with known security findings."
```

The approval is not a bypass. It is a decision, by a named person, with the evidence attached. The next person to look at the deployment history can see that the release went out with a known issue, and the ticket in the tracker says what the issue was.

## Two escape hatches, both loud

The workflow has two manual inputs, and I thought hard about whether to include them.

`deploy_only` skips the tests and scans entirely and runs only the build and rollout. It exists for the case where staging is broken by an infrastructure problem and you need to redeploy a known-good image now. `bypass_staging_security_gate` lets the scans run but prevents failures from blocking.

Both write a warning to the step summary when used. Neither is the default. The point of making them explicit inputs rather than something people hack into the YAML is that their use is visible in the run history. An engineer who uses `deploy_only` three times in a week has a problem worth asking about, and now you can see it.

## Why this fits a small team

A large organisation can afford a security team that triages findings. We cannot. The alternative to this design is one of two bad options: block every release until every finding is fixed, which is impossible when a base image ships with a CVE that has no patch yet, or disable the scans, which is what happens in practice when the first option is chosen.

The gate turns a binary into a judgement with an audit trail. Most runs are clean and nobody notices the gate. When a run is not clean, one person spends ten minutes deciding, and the decision is recorded. That is proportionate.

## What I'd do differently

I would add a severity threshold earlier. The first version treated a low-severity licence note the same as a critical vulnerability, which meant the gate fired more often than it should have and trained people to approve quickly. Routing only high and critical findings to the gate, and the rest to the tracker without blocking, is the version I would start with. I would also keep the production workflow identical to staging apart from the target cluster; divergence between the two is where surprises come from.
