# noushadhossain.com

Personal site of Noushad Hossain, Lead Software Engineer (backend, data and AI platforms).

- **Edit content:** everything (profile, case studies, experience, capabilities, contact) lives in `lib/content.js`.
- **Diagrams:** inline SVG components in `components/Diagrams.jsx`, themed via CSS variables.
- **Downloads:** `public/Noushad_Hossain_CV.pdf` and `public/Noushad_Hossain_Portfolio.pdf`. Replace the files to update the downloads.
- **Styling:** `styles/globals.css`, light and dark via `prefers-color-scheme`. Font: Manrope, self-hosted (no Google Fonts requests).

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## Recommendations

People submit at `/recommend`. The API route `pages/api/recommend.js` opens a **pull request** that adds
`recommendations/<name>-<date>.md`. **Merge the PR to publish, close it to reject.** Approved
recommendations render in the "What colleagues say" section on the home page (the section is hidden
while the folder is empty). To add one by hand, copy `recommendations/_example.md`.

Setup (once): create a fine-grained GitHub token scoped to this repo with *Contents: read/write* and
*Pull requests: read/write*, then set `GITHUB_TOKEN` and `GITHUB_REPO` in Vercel → Project → Settings →
Environment Variables (see `.env.example`). Optional `NOTIFY_WEBHOOK_URL` posts a JSON notification.

Next.js 14 (pages router); runtime dependencies are gray-matter and marked. `/projects` and `/contact` redirect to the home page sections.
