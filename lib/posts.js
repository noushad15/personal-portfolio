// Reads Markdown posts from /posts. Each file has YAML front matter:
// title, date (YYYY-MM-DD), description, tags (list). The slug is the file name.
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const dir = path.join(process.cwd(), "posts");
const isoDate = (d) => (d instanceof Date ? d.toISOString() : String(d)).slice(0, 10);


export function getAllPosts() {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), "utf8");
      const { data, content } = matter(raw);
      const words = content.split(/\s+/).filter(Boolean).length;
      return {
        slug: f.replace(/\.md$/, ""),
        title: data.title,
        date: isoDate(data.date),
        description: data.description || "",
        tags: data.tags || [],
        readingMinutes: Math.max(1, Math.round(words / 220)),
        content,
      };
    })
    .filter((p) => p.title && p.date)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug) {
  const p = getAllPosts().find((x) => x.slug === slug);
  if (!p) return null;
  return { ...p, html: marked.parse(p.content) };
}
