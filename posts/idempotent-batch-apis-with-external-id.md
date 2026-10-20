---
title: "Idempotent batch APIs with an external_id"
date: 2026-10-19
description: "Designing a certification platform's provider API so retried batches never duplicate certificates and partners can integrate without talking to us."
tags: [api-design, fastapi, idempotency, integrations]
---

CPDQC is a CPD accreditation hub I rebuilt from WordPress onto FastAPI, Postgres 16 and Next.js. Training providers apply and get accredited, learners get a verified CPD student number and, in later phases, one record of all their CPD. The part of the system I want to write about is the provider API, because it is the first part other platforms depend on, and that changes how you design it.

## Who calls it

A provider with an accredited membership gets API keys from their dashboard. With a key they can create courses, manage listings and issue certificates, either one at a time or in batches. The first partner on it is a training platform that issues certificates to its learners as they complete courses, which means the calls come from a cron job or a queue worker, not from a person clicking a button.

That is the whole design constraint. Automated callers retry. Networks drop responses after the server has committed. A worker gets restarted halfway through a batch of two hundred certificates. If the API treats every request as new, the learner ends up with three identical certificates and the provider ends up with a support ticket.

## external_id

Every object a provider creates through the API carries an `external_id`: the provider's own identifier for that course, listing or certificate. The server treats `(provider, object type, external_id)` as unique. Sending the same `external_id` again does not create a second row; it returns the existing one.

```python
@router.post("/certificates/batch")
def issue_batch(items: list[CertificateIn], provider=Depends(api_key_provider)):
    results = []
    for item in items:
        cert = repo.get_by_external_id(provider.id, item.external_id)
        if cert is None:
            cert = repo.create(provider.id, item)
        results.append(CertificateOut.from_row(cert, created=cert.created_now))
    return results
```

The batch endpoint applies the same rule per item. A retried batch of two hundred, of which one hundred and twenty had already been committed, produces one hundred and twenty "already exists" results and eighty new certificates. The caller doesn't need to know where it failed last time; it just sends the batch again.

Two details make this work in practice. The uniqueness is enforced by a database constraint, not only by the lookup, so two concurrent retries of the same batch can't both insert. And the response is the same shape whether the row was created or found, so the client has one code path.

## Why not a request-level idempotency key?

Stripe-style idempotency keys, one per HTTP request, are the other common pattern. They are the right tool when the request is the unit of work. Here the unit of work is the certificate. A provider may rebuild its batch differently on retry, splitting it into smaller chunks after a timeout, and a request key would treat the smaller chunks as new work. Keying on the object the provider already has an identifier for matches how their systems think.

## Everything issued is verifiable

A certificate is only useful if a third party can check it. Each one gets a code, and there is a public `/verify` page that checks provider numbers, course numbers, student numbers and certificate codes. Certificates have their own page with a QR code and a PDF download. When a provider issues one through the API for a learner who already has an account, it appears on that learner's record automatically; otherwise the learner gets an emailed claim link.

Providers and courses also get embeddable SVG badges, so an accredited course page on the partner's site can show its status and link back to the verification.

## Keeping the directory honest

Course listings carry an "available on" link to the provider's platform. Links rot. A daily `check-links` cron tests them, hides the ones that keep failing from the public catalogue and emails the provider. The provider API has no say in that; it is the platform protecting its own directory from stale entries, which is also what makes the directory worth being listed in.

## Takeaway

For an API that machines call, the first question is not "what are the endpoints?" but "what happens when the caller sends the same thing twice?". Answer it with an identifier the caller already owns, enforce it in the database, and make the response identical either way. The partner integration shipped against that API with no coordination calls, which is the only review of an API design that counts.
