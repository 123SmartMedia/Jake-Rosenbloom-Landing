# Jake Rosenbloom — Loan Officer Landing Page & Sales Funnel

## Project Overview
A high-converting landing page and sales funnel for **Jake Rosenbloom**, Loan Officer at **United Mortgage**. The page will capture qualified mortgage leads via paid Google Ads traffic and route submissions into the **"Lead Mailbox" CRM** for Jake's follow-up workflow.

**Current Date Context:** Tuesday, June 24, 2026

---

## Stakeholders
- **Loan Officer:** Jake Rosenbloom
- **Brokerage:** United Mortgage
- **CRM:** Lead Mailbox
- **Hosting (staging):** Vercel
- **Hosting (production):** Subdomain on United Mortgage's primary domain
- **Traffic Source:** Google Ads (AdWords)

---

## Goals
1. Deliver a mobile-first, fast-loading landing page optimized for paid search traffic.
2. Capture lead data (name, email, phone, loan type, property info, etc.) via a multi-step or single-step form.
3. Inject the United Mortgage corporate logo into the hero/header/footer.
4. Submit every form entry directly to the Lead Mailbox CRM via its API or webhook endpoint.
5. Deploy to Vercel for review, then migrate to a United Mortgage subdomain (e.g., `jake.unitedmortgage.com`).
6. Connect the site to a Google Ads account for conversion tracking and paid traffic routing.

---

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | HTML / CSS / Vanilla JS (user-supplied base design) |
| Framework (optional) | Next.js or Astro if dynamic routing / API routes needed |
| Forms | Custom HTML form → serverless API route (Vercel Functions) |
| CRM Integration | Lead Mailbox API / Webhook (endpoint TBD — user to provide) |
| Hosting (staging) | Vercel |
| Hosting (prod) | United Mortgage subdomain (DNS CNAME to Vercel or static export) |
| Analytics | Google Ads Conversion Tag + Google Analytics 4 |
| Domain | `jake.[unitedmortgagedomain].com` (exact TLD TBD) |

---

## Architecture
[Google Ad] → [Landing Page on Vercel] → [Form Submission]
↓
[Vercel Serverless Function]
↓
[Lead Mailbox CRM API/Webhook]
↓
[Jake's Lead Mailbox Inbox]


### Conversion Tracking Flow
[Form Success] → [gtag('event', 'generate_lead')] → [Google Ads Conversion]


---

## File Structure (Proposed)
jake-rosenbloom-landing/
├── project.md
├── package.json
├── vercel.json
├── public/
│ ├── logo.svg ← United Mortgage corporate logo
│ ├── favicon.ico
│ └── og-image.png
├── src/
│ ├── index.html ← User-supplied base HTML
│ ├── styles/
│ │ └── main.css
│ ├── scripts/
│ │ ├── form.js ← Form validation + submission
│ │ └── gtag.js ← Google Ads conversion pixel
│ └── api/
│ └── submit-lead.js ← Vercel serverless fn → Lead Mailbox
└── README.md


---

## Lead Mailbox CRM Integration

### Required Fields (confirm with user)
- Full Name
- Email
- Phone
- Loan Purpose (Purchase / Refinance / HELOC)
- Estimated Loan Amount
- Property Zip Code
- Consent / TCPA opt-in timestamp
- UTM parameters (source, medium, campaign, ad, keyword)

### Integration Method (TBD — pick one)
- [ ] REST API POST with Bearer token
- [ ] Inbound Webhook URL
- [ ] Zapier/Make bridge to Lead Mailbox

> ⚠️ **Action Item:** User must provide Lead Mailbox API docs or webhook URL before form wiring.

---

## Google Ads Integration
1. Install `gtag.js` globally with the Google Ads conversion ID (user to provide).
2. Fire `generate_lead` conversion event on successful form submit.
3. Optionally fire micro-conversions: `scroll_50`, `click_call`, `click_loan_calculator`.
4. Link Google Ads account to GA4 property for imported conversions.

---

## Hosting & Deployment Plan

### Phase 1 — Vercel Staging
- Push repo to GitHub.
- Import into Vercel.
- Auto-generates `*.vercel.app` preview URL.
- Share with Jake + United Mortgage marketing for approval.

### Phase 2 — United Mortgage Subdomain
- Create DNS CNAME record: `jake.unitedmortgage.com → cname.vercel-dns.com`
- Add custom domain in Vercel dashboard.
- Enable automatic SSL.
- Update any hard-coded URLs in HTML/JS.

---

## Development Phases

### Phase 1: Scaffolding
- [ ] Initialize repo, `package.json`, `vercel.json`
- [ ] Set up folder structure
- [ ] Placeholder `index.html`

### Phase 2: Design Integration
- [ ] Ingest user-supplied HTML/CSS
- [ ] Inject United Mortgage logo into header/footer
- [ ] Ensure responsive breakpoints (320 / 768 / 1024 / 1440)
- [ ] Accessibility pass (alt tags, ARIA, contrast)

### Phase 3: Form + CRM
- [ ] Build form markup with required fields
- [ ] Client-side validation
- [ ] Serverless `/api/submit-lead` function
- [ ] Wire to Lead Mailbox endpoint
- [ ] Success / error states

### Phase 4: Tracking
- [ ] Install gtag.js with Google Ads ID
- [ ] Fire conversion on form success
- [ ] Verify in Google Ads debug view

### Phase 5: Deploy
- [ ] Push to Vercel
- [ ] QA on staging URL
- [ ] Add United Mortgage subdomain
- [ ] Final smoke test

---

## Acceptance Criteria
- [ ] Page loads in < 2.5s on 4G (Lighthouse Performance ≥ 90)
- [ ] Form submits successfully and lead appears in Lead Mailbox within 60s
- [ ] Google Ads conversion fires on successful submit (verified via Tag Assistant)
- [ ] United Mortgage logo renders correctly in header + footer
- [ ] Fully responsive on iOS Safari, Chrome Android, desktop Chrome/Safari/Firefox
- [ ] TCPA consent checkbox is required and timestamp is captured
- [ ] UTM params are captured and forwarded to CRM

---

## Open Questions (Resolve Before Phase 3)
1. What is the exact Lead Mailbox API endpoint and auth method?
2. What is the Google Ads conversion ID?
3. What is the exact United Mortgage subdomain to be used?
4. Does Jake want a multi-step (quiz-style) funnel or a single-page form?
5. Are there specific loan products to feature (FHA, VA, Conventional, Jumbo)?
6. Should the page include a click-to-call button for mobile?
7. Any required disclaimers / NMLS # to display in footer?

---

## Notes
- User will supply the base HTML for look & feel — do not redesign from scratch.
- Keep JS footprint minimal; avoid heavy frameworks unless required by CRM.
- All form data must be transmitted over HTTPS.
- Do not store PII in Vercel logs — sanitize serverless function logs.

