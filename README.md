# Jake Rosenbloom — United Mortgage Landing Page

High-converting lead capture page for Jake Rosenbloom, Loan Officer at United Mortgage, driven by Google Ads traffic and connected to the Lead Mailbox CRM.

## Getting Started

```bash
# Install Vercel CLI (only dev dependency)
npm install

# Run local dev server (serves src/ and wires up API routes)
npm run dev
```

Or open `src/index.html` directly in a browser for a quick static preview (form submission won't work without `vercel dev`).

## Full Spec

See [project.md](project.md) for architecture, integration details, open questions, and acceptance criteria.

## Status

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Scaffolding — repo structure, HTML skeleton, stubs | ✅ Complete |
| 2 | Design Integration — ingest user-supplied HTML/CSS, inject logo, responsive QA | ✅ Complete |
| 3 | Form + CRM — validation, serverless function, Lead Mailbox wiring | ⏳ Pending |
| 4 | Tracking — Google Ads gtag, conversion event, GA4 | ⏳ Pending |
| 5 | Deploy — Vercel staging, United Mortgage subdomain, smoke test | ⏳ Pending |

## Project Structure

```
jake-rosenbloom-landing/
├── project.md          ← Full spec
├── package.json
├── vercel.json
├── public/
│   ├── logo.svg        ← United Mortgage wordmark placeholder
│   └── favicon.ico
├── src/
│   ├── index.html      ← HTML skeleton (Phase 2: replaced with user-supplied design)
│   ├── styles/
│   │   └── main.css    ← Reset + mobile-first base
│   ├── scripts/
│   │   ├── form.js     ← Phase 3: validation + submission
│   │   └── gtag.js     ← Phase 4: Google Ads conversion pixel
│   └── api/
│       └── submit-lead.js  ← Vercel serverless fn → Lead Mailbox
└── README.md
```
