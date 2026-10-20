import Head from "next/head";
import Link from "next/link";
import { site } from "../lib/content";

export const Icon = {
  download: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </svg>
  ),
  arrow: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  ),
};

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  image: `${site.url}/photo.jpg`,
  jobTitle: site.role,
  description: site.seo.description,
  email: `mailto:${site.email}`,
  telephone: site.phone,
  address: { "@type": "PostalAddress", addressLocality: "Dortmund", addressCountry: "DE" },
  worksFor: { "@type": "Organization", name: "Cogwheel Analytics" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Shahjalal University of Science and Technology" },
  knowsAbout: ["Python", "FastAPI", "PostgreSQL", "data engineering", "ETL pipelines", "LLM integration", "AI agents", "AWS", "Kubernetes", "CI/CD", "email infrastructure"],
  knowsLanguage: ["en", "de", "bn"],
  sameAs: [site.linkedin, site.github],
};

export default function Layout({ title, description, children, path = "/", type = "website" }) {
  const t = title ? `${title} — ${site.name}` : site.seo.title;
  const d = description || site.seo.description;
  const url = site.url + path;
  return (
    <>
      <Head>
        <title>{t}</title>
        <meta name="description" content={d} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={url} />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta property="og:type" content={type} />
        <meta property="og:site_name" content={site.name} />
        <meta property="og:locale" content="en_GB" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={`${site.name}, ${site.role}`} />
        <meta property="og:title" content={t} />
        <meta property="og:description" content={d} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={`${site.url}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t} />
        <meta name="twitter:description" content={d} />
        <meta name="twitter:image" content={`${site.url}/og-image.png`} />
        <meta name="author" content={site.name} />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <link rel="alternate" type="application/rss+xml" title="Noushad Hossain — Writing" href="/feed.xml" />
        {path === "/" && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />}
        <meta name="theme-color" content="#f5f6f4" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#15181e" media="(prefers-color-scheme: dark)" />
      </Head>

      <header className="header">
        <div className="wrap">
          <Link href="/" className="brand"><span className="brand-mark" aria-hidden="true" />{site.name}</Link>
          <nav className="nav" aria-label="Sections">
            <Link href="/#work">Work</Link>
            <Link href="/#experience">Experience</Link>
            <Link href="/#capabilities">Capabilities</Link>
            <Link href="/writing">Writing</Link>
            <Link href="/#contact">Contact</Link>
          </nav>
          <div className="header-cta">
            <a className="btn small" href={site.cv} download>{Icon.download} CV</a>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="wrap">
        <div className="footer">
          <span>{site.name} · {site.location}</span>
          <span>
            <a href={site.linkedin} rel="me noopener" target="_blank">LinkedIn</a> &nbsp;·&nbsp;{" "}
            <a href={site.github} rel="me noopener" target="_blank">GitHub</a> &nbsp;·&nbsp;{" "}
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </span>
        </div>
      </footer>
    </>
  );
}
