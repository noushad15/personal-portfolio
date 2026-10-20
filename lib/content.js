// All site copy lives here. Edit this file, not the components.

export const site = {
  name: "Noushad Hossain",
  role: "Lead Software Engineer",
  focus: "Backend, data and AI platforms",
  location: "Dortmund, Germany",
  availability: "Available now, anywhere in Germany or the EU",
  visa: "Chancenkarte (Opportunity Card) holder",
  email: "noushad33815@gmail.com",
  phone: "+49 155 67816727",
  phoneHref: "tel:+4915567816727",
  linkedin: "https://linkedin.com/in/noushadhossain",
  github: "https://github.com/noushad15",
  cv: "/Noushad_Hossain_CV.pdf",
  portfolio: "/Noushad_Hossain_Portfolio.pdf",
  url: "https://noushadhossain.com",
  seo: {
    title: "Noushad Hossain — Lead Software Engineer, backend, data & AI platforms",
    description:
      "Lead Software Engineer in Dortmund, Germany. Six years building Python backend systems, data pipelines and LLM-powered products in startups. Available now across Germany and the EU.",
  },
};

export const hero = {
  headline: "I build the systems behind data products, and run them in production.",
  lead:
    "Six years in startups as a Python backend, data and AI engineer. Today I lead the backend team of an AI-powered analytics platform, and on the side I design and operate my own products, from a self-hosted email service to a multi-tenant CRM.",
  kurzprofil:
    "Lead Software Engineer mit sechs Jahren Erfahrung in Python-Backend-Systemen, Datenpipelines und LLM-Integration. Ich wohne in Dortmund, besitze eine Chancenkarte und bin ab sofort deutschlandweit verfügbar. Deutsch B1, Englisch C1.",
};

// Case studies. Order matters: the first three are the main ones.
export const work = [
  {
    slug: "hospitality-analytics-platform",
    title: "Hospitality marketing analytics platform",
    org: "Cogwheel Analytics",
    period: "2023 – present",
    role: "Senior Engineer, then Lead Software Engineer",
    ownership: "Lead and core contributor",
    teaser:
      "Multi-source marketing data for hotel portfolios, turned into reports people act on. I built the analytics and reporting modules, the security-gated CI/CD to Kubernetes, and now lead the team and the architecture.",
    diagram: "analytics",
    stack: [
      "Python", "FastAPI", "SQLAlchemy / SQLModel", "PostgreSQL", "Redis", "Celery",
      "Pandas", "WeasyPrint / Plotly", "Docker", "AWS EKS / ECR", "GitHub Actions",
      "Snyk / Trivy", "Sentry", "Azure OpenAI",
    ],
    sections: [
      {
        heading: "What it is",
        body:
          "A SaaS analytics platform used by hotel groups and their marketing teams to see how paid media, web traffic, booking sources, reviews and social channels perform across portfolios of properties, with scheduled reports, scorecards and data-quality monitoring.",
      },
      {
        heading: "The problem",
        body:
          "Each hotel's marketing data lives in different vendor systems, with different identifiers, schedules and failure modes: Google Analytics 4, Google Ads, Meta, Instagram, review sites, booking data. The platform has to ingest all of it continuously, reconcile it to the right property and produce reliable reports, while the codebase grew from a small team's prototype into an 18-module product.",
      },
      {
        heading: "What I built myself",
        bullets: [
          "Analytics modules end to end: models, data-access layer, schemas and API endpoints for channel mix, paid media, visits and revenue, source traffic and top referring domains.",
          "The reporting API and exports: v1/v2 report endpoints, PDF report queries and CSV/XLSX export utilities behind scheduled property and portfolio reports.",
          "Contributions to the Google Analytics, Google Ads and Meta ingestion code and the persistence layer for vendor API responses.",
          "The CI/CD pipelines: primary author of the staging workflow and co-author of production. Snyk and Trivy scans, a security gate with reviewer approval, findings posted to the team's tracker, ARM image builds to ECR and rollouts of the web, Celery worker and beat deployments on EKS.",
          "Celery configuration and task wiring, including the database-backed periodic scheduler used by every sync job.",
        ],
      },
      {
        heading: "What I lead",
        bullets: [
          "Review and merge of every feature, fix and sprint-release branch, around seventy sprint cycles to date.",
          "The refactor program: I wrote the 2026 engineering brief that replaced a 'migrate all 18 modules' plan, estimated at 3.5 to 6 years, with a bounded target. Six modules cut over, seven dead endpoint groups deleted after access-log verification, stable modules wrapped behind a proxy, the hardest rewrites deferred and planned.",
          "The ETL v2 platform design: bronze, silver and gold layers with idempotent ingestion runs, file and row hashes, versioned cleaning rules, data contracts and audit tables.",
          "The AI-reporting initiative, see the coding-agent case study for the LLM side.",
        ],
      },
      {
        heading: "Decisions that mattered",
        bullets: [
          "Multi-source identity and data quality: explicit mapping tables and hotel-code change requests, data-completeness and data-quality monitors run as Celery tasks, auto-resolution for known failure patterns. Missing data became a tracked state instead of a silent gap in a report.",
          "Security in the deploy path without blocking delivery: scans fail builds by default, a reviewer can approve with documented findings, every outcome is written to the workflow summary and the tracker.",
          "Legacy versus rewrite: prove migration competence on low-risk modules first, delete what has no callers, reserve rewrites for the modules where the old design actually hurts.",
        ],
      },
      {
        heading: "Outcome",
        body:
          "A production platform in continuous operation since 2023, with automated vendor syncs, scheduled reporting and a security-gated path to Kubernetes, plus a written, agreed multi-year architecture direction with a disposition for every module.",
      },
    ],
  },
  {
    slug: "autonomous-coding-agent",
    title: "Autonomous coding agent: tracked task to tested pull request",
    org: "Own tooling",
    period: "2025 – 2026",
    role: "Designed and built",
    ownership: "Sole author",
    teaser:
      "A tool-calling LLM agent that takes implementation-ready tickets, implements them with tests on a feature branch, opens the pull request and reports the cost of every run.",
    diagram: "agent",
    stack: [
      "Python 3.11", "Anthropic API", "OpenAI API", "MCP server", "FastAPI", "GitHub CLI",
      "SQLite", "Docker", "Node.js (first version)",
    ],
    sections: [
      {
        heading: "What it is",
        body:
          "An agent that takes tasks from a ClickUp list, clones the target repository, lets a model implement the change with tests, opens a pull request and posts the result back to the task. It runs as an MCP server for Claude Desktop or Cursor, as a CLI, or headless behind a FastAPI service.",
      },
      {
        heading: "The problem",
        body:
          "A small team with a long backlog of well-specified, low-risk tickets: cutovers, small fixes, boilerplate modules. I wanted those turned into reviewable pull requests without a human babysitting an IDE session, and I wanted to know exactly what each run costs.",
      },
      {
        heading: "How it works",
        bullets: [
          "An agentic loop on native tool calling. The model receives the task, the repository's instruction file and four tools: bash, read_file, write_file and str_replace. It iterates until the change is implemented, tests are written and pass, and a PR is open. Tool output is truncated to a budget so context stays bounded.",
          "A provider abstraction: Claude and OpenAI behind one interface, switched by one environment variable. The first version drove the Claude Code CLI from Node.js; the Python rewrite calls the APIs directly and needs no external binary.",
          "Guard rails: priority-ordered task selection, skip when a PR already exists, a tag that prevents reprocessing, iteration and timeout limits, a dry-run mode.",
          "Cost tracking: every API call records tokens and price per model, provider and day in SQLite, exposed through /costs endpoints. The cost of a PR, not just of a month.",
        ],
      },
      {
        heading: "Related: LLM-generated analytics reports",
        body:
          "In the analytics platform I led the initiative to add AI-written narrative reports. The service embeds the platform's API documentation into Azure AI Search and uses vector search plus function calling so the model fetches property, overview and scorecard data through the platform's own authenticated endpoints before writing. The narrative is split into sections, paired with generated charts and rendered through the existing PDF report engine. I owned the product direction, the architecture and the reviews; most of the implementation was done by a team member under my lead.",
      },
      {
        heading: "What I learned",
        body:
          "The useful unit of automation is the well-specified ticket. The per-repository instruction file and the test-before-PR rule mattered more than the model choice. Grounding a model in the same endpoints the UI uses makes every number in its output traceable to an API call.",
      },
    ],
  },
  {
    slug: "inkpigeon",
    title: "InkPigeon: a self-hosted, multi-tenant email service provider",
    org: "Own product, inkpigeon.com",
    period: "2026 – present",
    role: "Designed, built and operated",
    ownership: "Sole owner",
    teaser:
      "A SendGrid-class platform that owns its whole mail pipeline: SMTP relay and REST sending, DKIM, direct delivery to recipient MX servers, bounces, tracking, hosted mailboxes and metered Stripe billing, on one VPS.",
    diagram: "inkpigeon",
    stack: [
      "Python 3.12", "FastAPI", "SQLAlchemy 2.0 async", "PostgreSQL 16", "Redis 7",
      "aiosmtpd / aiosmtplib", "DKIM / SPF / DMARC", "Dovecot / Rspamd", "Stripe", "Caddy",
      "Docker Compose", "Prometheus / Grafana", "GitHub Actions", "pytest / Ruff / mypy",
    ],
    sections: [
      {
        heading: "What it is",
        body:
          "Customers add a domain, verify SPF, DKIM and DMARC, then send transactional mail through an SMTP relay or a REST API and run campaigns and automations. The platform delivers directly to recipient MX servers, processes bounces and complaints, tracks opens and clicks, fires webhooks, offers optional hosted mailboxes and bills through Stripe subscriptions with metered overage.",
      },
      {
        heading: "My role",
        body:
          "Everything: an eleven-document product spec covering infrastructure, conventions, a 34-table schema, API, SMTP behaviour, billing and UI; the architecture; the implementation; CI/CD; server operations; DNS and sending reputation.",
      },
      {
        heading: "Key decisions",
        bullets: [
          "A modular monolith, not microservices. One Python package with strict module boundaries, deployed as about eight containers that scale independently. On a single VPS, microservices would add failure points without adding capacity.",
          "PostgreSQL as the mail queue. Delivery workers claim messages with FOR UPDATE SKIP LOCKED: transactional claims, durable retry state and one fewer system to operate.",
          "Build versus adopt. Mail-in-a-Box, Mailu, Zimbra and Postal are mailbox or outbound-only products without a multi-tenant SaaS layer. I reuse only the two commodity components, Dovecot and Rspamd, and build everything customer-facing.",
          "Hosting where port 25 works. Major clouds rarely unblock outbound SMTP, so the platform runs on a VPS with Caddy for TLS, a multi-IP sending pool and reverse DNS.",
          "Tenant isolation and secrets as first-class rules. Every tenant table carries an organisation id and every service function takes it explicitly. Argon2id for passwords and SMTP credentials, SHA-256 for API keys, AES-GCM for DKIM private keys.",
        ],
      },
      {
        heading: "How it is run",
        bullets: [
          "55 backend test modules. CI runs Ruff, mypy and pytest against real PostgreSQL and Redis plus a Mailpit end-to-end send; merges to main deploy over SSH only if the suite passes.",
          "After an adversarial review found two privilege-escalation paths in the custom-roles feature, I wrote the rule set that now governs every authorisation change: map the full bypass surface, no self-service on your own access, every router's gate is an explicit decision.",
          "Prometheus metrics, Grafana dashboards, backup and restore scripts, a server bootstrap script and a runbook.",
          "Spec-first development: implementation was carried out largely in AI-assisted coding sessions governed by a written standards file, one build-plan task per commit, and acceptance criteria that must show real test output before a task counts as done.",
        ],
      },
    ],
  },
  {
    slug: "intelect-crm",
    title: "Intelect: multi-tenant CRM with defence-in-depth isolation",
    org: "Own product",
    period: "2026",
    role: "Designed and built",
    ownership: "Sole owner",
    teaser:
      "White-labelled lead management on one shared PostgreSQL database, with tenant isolation enforced in the ORM and again by Postgres row-level security, and tests that run as a non-superuser so the policies are really exercised.",
    diagram: null,
    stack: ["FastAPI", "SQLAlchemy 2", "PostgreSQL row-level security", "Alembic", "Next.js 14", "Caddy", "GitHub Actions / GHCR"],
    sections: [
      {
        heading: "What it is",
        body:
          "A CRM for businesses running paid ads. Each client gets a subdomain, branding, team and pipeline. Lead sources plug in as adapters that share validation, de-duplication and audit rows.",
      },
      {
        heading: "Isolation at two layers",
        bullets: [
          "An ORM hook adds the tenant filter to every select, update and delete on tenant-scoped models and refuses inserts for another tenant. A query with no tenant context raises instead of returning everything. No route writes the tenant filter by hand.",
          "Postgres FORCE ROW LEVEL SECURITY policies on every tenant table, keyed on a per-transaction setting, so even raw SQL cannot see another tenant's rows. The application connects as a non-superuser role; migrations run as the owner.",
          "The test suite runs against real Postgres as that non-superuser role, because superusers bypass RLS. The tenancy tests are the ones that matter: cookies don't cross tenants, reps see only their leads, raw SQL cannot read another tenant.",
        ],
      },
      {
        heading: "Operations",
        body:
          "Caddy with a wildcard certificate via DNS-01, GitHub Actions building to GHCR and rolling out over SSH, a one-shot server setup script, backups and a support-impersonation path with its own audit trail. Provisioning a client is a form, not a deploy.",
      },
    ],
  },
  {
    slug: "dbt-etl-spike",
    title: "dbt Core spike: deciding a transform layer with evidence",
    org: "Cogwheel Analytics",
    period: "2026",
    role: "Built and authored",
    ownership: "Sole author",
    teaser:
      "A time-boxed evaluation of dbt for the silver-to-gold layer of the ETL v2 platform, run on our data shapes, our Postgres and our Celery orchestration, with every number reproducible from a runbook.",
    diagram: null,
    stack: ["dbt Core 1.11", "PostgreSQL 16", "Celery", "Python"],
    sections: [
      {
        heading: "Why",
        body:
          "The build-versus-buy decision for the transform layer was being argued from opinions. I replaced the argument with measurements: three gold models over three normalised feeds, including a daily incremental model of 5.2 million rows on synthetic data at target scale.",
      },
      {
        heading: "What came out",
        bullets: [
          "Nine distinct ways to get silently wrong data with dbt's defaults, four of them serious. Each fixed in a few dozen lines and pinned with a regression test.",
          "Enforced model contracts caught silent type widening twice during development.",
          "Clear ownership boundaries: Python owns ingestion and silver validation, dbt owns SQL and business-rule tests, Celery owns orchestration. dbt never writes to silver, Celery never contains SQL.",
          "A channel-taxonomy seed, one CSV in git, resolved a long-standing reporting inconsistency independently of the dbt decision.",
        ],
      },
    ],
  },
];

export const otherWork = [
  { name: "Microservice tool platform", what: "Independent metered API tools behind a Traefik gateway with a shared auth, metering and billing core.", stack: "FastAPI, Traefik, Postgres, Stripe" },
  { name: "Two education-platform migrations", what: "WordPress sites rebuilt on FastAPI and Postgres with a reproducible MySQL-to-Postgres pipeline, legacy password upgrade on first login, Stripe checkout and certificates with QR verification.", stack: "FastAPI, Postgres 16, Next.js" },
  { name: "Insurance-claim processing prototype", what: "Upload, OCR, field extraction, a trained classifier and a LangChain agent that explains the decision.", stack: "FastAPI, scikit-learn, LangChain, Azure OpenAI", link: "https://github.com/noushad15/Insurance-Auto-Claim-AI" },
  { name: "Cogwheel MCP server", what: "Tools generated for every endpoint in the platform's OpenAPI spec, so AI assistants can query the product. Team-built under my lead.", stack: "Node.js, MCP" },
  { name: "Email marketing backend (v1)", what: "Multi-tenant campaigns and contacts with open and click tracking and bounce webhooks; the predecessor that led to InkPigeon.", stack: "Django REST, Celery" },
  { name: "Earlier data work at Staff Asia", what: "ETL pipelines and a data warehouse, dashboards, scrapers, a recommendation system and RASA assistants fed by Google, Meta and Microsoft APIs.", stack: "Python, Django, RASA, Streamlit" },
];

export const experience = [
  {
    title: "Lead Software Engineer",
    org: "Cogwheel Analytics, Colorado, USA (remote)",
    period: "March 2025 – present",
    points: [
      "Lead architecture and development of an AI-powered analytics platform for the hospitality industry; lead the engineering team and its code reviews.",
      "Design and build Python services and data pipelines for large-scale ingestion, processing and automation.",
      "Integrate LLM-based features that turn operational data into automated insights.",
      "Own cloud infrastructure on AWS and EKS, plus CI/CD pipelines and automated deployments.",
    ],
  },
  {
    title: "Senior Software Engineer",
    org: "Cogwheel Analytics",
    period: "July 2023 – February 2025",
    points: [
      "Developed backend services and REST APIs in Python and PostgreSQL; reduced latency through query and service optimisation.",
      "Designed cloud-native infrastructure on AWS with containerised deployments on Docker and Kubernetes.",
      "Led the initiative to integrate AI capabilities into the company's BI tools.",
    ],
  },
  {
    title: "Team Lead",
    org: "Staff Asia Ltd., Sylhet, Bangladesh",
    period: "July 2022 – June 2023",
    points: [
      "Led development of ETL pipelines and a data warehouse; built automation for data scraping, processing and visualisation.",
      "Developed backend services with Django REST Framework; managed technical projects and mentored team members.",
    ],
  },
  {
    title: "Data Analyst, Research and Development",
    org: "Staff Asia Ltd.",
    period: "November 2020 – June 2022",
    points: [
      "Built Python data pipelines, automation tools, dashboards, a recommendation system and RASA chatbots.",
      "Integrated Google, Facebook and Microsoft APIs for automated data collection.",
    ],
  },
];

export const education = [
  { title: "B.Sc. Electrical and Electronic Engineering", org: "Shahjalal University of Science and Technology", period: "2016 – 2020" },
  { title: "Second major, Computer Science and Engineering", org: "Shahjalal University of Science and Technology", period: "2017 – 2020" },
  { title: "Advanced Certificate for Management Professionals", org: "Institute of Business Administration, University of Dhaka", period: "2025" },
];

export const capabilities = [
  {
    area: "Backend and data",
    text: "Python services with FastAPI and SQLAlchemy 2.0 on PostgreSQL; Celery for scheduled and background work; ingestion from vendor APIs and files; reporting engines; bronze, silver and gold modelling; dbt where it earns its place.",
    tags: ["Python", "FastAPI", "Django REST", "SQLAlchemy", "PostgreSQL", "Redis", "Celery", "Pandas", "dbt", "pytest"],
  },
  {
    area: "AI and LLM engineering",
    text: "Tool-calling agents with bounded loops and cost accounting; retrieval grounded in a system's own APIs; versioned prompts; LLM output rendered through existing, auditable pipelines.",
    tags: ["OpenAI / Azure OpenAI", "Anthropic API", "function calling", "embeddings and vector search", "LangChain", "MCP"],
  },
  {
    area: "Cloud, DevOps and security",
    text: "Docker everywhere; Kubernetes on AWS EKS with ECR; GitHub Actions pipelines with Snyk and Trivy gates and human approval; Caddy and Nginx TLS; Prometheus and Grafana; backups, runbooks and adversarial review of authorisation changes.",
    tags: ["AWS (EKS, ECR, S3, EC2)", "Docker Compose", "Kubernetes", "GitHub Actions", "Linux", "Prometheus / Grafana", "Caddy / Nginx"],
  },
  {
    area: "Leadership",
    text: "Code review and release management across sprints; written architecture direction with explicit dispositions and estimates; mentoring; aligning the backlog to design documents; measuring before deciding.",
    tags: ["architecture briefs", "code review", "release management", "mentoring", "Scrum"],
  },
];

export const principles = [
  { title: "Spec first, then code.", text: "Locked design documents beat opinions in a pull-request thread." },
  { title: "Measure before deciding.", text: "Spikes with reproducible evidence, not debates." },
  { title: "Boring, correct defaults.", text: "Postgres over a new system; a monolith until scale demands otherwise." },
  { title: "Security is a decision, never an omission.", text: "Every route's gate is explicit." },
  { title: "Own it in production.", text: "Deploy it, monitor it, write the runbook." },
];

export const research = {
  intro:
    "Before software I studied Electrical and Electronic Engineering, with a second major in Computer Science. Four IEEE conference papers between 2019 and 2021, at RAICON, ICCIT and ICREST, on face recognition, robotics, visible-light communication and MOSFET modelling. Founding Chairman of the IEEE Robotics and Automation Society student chapter and Director of Robotics at SUST, 2018 to 2020.",
};

export const languages = [
  { name: "English", level: "C1, professional working language" },
  { name: "German", level: "B1 reading and listening, A2 speaking, learning towards B2" },
  { name: "Bengali", level: "native" },
];

export const targetRoles = [
  "Senior or Lead Backend Engineer",
  "AI Engineer",
  "Data Engineer",
  "Platform Engineer",
  "Founding Engineer",
];
