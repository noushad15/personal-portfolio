import Link from "next/link";
import Layout from "../../components/Layout";
import { getAllPosts } from "../../lib/posts";
import { formatDate } from "../../lib/format";

export async function getStaticProps() {
  const posts = getAllPosts().map(({ content, ...rest }) => rest);
  return { props: { posts } };
}

export default function Writing({ posts }) {
  const years = [...new Set(posts.map((p) => p.date.slice(0, 4)))];
  return (
    <Layout
      title="Writing"
      description="Engineering notes by Noushad Hossain: PostgreSQL, data pipelines, LLM agents, email infrastructure, CI/CD and running small platforms in production."
      path="/writing"
    >
      <div className="wrap">
        <div className="study-head">
          <h1>Writing</h1>
          <p className="lead" style={{ color: "var(--ink-2)", fontSize: 18 }}>
            Notes from the work: decisions, trade-offs and the occasional mistake, written up so I don't have to relearn them. Each post is grounded in a system I built or run.
          </p>
          <p style={{ fontSize: 15, color: "var(--muted)" }}><a href="/feed.xml">RSS feed</a></p>
        </div>
        {years.map((y) => (
          <section key={y} className="post-year">
            <h2>{y}</h2>
            <ul className="post-list">
              {posts.filter((p) => p.date.startsWith(y)).map((p) => (
                <li key={p.slug}>
                  <time dateTime={p.date}>{formatDate(p.date)}</time>
                  <div>
                    <h3><Link href={`/writing/${p.slug}`}>{p.title}</Link></h3>
                    <p>{p.description}</p>
                    <span className="post-meta">{p.readingMinutes} min read{p.tags.length ? " · " + p.tags.join(", ") : ""}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Layout>
  );
}
