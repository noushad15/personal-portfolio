import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/Layout";
import { getAllPosts, getPost } from "../../lib/posts";
import { formatDate } from "../../lib/format";
import { site } from "../../lib/content";

export async function getStaticPaths() {
  return { paths: getAllPosts().map((p) => ({ params: { slug: p.slug } })), fallback: false };
}

export async function getStaticProps({ params }) {
  const post = getPost(params.slug);
  const all = getAllPosts();
  const i = all.findIndex((p) => p.slug === params.slug);
  const newer = all[i - 1] ? { slug: all[i - 1].slug, title: all[i - 1].title } : null;
  const older = all[i + 1] ? { slug: all[i + 1].slug, title: all[i + 1].title } : null;
  const { content, ...rest } = post;
  return { props: { post: rest, newer, older } };
}

export default function Post({ post, newer, older }) {
  const url = `${site.url}/writing/${post.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    url,
    mainEntityOfPage: url,
    keywords: post.tags.join(", "),
    author: { "@type": "Person", name: site.name, url: site.url },
    publisher: { "@type": "Person", name: site.name, url: site.url },
  };
  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: "Writing", item: `${site.url}/writing` },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };
  return (
    <Layout title={post.title} description={post.description} path={`/writing/${post.slug}`} type="article">
      <Head>
        <meta property="article:published_time" content={post.date} />
        <meta property="article:author" content={site.name} />
        {post.tags.map((t) => <meta property="article:tag" content={t} key={t} />)}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      </Head>
      <article className="wrap post">
        <div className="study-head">
          <Link className="back" href="/writing">← Writing</Link>
          <h1>{post.title}</h1>
          <p className="post-meta">
            <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.readingMinutes} min read
            {post.tags.length ? " · " + post.tags.join(", ") : ""}
          </p>
        </div>
        <div className="post-body" dangerouslySetInnerHTML={{ __html: post.html }} />
        <aside className="post-foot">
          <p><strong>{site.name}</strong> is a Lead Software Engineer in {site.location}, building backend, data and AI platforms. {site.availability}. <Link href="/#contact">Get in touch</Link> or <a href={site.cv} download>download the CV</a>.</p>
        </aside>
        <nav className="study-nav" aria-label="More posts">
          <span>{older && <Link href={`/writing/${older.slug}`}>← {older.title}</Link>}</span>
          <span>{newer && <Link href={`/writing/${newer.slug}`}>{newer.title} →</Link>}</span>
        </nav>
      </article>
    </Layout>
  );
}
