// Generates public/sitemap.xml, public/robots.txt and public/feed.xml before each build.
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const SITE = "https://noushadhossain.com";
const isoDate = (d) => (d instanceof Date ? d.toISOString() : String(d)).slice(0, 10);

const root = path.join(__dirname, "..");
const pub = path.join(root, "public");
const postsDir = path.join(root, "posts");

// Case-study slugs: read from lib/content.js without importing ESM.
const content = fs.readFileSync(path.join(root, "lib/content.js"), "utf8");
const workSlugs = [...content.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);

const posts = fs.existsSync(postsDir)
  ? fs.readdirSync(postsDir).filter((f) => f.endsWith(".md")).map((f) => {
      const { data, content: body } = matter(fs.readFileSync(path.join(postsDir, f), "utf8"));
      return { slug: f.replace(/\.md$/, ""), title: data.title, date: isoDate(data.date), description: data.description || "", body };
    }).sort((a, b) => (a.date < b.date ? 1 : -1))
  : [];

const today = new Date().toISOString().slice(0, 10);
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const urls = [
  { loc: `${SITE}/`, lastmod: today, priority: "1.0", changefreq: "monthly" },
  { loc: `${SITE}/writing`, lastmod: posts[0]?.date || today, priority: "0.8", changefreq: "weekly" },
  ...workSlugs.map((s) => ({ loc: `${SITE}/work/${s}`, lastmod: today, priority: "0.8", changefreq: "monthly" })),
  ...posts.map((p) => ({ loc: `${SITE}/writing/${p.slug}`, lastmod: p.date, priority: "0.6", changefreq: "yearly" })),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`).join("\n")}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`;

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Noushad Hossain — Writing</title>
    <link>${SITE}/writing</link>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml"/>
    <description>Engineering notes on PostgreSQL, data pipelines, LLM agents, email infrastructure and running small platforms in production.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${posts.map((p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${SITE}/writing/${p.slug}</link>
      <guid isPermaLink="true">${SITE}/writing/${p.slug}</guid>
      <pubDate>${new Date(p.date + "T09:00:00Z").toUTCString()}</pubDate>
      <description>${esc(p.description)}</description>
    </item>`).join("\n")}
  </channel>
</rss>
`;

fs.writeFileSync(path.join(pub, "sitemap.xml"), sitemap);
fs.writeFileSync(path.join(pub, "robots.txt"), robots);
fs.writeFileSync(path.join(pub, "feed.xml"), feed);
console.log(`SEO files written: ${urls.length} URLs in sitemap, ${posts.length} posts in feed.`);
