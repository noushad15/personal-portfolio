import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import Layout from "../components/Layout";
import { site } from "../lib/content";

const MIN = 120;

export default function Recommend() {
  const [state, setState] = useState({ status: "idle", error: "" });
  const [quote, setQuote] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setState({ status: "sending", error: "" });
    try {
      const res = await fetch("/api/recommend", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      setState({ status: "done", error: "" });
      form.reset();
      setQuote("");
    } catch (err) {
      setState({ status: "error", error: err.message });
    }
  }

  return (
    <Layout title="Write a recommendation" description="Leave a recommendation for Noushad Hossain. It is published on the site after review." path="/recommend">
      <Head><meta name="robots" content="noindex, follow" /></Head>
      <div className="wrap">
        <div className="study-head">
          <Link className="back" href="/">← Home</Link>
          <h1>Write a recommendation</h1>
          <p className="lead" style={{ color: "var(--ink-2)", fontSize: 18 }}>
            Thank you for taking the time. Write it the way you would on LinkedIn: what we worked on, what I did, and what it was like to work with me. I read every submission before it is published and change nothing but typos.
          </p>
        </div>

        {state.status === "done" ? (
          <div className="box accent form-done">
            <h3>Received, thank you.</h3>
            <p>I'll review it shortly and it will appear on the site once approved. If you also post it on LinkedIn, that would mean a lot.</p>
            <p><Link href="/" className="more-link">Back to the home page</Link></p>
          </div>
        ) : (
          <form className="rec-form" onSubmit={onSubmit} noValidate>
            <div className="row2">
              <label>Your name<input name="name" required maxLength={80} autoComplete="name" /></label>
              <label>Your role<input name="role" required maxLength={80} placeholder="e.g. Engineering Manager" autoComplete="organization-title" /></label>
            </div>
            <div className="row2">
              <label>Company<input name="company" maxLength={80} autoComplete="organization" /></label>
              <label>How we know each other<input name="relation" required maxLength={120} placeholder="e.g. Managed Noushad at … 2023–2025" /></label>
            </div>
            <div className="row2">
              <label>Your LinkedIn profile<input name="linkedin" type="url" maxLength={200} placeholder="https://linkedin.com/in/…" /></label>
              <label>Your email <span className="hint">(not published; only so I can thank you)</span><input name="email" type="email" maxLength={120} autoComplete="email" /></label>
            </div>
            <label>
              Recommendation
              <textarea name="quote" required minLength={MIN} maxLength={1200} rows={7} value={quote} onChange={(e) => setQuote(e.target.value)} />
              <span className="hint">{quote.length < MIN ? `${MIN - quote.length} more characters needed` : `${quote.length} / 1200`}</span>
            </label>
            <label className="hp" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
            {state.status === "error" && <p className="form-error" role="alert">{state.error}</p>}
            <div className="hero-actions" style={{ marginTop: 8 }}>
              <button className="btn" type="submit" disabled={state.status === "sending"}>{state.status === "sending" ? "Sending…" : "Send recommendation"}</button>
              <a className="btn secondary" href={`mailto:${site.email}?subject=Recommendation`}>Or email it instead</a>
            </div>
            <p className="hint" style={{ marginTop: 14 }}>Your name, role, relation and LinkedIn link are shown with the recommendation once approved. Nothing else is stored.</p>
          </form>
        )}
      </div>
    </Layout>
  );
}
