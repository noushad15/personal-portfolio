---
title: "Test your row-level security as a non-superuser"
date: 2026-09-29
description: "RLS tests that run as the postgres superuser prove nothing. How the Intelect test suite exercises the policies for real, and what that costs."
tags: [postgresql, testing, multi-tenancy, pytest]
---

A test suite for a multi-tenant system has one job above all others: prove that tenant A cannot see tenant B. Intelect enforces that with Postgres row-level security, and for a short while I had a suite that was green and proved nothing.

## The quiet failure

Postgres policies are bypassed by superusers and by table owners. That is documented behaviour, not a bug. My first local setup used the `postgres` user for everything because that is what you get when you `docker run postgres`. Every tenancy test passed, because the ORM hook was doing the work and the policy was never consulted. Had I removed the ORM hook, the tests would still have passed.

A green test that cannot fail is worse than no test. It tells you the thing is covered when it isn't.

## Run the suite as the application role

The fix is to make the test suite connect the way production does: as `intelect_app`, a plain role that owns no tables. The suite does not assume that role exists. Its fixtures create the role if it is missing, grant it the privileges the application has in production and nothing more, and then open sessions as that role.

```python
@pytest.fixture(scope="session")
def app_role(admin_conn):
    admin_conn.execute(text(
        "DO $$ BEGIN "
        "IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'intelect_app') "
        "THEN CREATE ROLE intelect_app LOGIN PASSWORD 'test'; END IF; END $$"
    ))
    admin_conn.execute(text("GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO intelect_app"))
```

Migrations still run as `postgres` inside the fixture, because they alter tables. Application code never does.

This requires a real PostgreSQL. SQLite doesn't have row-level security, and an in-memory stand-in would test my mocks rather than my policies. `make test` spins up Postgres in Docker; without Docker you point the suite at a local Postgres 16 with `intelect` and `intelect_test` databases. The README says the suite "creates the intelect_app role itself", and that line exists because I lost an afternoon before it did.

## The tests that matter

Most of the suite is ordinary: validation, pagination, lead imports. Four tests carry the security argument, and I'd keep them if I had to delete everything else.

**Cookies don't cross tenants.** Log in on `demo.localhost`, take the cookie to another tenant's subdomain, and the request is rejected. The session is bound to a tenant, not just to a user.

**Reps see only their leads.** Within a tenant, a rep role gets the leads assigned to them. An owner gets everything. This is authorization on top of tenancy, and it's where product bugs hide.

**Raw SQL cannot read another tenant.** The test opens a session as `intelect_app`, sets the tenant context for tenant A, and runs `text("SELECT count(*) FROM leads")`. The count is A's count. Then it tries to read B's rows by id and gets nothing. No ORM involved, so the only thing that can make this pass is the policy.

**The super-admin is a separate path.** A super-admin cookie is worthless on the tenant app, and a tenant owner's cookie is worthless on the internal console. Impersonation goes through its own endpoint and leaves an audit row.

The raw-SQL test is the one I'd point to in a review. It is short, it is boring, and it is the only test in the repository that would fail if the suite silently ran as a superuser again.

## What real-database tests cost

They are slower than unit tests. Each test runs inside a transaction that is rolled back, which keeps the suite fast enough, but it is still tens of seconds rather than a few. They need Docker or a local Postgres, which is one more thing for a new contributor to set up. And they can drift: when a migration adds a table, the grant fixture has to cover it, which is why the grant is `ON ALL TABLES IN SCHEMA` rather than a list.

In exchange, the suite tests the actual security boundary of the product. For a CRM whose entire pitch is "your leads, your team, nobody else's", I don't think there is a cheaper way to get a guarantee I'd put my name on.

## Takeaway

If your tests for row-level security run as a superuser, you don't have tests for row-level security. Connect as the application role, keep migrations on a separate role, and write at least one test that bypasses the ORM entirely. That test is the one that catches the day someone "temporarily" points the app at the owner role.
