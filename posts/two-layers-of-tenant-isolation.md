---
title: "Two layers of tenant isolation: ORM hooks and Postgres row-level security"
date: 2026-09-22
description: "How a multi-tenant CRM on one shared PostgreSQL database keeps tenants apart twice: once in SQLAlchemy, once in the database itself."
tags: [postgresql, sqlalchemy, multi-tenancy, security]
---

Intelect is a white-labelled lead CRM. Each client gets a subdomain, their own branding, team and pipeline, and all of them live in one PostgreSQL database. That is the cheapest way to run a product like this, and also the easiest way to leak one customer's leads to another. The isolation design was the first thing I settled before writing a route.

The rule I set myself: no route ever writes `WHERE tenant_id = ?` by hand. If a developer has to remember the filter, one day they won't.

## Where the tenant comes from

A request to `acme.intelect.ai` hits the Next.js middleware first. It extracts `acme` from the host, rewrites the path into the `/app/*` route group and sets an `X-Tenant: acme` header. `admin.intelect.ai` rewrites to `/admin/*`. API calls are proxied to the backend with the same header.

On the backend a `TenantMiddleware` resolves the tenant from the Host subdomain first and only falls back to `X-Tenant`, which is meaningful only behind the Next proxy. It loads the tenant row and stores a `TenantContext` in a `ContextVar`. From that point on, everything downstream can ask "which tenant is this request for?" without passing an argument through every function.

## Layer one: the ORM refuses to forget

The first layer lives in SQLAlchemy. In the session module I register a `do_orm_execute` hook. Every SELECT, UPDATE and DELETE against a `TenantScoped` model gets two criteria appended through `with_loader_criteria`: `tenant_id = <current>` and `deleted_at IS NULL`. Soft deletes and tenancy are handled in the same place, for the same reason.

```python
@event.listens_for(Session, "do_orm_execute")
def _scope_to_tenant(state):
    ctx = current_tenant()
    if ctx is None:
        raise MissingTenantError()
    state.statement = state.statement.options(
        with_loader_criteria(
            TenantScoped,
            lambda cls: (cls.tenant_id == ctx.id) & (cls.deleted_at.is_(None)),
            include_aliases=True,
        )
    )
```

Writes are handled in a `before_flush` hook: it stamps `tenant_id` on new rows and refuses an insert whose `tenant_id` points at another tenant.

The detail I care about most is the failure mode. A query on a tenant model with no tenant context does not return everything; it raises `MissingTenantError`. A background job that forgot to set the context fails on its first query instead of quietly producing a cross-tenant report.

## Layer two: the database refuses too

The ORM hook protects the ORM. It does nothing for raw SQL, for an analyst's psql session, or for a bug that constructs a `text()` query. So the second layer is in Postgres.

The second Alembic migration enables `FORCE ROW LEVEL SECURITY` on every tenant table and adds a `tenant_isolation` policy. The policy compares the row's `tenant_id` with a per-transaction setting:

```sql
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON leads
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
```

An `after_begin` hook on the session runs `set_config('app.tenant_id', ..., true)` at the start of every transaction, with the third argument making it transaction-local so it can never leak across pooled connections. Now even `SELECT * FROM leads` typed by hand sees only one tenant's rows.

## The part people get wrong

Row-level security has a trapdoor: superusers and table owners bypass it. If your application connects as `postgres`, the policies are decoration.

Intelect's application connects as `intelect_app`, a non-superuser role that owns nothing. Migrations run as `postgres`, because they need to alter tables, and that is the only place the owner role appears. The `FORCE` keyword matters for the same reason: without it the table owner would bypass the policy even in the rare case the app ran as owner.

## The one legitimate bypass

Support staff need to see a tenant's data. I did not add an "is_admin skips the policy" branch to the hook; that is exactly the kind of flag that ends up set on the wrong account. The internal console at `admin.intelect.ai` has its own super-admin table, its own cookie and its own authentication path. Impersonation goes through that path, sets the tenant context explicitly for the impersonated tenant, and is audited. The super-admin is a different kind of user, not a tenant user with extra powers.

## What I'd do differently

Nothing about the two layers; they earned their keep the first time a test wrote a raw query and got zero rows back. What I would change is the order of work. I wrote the ORM hook first and the RLS migration second, which meant a few days where tests passed for the wrong reason. Next time the policy goes in with the first migration and the ORM layer is added as the convenience it really is.
