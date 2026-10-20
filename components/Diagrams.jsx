// Architecture diagrams as inline SVG. Colours come from CSS variables so they
// follow light and dark mode. Keep text short: these render at ~500px wide.

const common = (
  <style>{`
    .db { fill: var(--paper-2); stroke: var(--line); stroke-width: 1.2; }
    .dg { fill: var(--tint); stroke: var(--line); stroke-width: 1; opacity: .9; }
    .dt { font-size: 11px; fill: var(--ink); font-weight: 700; }
    .ds { font-size: 9.2px; fill: var(--muted); }
    .dl { font-size: 9px; fill: var(--accent-ink); font-weight: 700; letter-spacing: .04em; }
    .da { stroke: var(--muted); stroke-width: 1.2; fill: none; }
  `}</style>
);

function Arrow({ id }) {
  return (
    <defs>
      <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M0 0L10 5L0 10z" fill="var(--muted)" />
      </marker>
    </defs>
  );
}

export function AnalyticsDiagram() {
  const a = "url(#arrA)";
  return (
    <svg className="diagram" viewBox="0 0 560 240" role="img" aria-label="Analytics platform architecture: external sources feed ingestion jobs, which load a FastAPI and PostgreSQL core on Kubernetes, consumed by web apps and scheduled reports.">
      {common}<Arrow id="arrA" />
      <rect className="dg" x="4" y="14" width="118" height="214" rx="8" /><text className="dl" x="12" y="30">Sources</text>
      {[["Google Analytics 4", 40], ["Google Ads", 72], ["Meta / Instagram", 104], ["Review platforms", 136], ["Hotel data files", 168]].map(([t, y]) => (
        <g key={t}><rect className="db" x="12" y={y} width="102" height="24" rx="5" /><text className="dt" x="19" y={y + 16} fontSize="9.4">{t}</text></g>
      ))}
      <rect className="dg" x="138" y="14" width="126" height="214" rx="8" /><text className="dl" x="146" y="30">Ingestion</text>
      <rect className="db" x="146" y="40" width="110" height="36" rx="5" /><text className="dt" x="153" y="55">Celery workers</text><text className="ds" x="153" y="68">per-source sync</text>
      <rect className="db" x="146" y="86" width="110" height="36" rx="5" /><text className="dt" x="153" y="101">Celery beat</text><text className="ds" x="153" y="114">DB-backed schedule</text>
      <rect className="db" x="146" y="132" width="110" height="36" rx="5" /><text className="dt" x="153" y="147">Parser pipeline</text><text className="ds" x="153" y="160">normalise, map</text>
      <rect className="db" x="146" y="178" width="110" height="36" rx="5" /><text className="dt" x="153" y="193">Quality monitors</text><text className="ds" x="153" y="206">completeness, auto-fix</text>
      <rect className="dg" x="280" y="14" width="150" height="214" rx="8" /><text className="dl" x="288" y="30">Core · AWS EKS</text>
      <rect className="db" x="288" y="40" width="134" height="46" rx="5" /><text className="dt" x="295" y="55">FastAPI service</text><text className="ds" x="295" y="68">auth, RBAC, analytics</text><text className="ds" x="295" y="80">report &amp; export APIs</text>
      <rect className="db" x="288" y="96" width="62" height="40" rx="5" /><text className="dt" x="295" y="111">Postgres</text><text className="ds" x="295" y="124">SQLAlchemy</text>
      <rect className="db" x="360" y="96" width="62" height="40" rx="5" /><text className="dt" x="367" y="111">Redis</text><text className="ds" x="367" y="124">cache, broker</text>
      <rect className="db" x="288" y="146" width="134" height="32" rx="5" /><text className="dt" x="295" y="160">Report engine</text><text className="ds" x="295" y="172">Jinja → PDF, charts, CSV</text>
      <rect className="db" x="288" y="186" width="134" height="30" rx="5" /><text className="dt" x="295" y="200">AI report service</text><text className="ds" x="295" y="211">LLM + vector search</text>
      <rect className="dg" x="446" y="14" width="110" height="214" rx="8" /><text className="dl" x="454" y="30">Consumers</text>
      <rect className="db" x="454" y="40" width="94" height="36" rx="5" /><text className="dt" x="461" y="55">Web apps</text><text className="ds" x="461" y="68">analytics, admin</text>
      <rect className="db" x="454" y="86" width="94" height="36" rx="5" /><text className="dt" x="461" y="101">Scheduled PDFs</text><text className="ds" x="461" y="114">by email</text>
      <rect className="db" x="454" y="132" width="94" height="46" rx="5" /><text className="dt" x="461" y="147">CI/CD</text><text className="ds" x="461" y="160">Snyk + Trivy gate</text><text className="ds" x="461" y="172">ECR → EKS rollout</text>
      <rect className="db" x="454" y="186" width="94" height="30" rx="5" /><text className="dt" x="461" y="200">Sentry, logs</text>
      <path className="da" markerEnd={a} d="M122 60 L138 60" /><path className="da" markerEnd={a} d="M122 108 L138 108" /><path className="da" markerEnd={a} d="M122 156 L138 156" />
      <path className="da" markerEnd={a} d="M264 60 L280 60" /><path className="da" markerEnd={a} d="M264 116 L280 116" /><path className="da" markerEnd={a} d="M264 160 L280 160" />
      <path className="da" markerEnd={a} d="M430 60 L446 60" /><path className="da" markerEnd={a} d="M430 104 L446 104" />
    </svg>
  );
}

export function AgentDiagram() {
  const a = "url(#arrB)";
  return (
    <svg className="diagram" viewBox="0 0 560 230" role="img" aria-label="Coding agent loop: a tracked task triggers a loop where the model calls four tools against a cloned repository until tests pass and a pull request is open; cost is recorded per run.">
      {common}<Arrow id="arrB" />
      <rect className="db" x="8" y="10" width="250" height="38" rx="6" /><text className="dt" x="16" y="26">Task tracker (ClickUp)</text><text className="ds" x="16" y="40">status = implement, priority order, not yet processed</text>
      <rect className="db" x="302" y="10" width="250" height="38" rx="6" /><text className="dt" x="310" y="26">Trigger</text><text className="ds" x="310" y="40">MCP client (Claude Desktop, Cursor), CLI, or FastAPI</text>
      <rect className="dg" x="8" y="66" width="544" height="100" rx="8" /><text className="dl" x="16" y="82">Agent loop, bounded by iterations and a timeout</text>
      <rect className="db" x="18" y="92" width="200" height="40" rx="5" /><text className="dt" x="25" y="108">Model (Claude or OpenAI)</text><text className="ds" x="25" y="122">task + repo instructions + 4 tools</text>
      <rect className="db" x="262" y="92" width="130" height="40" rx="5" /><text className="dt" x="269" y="108">Tool executor</text><text className="ds" x="269" y="122">bash · read · write · edit</text>
      <rect className="db" x="416" y="92" width="126" height="40" rx="5" /><text className="dt" x="423" y="108">Cloned repository</text><text className="ds" x="423" y="122">feature branch, tests</text>
      <path className="da" markerEnd={a} d="M218 104 L262 104" /><path className="da" markerEnd={a} d="M262 118 L218 118" />
      <path className="da" markerEnd={a} d="M392 104 L416 104" /><path className="da" markerEnd={a} d="M416 118 L392 118" />
      <text className="ds" x="18" y="152">repeat until implemented, tests written and green, PR opened</text>
      <rect className="db" x="8" y="184" width="250" height="38" rx="6" /><text className="dt" x="16" y="200">Pull request on GitHub</text><text className="ds" x="16" y="214">URL and tag posted back to the task; a human reviews</text>
      <rect className="db" x="302" y="184" width="250" height="38" rx="6" /><text className="dt" x="310" y="200">Cost ledger (SQLite)</text><text className="ds" x="310" y="214">tokens × price per model, provider and day</text>
      <path className="da" markerEnd={a} d="M133 48 L133 66" /><path className="da" markerEnd={a} d="M427 48 L427 66" />
      <path className="da" markerEnd={a} d="M133 166 L133 184" /><path className="da" markerEnd={a} d="M427 166 L427 184" />
    </svg>
  );
}

export function InkPigeonDiagram() {
  const a = "url(#arrC)";
  return (
    <svg className="diagram" viewBox="0 0 560 236" role="img" aria-label="InkPigeon architecture: customers reach an API and SMTP processes; a modular monolith of about eight containers uses PostgreSQL as the mail queue and delivers directly to recipient mail servers; Stripe, monitoring and CI sit outside.">
      {common}<Arrow id="arrC" />
      <rect className="dg" x="4" y="14" width="104" height="210" rx="8" /><text className="dl" x="12" y="30">Customers</text>
      <rect className="db" x="12" y="40" width="88" height="34" rx="5" /><text className="dt" x="19" y="55">REST API</text><text className="ds" x="19" y="67">API keys</text>
      <rect className="db" x="12" y="84" width="88" height="34" rx="5" /><text className="dt" x="19" y="99">SMTP relay</text><text className="ds" x="19" y="111">587 / 465</text>
      <rect className="db" x="12" y="128" width="88" height="34" rx="5" /><text className="dt" x="19" y="143">Dashboard</text><text className="ds" x="19" y="155">Next.js</text>
      <rect className="db" x="12" y="172" width="88" height="34" rx="5" /><text className="dt" x="19" y="187">Inbound mail</text><text className="ds" x="19" y="199">port 25</text>
      <rect className="dg" x="124" y="14" width="292" height="210" rx="8" /><text className="dl" x="132" y="30">Modular monolith · ~8 containers · one VPS</text>
      <rect className="db" x="132" y="40" width="88" height="40" rx="5" /><text className="dt" x="139" y="55">api</text><text className="ds" x="139" y="67">auth, orgs, RBAC</text><text className="ds" x="139" y="77">billing, webhooks</text>
      <rect className="db" x="228" y="40" width="88" height="40" rx="5" /><text className="dt" x="235" y="55">smtp-submit</text><text className="ds" x="235" y="67">aiosmtpd</text><text className="ds" x="235" y="77">→ queue</text>
      <rect className="db" x="324" y="40" width="84" height="40" rx="5" /><text className="dt" x="331" y="55">smtp-mx</text><text className="ds" x="331" y="67">bounces,</text><text className="ds" x="331" y="77">complaints</text>
      <rect className="db" x="132" y="90" width="88" height="40" rx="5" /><text className="dt" x="139" y="105">delivery-worker</text><text className="ds" x="139" y="117">DKIM, MX lookup</text><text className="ds" x="139" y="127">direct SMTP, retries</text>
      <rect className="db" x="228" y="90" width="88" height="40" rx="5" /><text className="dt" x="235" y="105">general-worker</text><text className="ds" x="235" y="117">campaigns, hooks</text><text className="ds" x="235" y="127">tracking</text>
      <rect className="db" x="324" y="90" width="84" height="40" rx="5" /><text className="dt" x="331" y="105">scheduler</text><text className="ds" x="331" y="117">warm-up,</text><text className="ds" x="331" y="127">retention</text>
      <rect className="db" x="132" y="142" width="150" height="72" rx="5" /><text className="dt" x="139" y="157">PostgreSQL 16</text><text className="ds" x="139" y="170">34 tables, org_id everywhere</text><text className="ds" x="139" y="182">mail queue:</text><text className="ds" x="139" y="194">FOR UPDATE SKIP LOCKED</text><text className="ds" x="139" y="206">UUIDv7, UTC</text>
      <rect className="db" x="290" y="142" width="56" height="72" rx="5" /><text className="dt" x="297" y="157">Redis</text><text className="ds" x="297" y="170">limits,</text><text className="ds" x="297" y="182">sessions</text>
      <rect className="db" x="354" y="142" width="54" height="72" rx="5" /><text className="dt" x="361" y="157">Dovecot</text><text className="dt" x="361" y="169">Rspamd</text><text className="ds" x="361" y="182">IMAP,</text><text className="ds" x="361" y="194">spam</text>
      <rect className="dg" x="432" y="14" width="124" height="210" rx="8" /><text className="dl" x="440" y="30">Outside</text>
      <rect className="db" x="440" y="40" width="108" height="40" rx="5" /><text className="dt" x="447" y="55">Recipient MX</text><text className="ds" x="447" y="67">SPF, DKIM, DMARC</text><text className="ds" x="447" y="77">rDNS, IP pool</text>
      <rect className="db" x="440" y="90" width="108" height="34" rx="5" /><text className="dt" x="447" y="105">Stripe</text><text className="ds" x="447" y="117">plans + metered</text>
      <rect className="db" x="440" y="134" width="108" height="34" rx="5" /><text className="dt" x="447" y="149">Prometheus</text><text className="ds" x="447" y="161">Grafana dashboards</text>
      <rect className="db" x="440" y="178" width="108" height="36" rx="5" /><text className="dt" x="447" y="193">GitHub Actions</text><text className="ds" x="447" y="206">tests + E2E → deploy</text>
      <path className="da" markerEnd={a} d="M108 57 L124 57" /><path className="da" markerEnd={a} d="M108 101 L124 101" /><path className="da" markerEnd={a} d="M108 145 L124 145" /><path className="da" markerEnd={a} d="M108 189 L124 189" />
      <path className="da" markerEnd={a} d="M416 60 L432 60" /><path className="da" markerEnd={a} d="M416 107 L432 107" />
      <path className="da" markerEnd={a} d="M176 130 L176 142" /><path className="da" markerEnd={a} d="M272 130 L272 142" /><path className="da" markerEnd={a} d="M220 60 L228 60" /><path className="da" markerEnd={a} d="M316 60 L324 60" />
    </svg>
  );
}

export const diagrams = { analytics: AnalyticsDiagram, agent: AgentDiagram, inkpigeon: InkPigeonDiagram };
