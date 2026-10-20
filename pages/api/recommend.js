// Receives a recommendation from /recommend and opens a pull request on the site's
// GitHub repository that adds recommendations/<slug>.md. Nothing is published until
// the PR is merged. Required env: GITHUB_TOKEN (fine-grained, contents + pull requests
// read/write on this repo), GITHUB_REPO ("owner/name"). Optional: GITHUB_BASE_BRANCH
// (default "main"), NOTIFY_WEBHOOK_URL (+ NOTIFY_WEBHOOK_AUTH) to POST a JSON notification.

const LIMITS = { name: 80, role: 80, company: 80, relation: 120, linkedin: 200, quote: 1200 };
const MIN_QUOTE = 120;

// Best-effort rate limit per instance (serverless instances are short-lived; this still
// stops a single client hammering one instance).
const seen = new Map();
function limited(ip) {
  const now = Date.now();
  const hits = (seen.get(ip) || []).filter((t) => now - t < 60 * 60 * 1000);
  hits.push(now);
  seen.set(ip, hits);
  return hits.length > 5;
}

const clean = (v, max) => String(v || "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max);
const slugify = (s) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "recommendation";
const yamlStr = (s) => JSON.stringify(s); // JSON strings are valid YAML double-quoted scalars

async function gh(path, init = {}) {
  const res = await fetch(`${process.env.GITHUB_API || "https://api.github.com"}${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  if (!res.ok) throw new Error(`GitHub ${init.method || "GET"} ${path} → ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return res.json();
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!process.env.GITHUB_TOKEN || !process.env.GITHUB_REPO) {
    return res.status(503).json({ error: "Recommendations are not configured yet." });
  }

  const b = req.body || {};
  if (b.website) return res.status(200).json({ ok: true }); // honeypot: pretend success

  const name = clean(b.name, LIMITS.name);
  const role = clean(b.role, LIMITS.role);
  const company = clean(b.company, LIMITS.company);
  const relation = clean(b.relation, LIMITS.relation);
  const linkedin = clean(b.linkedin, LIMITS.linkedin);
  const quote = clean(b.quote, LIMITS.quote).replace(/\r\n/g, "\n");
  const email = clean(b.email, 120);

  if (!name || !role || !relation) return res.status(400).json({ error: "Name, role and how we know each other are required." });
  if (quote.length < MIN_QUOTE) return res.status(400).json({ error: `The recommendation should be at least ${MIN_QUOTE} characters.` });
  if (linkedin && !/^https:\/\/(www\.)?linkedin\.com\/in\/[\w\-%]+\/?$/i.test(linkedin)) {
    return res.status(400).json({ error: "The LinkedIn link should look like https://linkedin.com/in/your-name" });
  }

  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || req.socket?.remoteAddress || "unknown";
  if (limited(ip)) return res.status(429).json({ error: "Too many submissions. Please try again later." });

  const date = new Date().toISOString().slice(0, 10);
  const slug = `${slugify(name)}-${date}`;
  const file = `recommendations/${slug}.md`;
  const branch = `recommendation/${slug}-${Date.now().toString(36)}`;
  const base = process.env.GITHUB_BASE_BRANCH || "main";
  const [owner, repo] = process.env.GITHUB_REPO.split("/");

  const md = `---
name: ${yamlStr(name)}
role: ${yamlStr(role)}
company: ${yamlStr(company)}
relation: ${yamlStr(relation)}
linkedin: ${yamlStr(linkedin)}
date: ${date}
---
${quote}
`;

  try {
    const ref = await gh(`/repos/${owner}/${repo}/git/ref/heads/${base}`);
    await gh(`/repos/${owner}/${repo}/git/refs`, { method: "POST", body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: ref.object.sha }) });
    await gh(`/repos/${owner}/${repo}/contents/${file}`, {
      method: "PUT",
      body: JSON.stringify({ message: `Recommendation from ${name}`, content: Buffer.from(md, "utf8").toString("base64"), branch }),
    });
    const pr = await gh(`/repos/${owner}/${repo}/pulls`, {
      method: "POST",
      body: JSON.stringify({
        title: `Recommendation from ${name}`,
        head: branch,
        base,
        body: [
          `New recommendation submitted on the website. **Merge to publish, close to reject.**`,
          ``,
          `- Name: ${name}`,
          `- Role: ${role}${company ? `, ${company}` : ""}`,
          `- Relation: ${relation}`,
          linkedin ? `- LinkedIn: ${linkedin}` : `- LinkedIn: (none given)`,
          email ? `- Contact email (not published): ${email}` : `- Contact email: (none given)`,
          ``,
          `> ${quote.replace(/\n/g, "\n> ")}`,
        ].join("\n"),
      }),
    });

    if (process.env.NOTIFY_WEBHOOK_URL) {
      fetch(process.env.NOTIFY_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(process.env.NOTIFY_WEBHOOK_AUTH ? { Authorization: process.env.NOTIFY_WEBHOOK_AUTH } : {}) },
        body: JSON.stringify({ subject: `New recommendation from ${name}`, text: `${name} (${role}) submitted a recommendation.\n\nReview: ${pr.html_url}` }),
      }).catch(() => {});
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("recommend:", err.message);
    return res.status(502).json({ error: "Could not submit right now. Please try again later or email me directly." });
  }
}
