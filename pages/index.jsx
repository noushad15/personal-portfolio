import Link from "next/link";
import Layout, { Icon } from "../components/Layout";
import { getAllPosts } from "../lib/posts";
import { formatDate } from "../lib/format";
import { diagrams } from "../components/Diagrams";
import {
  site, hero, work, otherWork, experience, education, capabilities, principles,
  research, languages, targetRoles,
} from "../lib/content";

function CaseCard({ c }) {
  const Diagram = c.diagram ? diagrams[c.diagram] : null;
  return (
    <article className={`case${Diagram ? "" : " no-diagram"}`}>
      <div>
        <div className="case-meta">{c.org} · {c.period}</div>
        <h3><Link href={`/work/${c.slug}`}>{c.title}</Link></h3>
        <span className="own">{c.ownership}</span>
        <p>{c.teaser}</p>
        <div className="case-stack">
          {c.stack.slice(0, 8).map((s) => <span className="chip" key={s}>{s}</span>)}
          {c.stack.length > 8 && <span className="chip">+{c.stack.length - 8} more</span>}
        </div>
        <Link className="more-link" href={`/work/${c.slug}`}>Read the case study</Link>
      </div>
      {Diagram && <div className="diagram-frame"><Diagram /></div>}
    </article>
  );
}

export async function getStaticProps() {
  const posts = getAllPosts().slice(0, 4).map(({ content, html, ...p }) => p);
  return { props: { posts } };
}

export default function Home({ posts }) {
  return (
    <Layout>
      <section className="hero">
        <div className="wrap">
          <div className="hero-grid">
            <div>
              <div className="role-line reveal">{site.role}: backend, data and AI platforms</div>
              <h1 className="reveal d1">{hero.headline}</h1>
              <p className="lead reveal d2">{hero.lead}</p>
              <div className="hero-actions reveal d3">
                <a className="btn" href={site.cv} download>{Icon.download} Download CV (PDF)</a>
                <a className="btn secondary" href={site.portfolio} download>{Icon.download} Download portfolio (PDF)</a>
                <a className="btn secondary" href="#work">See the work {Icon.arrow}</a>
              </div>
            </div>
            <div className="reveal d2">
              <img className="portrait" src="/photo.jpg" alt="Noushad Hossain" width="866" height="900" />
              <dl className="ledger">
                <div><dt>Role</dt><dd>{site.role}, Cogwheel Analytics</dd></div>
                <div><dt>Based in</dt><dd>{site.location}</dd></div>
                <div><dt>Status</dt><dd>{site.availability}. {site.visa}.</dd></div>
                <div><dt>Contact</dt><dd><a href={`mailto:${site.email}`}>{site.email}</a></dd></div>
              </dl>
            </div>
          </div>
          <div className="kurz">
            <p><span className="lang">Auf Deutsch</span>{hero.kurzprofil}</p>
          </div>
        </div>
      </section>

      <section className="section" id="work">
        <div className="wrap">
          <div className="section-head">
            <h2>Selected work</h2>
            <p>Five systems, each with what it does, what I personally built and the decisions behind it. The full write-up with architecture diagrams is in the portfolio PDF.</p>
          </div>
          <div className="work-list">
            {work.map((c) => <CaseCard c={c} key={c.slug} />)}
          </div>
          <h3 style={{ marginTop: 48 }}>Also built</h3>
          <div className="minor">
            {otherWork.map((o) => (
              <div key={o.name}>
                <h4>{o.link ? <a href={o.link} target="_blank" rel="noopener">{o.name}</a> : o.name}</h4>
                <p>{o.what}</p>
                <small>{o.stack}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="experience">
        <div className="wrap">
          <div className="section-head">
            <h2>Experience</h2>
            <p>Six years in startups: joined Cogwheel Analytics as a senior engineer when the backend was an early product, became its most active contributor and moved into the lead role as the platform and team grew.</p>
          </div>
          <div className="timeline">
            {experience.map((j) => (
              <div className="job" key={j.title + j.period}>
                <div className="when">{j.period}</div>
                <div>
                  <h3>{j.title}</h3>
                  <div className="org">{j.org}</div>
                  <ul>{j.points.map((p) => <li key={p}>{p}</li>)}</ul>
                </div>
              </div>
            ))}
          </div>
          <div className="edu">
            {education.map((e) => (
              <div key={e.title}><b>{e.title}</b>{e.org}<br /><span>{e.period}</span></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="capabilities">
        <div className="wrap">
          <div className="section-head">
            <h2>Capabilities</h2>
            <p>Only what the work above demonstrates. No percentages.</p>
          </div>
          <div className="caps">
            {capabilities.map((c) => (
              <div className="cap" key={c.area}>
                <h3>{c.area}</h3>
                <p>{c.text}</p>
                <div className="tags">{c.tags.map((t) => <span className="chip" key={t}>{t}</span>)}</div>
              </div>
            ))}
          </div>
          <div className="principles">
            {principles.map((p) => <div key={p.title}><b>{p.title}</b><span>{p.text}</span></div>)}
          </div>
        </div>
      </section>

      <section className="section" id="research">
        <div className="wrap two">
          <div>
            <h2 style={{ marginBottom: 14 }}>Research and background</h2>
            <p>{research.intro}</p>
          </div>
          <div>
            <h3 style={{ marginBottom: 10 }}>Languages</h3>
            <div className="langs">
              {languages.map((l) => <div key={l.name}><b>{l.name}</b><span>{l.level}</span></div>)}
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="writing">
        <div className="wrap">
          <div className="section-head">
            <h2>Writing</h2>
            <p>Notes from the work: decisions, trade-offs and what I'd do differently. <Link href="/writing" className="more-link">All posts</Link></p>
          </div>
          <ul className="post-list compact">
            {posts.map((p) => (
              <li key={p.slug}>
                <time dateTime={p.date}>{formatDate(p.date)}</time>
                <div>
                  <h3><Link href={`/writing/${p.slug}`}>{p.title}</Link></h3>
                  <p>{p.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" id="contact">
        <div className="wrap contact-grid">
          <div>
            <h2 style={{ marginBottom: 14 }}>Let's talk</h2>
            <p>I'm looking for a full-time role in Germany or elsewhere in the EU, on-site, hybrid or remote, starting immediately. If you're hiring for one of these, the fastest way to reach me is email.</p>
            <div className="roles" style={{ marginBottom: 22 }}>
              {targetRoles.map((r) => <span className="chip" key={r}>{r}</span>)}
            </div>
            <div className="hero-actions" style={{ marginTop: 0 }}>
              <a className="btn" href={`mailto:${site.email}`}>Email me</a>
              <a className="btn secondary" href={site.cv} download>{Icon.download} CV</a>
              <a className="btn secondary" href={site.portfolio} download>{Icon.download} Portfolio</a>
            </div>
          </div>
          <ul className="contact-list">
            <li><span>Email</span><a href={`mailto:${site.email}`}>{site.email}</a></li>
            <li><span>Phone</span><a href={site.phoneHref}>{site.phone}</a></li>
            <li><span>LinkedIn</span><a href={site.linkedin} target="_blank" rel="me noopener">linkedin.com/in/noushadhossain</a></li>
            <li><span>GitHub</span><a href={site.github} target="_blank" rel="me noopener">github.com/noushad15</a></li>
            <li><span>Location</span>{site.location}</li>
          </ul>
        </div>
      </section>
    </Layout>
  );
}
