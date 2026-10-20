// Approved recommendations live in /recommendations as Markdown files with front matter:
// name, role, company, relation, linkedin (optional), date (YYYY-MM-DD). The body is the quote.
// A file whose name starts with "_" is ignored (use _example.md as a template).
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const dir = path.join(process.cwd(), "recommendations");
const isoDate = (d) => (d instanceof Date ? d.toISOString() : String(d)).slice(0, 10);

export function getRecommendations() {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((f) => {
      const { data, content } = matter(fs.readFileSync(path.join(dir, f), "utf8"));
      return {
        slug: f.replace(/\.md$/, ""),
        name: data.name || "",
        role: data.role || "",
        company: data.company || "",
        relation: data.relation || "",
        linkedin: data.linkedin || "",
        date: data.date ? isoDate(data.date) : "",
        quote: content.trim(),
      };
    })
    .filter((r) => r.name && r.quote)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
