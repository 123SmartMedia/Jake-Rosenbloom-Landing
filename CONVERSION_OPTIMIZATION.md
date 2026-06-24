# Conversion Optimization Plan — Originator Landing Funnel

**Project:** Jake Rosenbloom landing page (`jake-rosenbloom-landing`)
**Owner:** Michael / United Mortgage Corp · 123 Smart Media
**Stack:** Next.js · Supabase · Vercel · Twilio · SendGrid · Total Expert (CRM/LOS)
**Traffic profile:** Mobile-majority · Paid-first (Google Search, then Meta) · Demand-capture before demand-gen
**Last updated:** 2026-06-24

> **How to use this doc:** This is a living implementation checklist, sequenced so each phase unblocks the next. Do **not** turn on paid traffic until Phase 0 tracking is verified firing. Treat any platform-policy numbers (radius, age bands, etc.) as accurate as of mid-2026 and **re-verify with UMC compliance and the live platform docs before launch** — Meta's rules are changing fast this year.

---

## 1. Current State

The page is a strong foundation — keep it, don't rebuild. Layer onto it.

**Working well**
- Empathetic, benefit-led copy.
- Multi-step quiz uses micro-commitments (sunk-cost / Zeigarnik) correctly.
- Clean TCPA consent language; EHL logo, NMLS link, and disclosures already present.
- Single clear CTA; "no credit check / no obligation" friction-removers.

**Gaps to fix (detailed below)**
- Dead footer links (compliance + trust leak).
- No analytics or conversion tracking of any kind.
- Contact step too heavy for mobile.
- Trust signals and social proof buried below the fold.
- No speed-to-lead automation behind the form.
- Built as a one-off, not a reusable originator template.

---

## 2. Guiding Strategy

1. **Paid-first means tracking is the product.** Every visitor costs money; the platforms only optimize as well as the conversion signal you feed them. Server-side tracking + lead-quality feedback come before any on-page polish.
2. **Optimize for funded loans, not form-fills.** Tier conversion events so Google/Meta learn to find closings, not junk leads.
3. **Google and Meta are different funnels.** Google = high intent → quiz-first, message-matched. Meta = low intent + heavily restricted targeting → warm-up first, page does the qualifying.
4. **Speed-to-lead is the biggest off-page lever.** Connection odds fall off a cliff after ~5 minutes.
5. **Build once, deploy many.** Make it a config-driven template so rolling out to other UMC originators is a data change, not a dev cycle.

---

## 3. Phase 0 — Foundation & Tracking (before any spend)

**Nothing paid goes live until this phase is verified.**

### Fixes
- [ ] Replace dead footer links — Privacy Policy, Terms of Use, Licensing, Contact all currently point to `#`. Privacy Policy is effectively mandatory (PII + TCPA consent).
- [ ] Deep-link the NMLS number to Jake's specific record (NMLS #1284586) instead of the generic consumer-access homepage.
- [ ] Add `tel:` click-to-call on "Talk to Jake" (top + sticky bar). High-intent mobile escape hatch.

### Instrumentation
- [ ] **PostHog** (free tier) — funnel analysis + **session replay**. Replay is the priority: watch real mobile users fumble the form.
- [ ] Tag each quiz step as an event: `step_1_view → step_2_view → step_3_view → step_4_view → step_5_view → lead_submit`.
- [ ] **GA4** + **Google Enhanced Conversions** (server-side).
- [ ] **Meta Pixel + Conversions API (CAPI)** — fire from the Supabase backend on submit, not browser-only (iOS signal loss makes client-only unreliable).
- [ ] **UTM discipline** on every ad (source / campaign / ad group / creative) so attribution flows through.
- [ ] Verify all events fire correctly end-to-end **before** turning on spend.

### Tiered conversion events (the quality signal)
Fire different events at different funnel depths so the algorithms optimize toward closings, not completions:

| Event | Trigger | Value sent | Purpose |
|---|---|---|---|
| `lead_submitted` | Form complete | low / $0 | Volume baseline |
| `lead_qualified` | Passes pre-qual (speed-to-lead step) | medium | Filters junk |
| `application_started` | Becomes an app in Total Expert | higher | Real intent |
| `loan_funded` | Funded (offline conversion import) | actual loan value | Trains for revenue |

- [ ] Wire Total Expert → Google/Meta **offline / CRM conversion import** so funded outcomes feed back.

---

## 4. Phase 1 — Mobile-First Page Levers

Mobile is the majority, so these jump ahead of most copy/content ideas.

- [ ] **Sticky bottom CTA bar** — always-visible "Start" + "Call Jake" that follows scroll.
- [ ] **Correct input types + autofill** — numeric keypad for phone, email keyboard for email, `autocomplete` tokens so the browser one-taps name/email/phone. Removes most Step 5 friction.
- [ ] **Lazy-load the Jake video** (poster image + tap-to-play; never autoplay a heavy file). Compress hero image.
- [ ] **Core Web Vitals pass** — mobile speed feeds Google Quality Score *and* reduces bounce on paid clicks (double duty).
- [ ] **Split Step 4** — price range and agent status onto separate screens (one question per screen).

---

## 5. Phase 2 — Highest-ROI Content & Trust

Ranked by expected impact (directional — confirm against Phase 0 data, don't treat as promises).

- [ ] **Add a 30–45s Jake video** in the hero, beside the quiz. Highest-ROI content change; a clean phone video is enough.
- [ ] **Lighten the contact step** — test first name + phone as the required minimum (phone is the money field); collect the rest on the call.
- [ ] **Move one trust signal above the fold** — compact "★ 4.9 · 24 reviews" badge next to the quiz (currently buried).
- [ ] **A/B test the headline.** Current "Know where you stand before you fall for a house" is clever but slightly negative and not direct-response. Test affordability-direct variants (and message-match to Google ad groups):
  - *"See how much home you can afford in 60 seconds — no credit pull."*
  - *"Get your personalized homebuying game plan before you make an offer."*
- [ ] **Benefit-driven button copy** — "Continue/Submit" → "See My Options" / "Get My Game Plan."
- [ ] **Richer testimonials** — add city/state + loan type per review; pull production proof ("$X funded · X families helped · 26 states") from Total Expert.
- [ ] **Affordability calculator** before the form ("What could your payment look like?") with a "want exact numbers? finish the 60-second assessment" handoff. (Lower priority than video/form/thank-you page. Note: loan-calculator imagery in *ad creative* can auto-trigger Meta's Housing category — fine on the page, be deliberate in ads.)
- [ ] **Realtor-referral angle** — for "no agent yet," offer "we can connect you with a trusted local agent." Adds value + a second conversion path.

### Capture more of existing traffic
- [ ] **Partial-lead capture** — collect email/phone early ("so we can save your progress") so abandoners are retargetable instead of zero. Often recovers 15–30% of dropped sessions.
- [ ] **Exit-intent lead magnet** — state-specific "First-Time Buyer Checklist" / "Down Payment Assistance Guide," segmented to the Step 1 answer.
- [ ] **Optimize the thank-you page** — calendar booking link + short Jake thank-you video + checklist download. Converts a passive "we'll call you" into an immediate next action.

---

## 6. Phase 3 — Two-Variant Funnel (Google vs Meta)

A single page can't be optimal for both sources. The config-driven template (Phase 5) makes spinning up source-specific variants cheap.

### Google (high intent) — quiz-first
- [ ] Keep the quiz prominent above the fold.
- [ ] Message-match headline to the ad group's keyword (search intent → matching promise).
- [ ] This will likely be the higher-converting source — launch and prove unit economics here first.

### Meta (low intent + restricted targeting) — warm-first
- [ ] Lead with Jake's video + emotional hook + social proof; offer the lead magnet as a softer entry than the full quiz.
- [ ] The page must do the qualifying, because Meta targeting is gutted (see §7).

---

## 7. Meta Housing Special Ad Category (HEC) — Compliance Constraints

**Mortgage/financing ads fall under Meta's Housing Special Ad Category.** This reshapes Meta strategy and must be set correctly or ads get rejected / the account flagged. *Verify current specifics before launch.*

**Targeting is heavily restricted under Housing:**
- No ZIP-code targeting.
- Minimum **15-mile radius** in the US.
- Age locked to **18–65+**; all genders required.
- Interest-based targeting and audience exclusions removed.
- Custom **lookalikes disabled**; the "Special Ad Audience" workaround is now deprecated too.

**Strategic implication:** You cannot target your way to quality on Meta — **the creative and the landing page do the qualifying.** Cast a broad compliant net; let the funnel filter. This is *why* Meta needs the warm-up/lead-magnet entry.

**2026 enforcement realities:**
- [ ] Review is **proactive + multimodal** — text, images, AND the destination landing page are scanned together before the first impression. Page compliance now affects ad **approval**, not just legal posture.
- [ ] Mortgage/loan-calculator **imagery** is auto-flagged as a housing signal.
- [ ] **AI-generated ad creative must carry an AI-disclosure label.**
- [ ] Avoid exclusivity language (e.g., "best rate in your area") — Fair Housing classifiers flag it.

**Google side:** parallel HEC restrictions for housing/credit ads + advertiser identity verification for financial services (lighter than Meta, but real). Verify current requirements before launch.

> ⚠️ Run all Fair Housing / Special Ad Category decisions through UMC compliance. This doc summarizes platform mechanics, not legal advice.

---

## 8. Phase 4 — Speed-to-Lead Automation (parallel from day one)

The biggest off-page conversion driver, doubling as the junk-lead filter and quality-signal source.

- [ ] **Instant bridge SMS (Twilio)** the moment the form hits Supabase:
  > "Hi {{first}}, Jake here — I just got your info and I'm pulling your {{state}} options. I'll call shortly, or text me back with a quick question."
- [ ] **AI voice pre-qualifier** (Vapi / Bland / Retell via Twilio) — calls within ~60s when Jake is tied up; answers basics, pre-qualifies, books into his calendar. Fires the `lead_qualified` event.
- [ ] **State-based drip (SendGrid)** for no-answers: grants in {{state}} → affordability at their budget → mistakes to avoid.
- [ ] **Route leads into Total Expert** (not just email to Jake) so nothing drops as volume grows, and so funded outcomes can feed §3's conversion import.

---

## 9. Phase 5 — Foresight: Originator Template

Jake is a UMC originator, so the highest-leverage move is making his page the **repeatable template**, not a one-off.

- [ ] Make config-driven (not hardcoded): headshot, name, NMLS #, video, reviews, licensed-state list, routing destination, ad-source variant.
- [ ] Standardize event tracking across all originator pages → one comparison dashboard.
- [ ] Push winning A/B variants fleet-wide instead of per-page rework.
- [ ] Result: onboarding the next 20 LOs is a data change, and analytics stay comparable.

---

## 10. Unit Economics — Set the Bid Ceiling Before Spending

Define the ceiling before paid goes live, or you're bidding blind.

```
Max allowable CPL = (revenue per funded loan × lead-to-fund %) × target acquisition margin
```

- [ ] Plug in real UMC numbers once Phase 0 yields the lead-to-fund rate.
- [ ] This sets the bid ceiling that keeps paid profitable, and tells you how hard page CVR has to work.
- [ ] If leads are expensive and fund-rate is low, the speed-to-lead automation and quality-feedback loop stop being optional.

---

## 11. Execution Order (linear)

1. **Phase 0** — Fixes + tracking + tiered events verified firing. *(No spend before this.)*
2. **Launch Google first** — quiz-first, message-matched, mobile speed dialed for Quality Score. Prove unit economics on existing demand.
3. **Layer Meta second** — HEC-compliant setup, warm-first variant, page + creative pre-checked.
4. **Speed-to-lead automation in parallel** from day one.
5. **After ~2 weeks of live data** — let real drop-off + CPL-by-source rank the next A/B tests; compute true max CPL.
6. **Templatize** once the single page is proven, before scaling to other originators.

---

## 12. Open Decisions / To Confirm
- [ ] Confirm current Meta HEC radius/age rules and Google financial-services ad requirements with compliance (pre-launch).
- [ ] Revenue-per-funded-loan and lead-to-fund assumptions for the CPL ceiling.
- [ ] Which AI voice provider (Vapi / Bland / Retell) for the pre-qualifier.
- [ ] Total Expert conversion-import method (native integration vs. webhook/Zapier/Make).
- [ ] Whether to build the config-driven template now or after the single-page proof.
