import Link from "next/link";
import Layout, { Icon } from "../../components/Layout";
import { diagrams } from "../../components/Diagrams";
import { site, work } from "../../lib/content";

export async function getStaticPaths() {
  return { paths: work.map((w) => ({ params: { slug: w.slug } })), fallback: false };
}

export async function getStaticProps({ params }) {
  const index = work.findIndex((w) => w.slug === params.slug);
  const c = work[index];
  const prev = work[index - 1] ? { slug: work[index - 1].slug, title: work[index - 1].title } : null;
  const next = work[index + 1] ? { slug: work[index + 1].slug, title: work[index + 1].title } : null;
  return { props: { c, prev, next } };
}

export default function CaseStudy({ c, prev, next }) {
  const Diagram = c.diagram ? diagrams[c.diagram] : null;
  return (
    <Layout title={c.title} description={c.teaser} path={`/work/${c.slug}`}>
      <div className="wrap">
        <div className="study-head">
          <Link className="back" href="/#work">← All work</Link>
          <h1>{c.title}</h1>
          <p className="lead" style={{ color: "var(--ink-2)", fontSize: 18 }}>{c.teaser}</p>
          <div className="facts">
            <div><span>Where</span>{c.org}</div>
            <div><span>When</span>{c.period}</div>
            <div><span>My role</span>{c.role}</div>
            <div><span>Ownership</span>{c.ownership}</div>
          </div>
        </div>

        {Diagram && <div className="diagram-frame" style={{ marginBottom: 36 }}><Diagram /></div>}

        <div className="study-body">
          <div>
            {c.sections.map((s) => (
              <section key={s.heading}>
                <h2>{s.heading}</h2>
                {s.body && <p>{s.body}</p>}
                {s.bullets && <ul>{s.bullets.map((b) => <li key={b}>{b}</li>)}</ul>}
              </section>
            ))}
          </div>
          <aside className="aside">
            <h4>Stack</h4>
            <div className="tags">{c.stack.map((t) => <span className="chip" key={t}>{t}</span>)}</div>
            <a className="btn" href={site.portfolio} download>{Icon.download} Full portfolio (PDF)</a>
            <a className="btn secondary" href={site.cv} download>{Icon.download} CV (PDF)</a>
            <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 12 }}>
              Confidential details of employers and clients are omitted or generalised.
            </p>
          </aside>
        </div>

        <nav className="study-nav" aria-label="Other case studies">
          <span>{prev && <Link href={`/work/${prev.slug}`}>← {prev.title}</Link>}</span>
          <span>{next && <Link href={`/work/${next.slug}`}>{next.title} →</Link>}</span>
        </nav>
      </div>
    </Layout>
  );
}
