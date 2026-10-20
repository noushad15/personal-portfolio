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

Next.js 14 (pages router), no other runtime dependencies. `/projects` and `/contact` redirect to the home page sections.
