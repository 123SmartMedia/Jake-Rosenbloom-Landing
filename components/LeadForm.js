'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import posthog from 'posthog-js';

const TOTAL = 6;

// ── Step 1 ───────────────────────────────────────────────────────────────────
const GOAL_OPTIONS = [
  { value: 'Buying a home',              icon: '🏠', label: 'Buying a home' },
  { value: 'Refinancing my current home',icon: '🔄', label: 'Refinancing my current home' },
  { value: 'Turn my equity into cash',   icon: '💰', label: 'Turn my equity into cash' },
  { value: 'Just exploring my options',  icon: '🔍', label: 'Just exploring my options' },
];

// ── Path A — Buying ──────────────────────────────────────────────────────────
const PURCHASE_PRICE_OPTIONS = [
  'Under $250k', '$250k – $400k', '$400k – $600k',
  '$600k – $850k', '$850k – $1.2M', 'Over $1.2M', 'Not sure yet',
];
const DOWN_PAYMENT_OPTIONS = [
  { value: 'Less than 3.5%', icon: '💡', label: 'Less than 3.5%' },
  { value: '3.5% – 10%',     icon: '📊', label: '3.5% – 10%' },
  { value: '10% – 20%',      icon: '📈', label: '10% – 20%' },
  { value: '20% or more',    icon: '💪', label: '20% or more' },
  { value: 'Not sure yet',   icon: '🤔', label: 'Not sure yet' },
];
const CREDIT_SCORE_OPTIONS = [
  { value: '760+',      icon: '⭐', label: '760+  Excellent' },
  { value: '720–759',   icon: '✅', label: '720–759  Very Good' },
  { value: '680–719',   icon: '👍', label: '680–719  Good' },
  { value: '640–679',   icon: '📋', label: '640–679  Fair' },
  { value: 'Below 640', icon: '🔧', label: 'Below 640' },
  { value: 'Not sure',  icon: '❓', label: 'Not sure' },
];
const CLOSING_TIMELINE_OPTIONS = [
  { value: 'ASAP / already under contract', icon: '⚡', label: 'ASAP / under contract' },
  { value: '1–3 months',                    icon: '📅', label: '1–3 months' },
  { value: '3–6 months',                    icon: '🗓️', label: '3–6 months' },
  { value: '6–12 months',                   icon: '📆', label: '6–12 months' },
  { value: 'Just researching',              icon: '💭', label: 'Just researching' },
];

// ── All 50 US states + DC ────────────────────────────────────────────────────
const ALL_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada',
  'New Hampshire','New Jersey','New Mexico','New York','North Carolina',
  'North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island',
  'South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont',
  'Virginia','Washington','West Virginia','Wisconsin','Wyoming',
  'Washington D.C.',
];

// ── Path B — Refinancing ─────────────────────────────────────────────────────
const MORTGAGE_BALANCE_OPTIONS = [
  'Under $100k', '$100k – $200k', '$200k – $350k',
  '$350k – $500k', '$500k – $750k', 'Over $750k', 'Not sure',
];
const INTEREST_RATE_OPTIONS = [
  'Below 4%', '4% – 5%', '5% – 6%', '6% – 7%', '7% – 8%', 'Over 8%', 'Not sure',
];
const REFI_REASON_OPTIONS = [
  { value: 'Lower my monthly payment', icon: '📉', label: 'Lower my monthly payment' },
  { value: 'Get cash out',             icon: '💵', label: 'Get cash out' },
  { value: 'Shorter loan term',        icon: '⏱️', label: 'Shorter loan term' },
  { value: 'Other',                    icon: '💬', label: 'Other' },
];

// ── Path C — Equity / Cash ───────────────────────────────────────────────────
const HOME_VALUE_OPTIONS = [
  'Under $200k', '$200k – $350k', '$350k – $500k',
  '$500k – $750k', '$750k – $1M', 'Over $1M', 'Not sure',
];
const CASH_AMOUNT_OPTIONS = [
  'Under $25k', '$25k – $50k', '$50k – $100k',
  '$100k – $200k', 'Over $200k', 'Not sure yet',
];

// ── Path D — Exploring ───────────────────────────────────────────────────────
const HOMEOWNER_OPTIONS = [
  { value: 'Yes, I own my home',              icon: '🏡', label: 'Yes, I own my home' },
  { value: 'No, I rent',                      icon: '🔑', label: 'No, I rent' },
  { value: 'Living with family or friends',   icon: '👨‍👩‍👧', label: 'Living with family or friends' },
];
const INCOME_OPTIONS = [
  'Under $50k', '$50k – $75k', '$75k – $100k',
  '$100k – $150k', '$150k – $200k', 'Over $200k', 'Prefer not to say',
];
const CONCERN_OPTIONS = [
  { value: 'Not enough saved for a down payment', icon: '💰', label: 'Not enough saved for a down payment' },
  { value: 'My credit score needs work',          icon: '📊', label: 'My credit score needs work' },
  { value: "I don't know what I can afford",      icon: '🤔', label: "I don't know what I can afford" },
  { value: "I'm worried about rates",             icon: '📈', label: "I'm worried about rates" },
  { value: 'Something else',                      icon: '💬', label: 'Something else' },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function getPath(goal) {
  if (goal === 'Buying a home')               return 'A';
  if (goal === 'Refinancing my current home') return 'B';
  if (goal === 'Turn my equity into cash')    return 'C';
  if (goal === 'Just exploring my options')   return 'D';
  return null;
}

// Maps each step+path to the data field that must be non-empty to advance
const STEP_FIELD = {
  2: { A: 'purchasePriceRange', B: 'propertyState', C: 'propertyState', D: 'isHomeowner' },
  3: { A: 'downPayment',        B: 'mortgageBalance', C: 'homeValue',  D: 'annualIncome' },
  4: { A: 'creditScore',        B: 'currentInterestRate', C: 'mortgageBalance', D: 'creditScore' },
  5: { A: 'closingTimeline',    B: 'refinanceReason', C: 'cashAmount', D: 'biggestConcern' },
};

function initData() {
  return {
    goal: '',
    // Path A
    purchasePriceRange: '', downPayment: '', closingTimeline: '',
    // Path B
    propertyState: '', mortgageBalance: '', currentInterestRate: '', refinanceReason: '',
    // Path C
    homeValue: '', cashAmount: '',
    // Path D
    isHomeowner: '', annualIncome: '', biggestConcern: '',
    // Shared (A+D)
    creditScore: '',
    // Step 6
    firstName: '', lastName: '', email: '', phone: '', consent: false,
    // UTMs
    utmSource: '', utmMedium: '', utmCampaign: '', utmTerm: '', utmContent: '',
  };
}

export default function LeadForm() {
  const searchParams = useSearchParams();
  const [step, setStep]           = useState(1);
  const [data, setData]           = useState(initData);
  const [errors, setErrors]       = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]  = useState(false);

  // Capture UTMs once on mount
  useEffect(() => {
    setData(prev => ({
      ...prev,
      utmSource:   searchParams.get('utm_source')   || '',
      utmMedium:   searchParams.get('utm_medium')   || '',
      utmCampaign: searchParams.get('utm_campaign') || '',
      utmTerm:     searchParams.get('utm_term')     || '',
      utmContent:  searchParams.get('utm_content')  || '',
    }));
  }, [searchParams]);

  const path = getPath(data.goal);

  // Fire step-view PostHog events
  useEffect(() => {
    try { posthog.capture(`step_${step}_view`, { step, total: TOTAL, path }); } catch {}
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  function setField(field, value) {
    setData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: false }));
  }

  function markErrors(fields) {
    const next = {};
    fields.forEach(f => { next[f] = true; });
    setErrors(prev => ({ ...prev, ...next }));
  }

  function validateStep() {
    if (step === 1) return !!data.goal;

    if (step === 6) {
      const fn = data.firstName.trim().length > 0;
      const ln = data.lastName.trim().length > 0;
      const em = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim());
      const ph = data.phone.replace(/\D/g, '').length >= 10;
      const co = data.consent;
      const bad = [];
      if (!fn) bad.push('firstName');
      if (!ln) bad.push('lastName');
      if (!em) bad.push('email');
      if (!ph) bad.push('phone');
      if (!co) bad.push('consent');
      if (bad.length) { markErrors(bad); return false; }
      return true;
    }

    const field = STEP_FIELD[step]?.[path];
    if (!field) return true;

    if (!data[field]) { markErrors([field]); return false; }
    return true;
  }

  function advance() {
    if (!validateStep()) return;
    if (step < TOTAL) setStep(s => s + 1);
    else submitLead();
  }

  function goBack() { setStep(s => Math.max(1, s - 1)); }

  // Button-card tap: set value + auto-advance after brief delay
  function pickOption(field, value) {
    setData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: false }));
    if (step < TOTAL) setTimeout(() => setStep(s => s + 1), 240);
  }

  async function submitLead() {
    setSubmitting(true);
    const payload = {
      ...data,
      firstName: data.firstName.trim(),
      lastName:  data.lastName.trim(),
      email:     data.email.trim(),
      phone:     data.phone.trim(),
      source:    'Landing Page — Jake Rosenbloom',
      page:      typeof window !== 'undefined' ? window.location.href : '',
      submittedAt: new Date().toISOString(),
    };
    try {
      const res = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      try { posthog.capture('lead_submitted', { goal: data.goal, path }); } catch {}
      setSubmitted(true);
    } catch (err) {
      console.error('[submit-lead]', err?.message);
      setSubmitting(false);
      alert('Something went wrong. Please try again or call Jake directly.');
    }
  }

  const progress = Math.round((step / TOTAL) * 100);

  if (submitted) {
    return (
      <div className="card" id="lead-form-card">
        <div className="success show">
          <div className="check">✓</div>
          <h2>You&apos;re all set.</h2>
          <p>Thanks — your request is in. Jake will reach out shortly to walk through your options and answer your questions.</p>
          <p style={{ marginTop: 14, fontWeight: 600, color: 'var(--navy)' }}>No obligation. No pressure.</p>
        </div>
      </div>
    );
  }

  // ── Shared render helpers ─────────────────────────────────────────────────
  function OptButtons({ field, options }) {
    return (
      <div className="opts">
        {options.map(o => (
          <button
            key={o.value}
            type="button"
            className={`opt${data[field] === o.value ? ' sel' : ''}`}
            onClick={() => pickOption(field, o.value)}
          >
            <span className="ic">{o.icon}</span>
            {o.label}
          </button>
        ))}
      </div>
    );
  }

  function SelectField({ field, options, label, placeholder, errorMsg }) {
    return (
      <div className={`field${errors[field] ? ' invalid' : ''}`}>
        <label htmlFor={field}>{label}</label>
        <select
          id={field}
          name={field}
          value={data[field]}
          onChange={e => setField(field, e.target.value)}
        >
          <option value="">{placeholder}</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <div className="err">{errorMsg}</div>
      </div>
    );
  }

  function PropertyStateField() {
    return (
      <div className={`field${errors.propertyState ? ' invalid' : ''}`}>
        <label htmlFor="propertyState">Property state</label>
        <select
          id="propertyState"
          name="propertyState"
          value={data.propertyState}
          onChange={e => setField('propertyState', e.target.value)}
        >
          <option value="">Select a state…</option>
          {ALL_STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <div className="err">Please select a state.</div>
      </div>
    );
  }

  return (
    <div className="card" id="lead-form-card">
      <div className="card-head">
        <h2>See how much home you can afford in 60 seconds&nbsp;— no credit pull.</h2>
        <p>Start your homebuying game plan. A few questions, then Jake follows up personally.</p>
        <div className="progress">
          <div className="bar" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <form noValidate onSubmit={e => { e.preventDefault(); advance(); }}>
        <div className="stepwrap">

          {/* ── Step 1: Goal (all paths) ── */}
          {step === 1 && (
            <div className="step active">
              <p className="stepcount">Step 1 of {TOTAL}</p>
              <p className="qtitle">What brings you in today?</p>
              <OptButtons field="goal" options={GOAL_OPTIONS} />
            </div>
          )}

          {/* ── PATH A — Buying a home ─────────────────────────────────────── */}
          {step === 2 && path === 'A' && (
            <div className="step active">
              <p className="stepcount">Step 2 of {TOTAL}</p>
              <p className="qtitle">What is your target purchase price range?</p>
              <SelectField
                field="purchasePriceRange"
                options={PURCHASE_PRICE_OPTIONS}
                label="Purchase price range"
                placeholder="Select a range…"
                errorMsg="Please select a price range."
              />
            </div>
          )}
          {step === 3 && path === 'A' && (
            <div className="step active">
              <p className="stepcount">Step 3 of {TOTAL}</p>
              <p className="qtitle">What is your estimated down payment?</p>
              <OptButtons field="downPayment" options={DOWN_PAYMENT_OPTIONS} />
            </div>
          )}
          {step === 4 && path === 'A' && (
            <div className="step active">
              <p className="stepcount">Step 4 of {TOTAL}</p>
              <p className="qtitle">What is your approximate credit score range?</p>
              <OptButtons field="creditScore" options={CREDIT_SCORE_OPTIONS} />
            </div>
          )}
          {step === 5 && path === 'A' && (
            <div className="step active">
              <p className="stepcount">Step 5 of {TOTAL}</p>
              <p className="qtitle">When are you looking to close?</p>
              <OptButtons field="closingTimeline" options={CLOSING_TIMELINE_OPTIONS} />
            </div>
          )}

          {/* ── PATH B — Refinancing ──────────────────────────────────────── */}
          {step === 2 && path === 'B' && (
            <div className="step active">
              <p className="stepcount">Step 2 of {TOTAL}</p>
              <p className="qtitle">Where is your current property located?</p>
              <PropertyStateField />
            </div>
          )}
          {step === 3 && path === 'B' && (
            <div className="step active">
              <p className="stepcount">Step 3 of {TOTAL}</p>
              <p className="qtitle">What is your current mortgage balance?</p>
              <SelectField
                field="mortgageBalance"
                options={MORTGAGE_BALANCE_OPTIONS}
                label="Current mortgage balance"
                placeholder="Select a range…"
                errorMsg="Please select your mortgage balance."
              />
            </div>
          )}
          {step === 4 && path === 'B' && (
            <div className="step active">
              <p className="stepcount">Step 4 of {TOTAL}</p>
              <p className="qtitle">What is your current interest rate?</p>
              <SelectField
                field="currentInterestRate"
                options={INTEREST_RATE_OPTIONS}
                label="Current interest rate"
                placeholder="Select a rate…"
                errorMsg="Please select your current rate."
              />
            </div>
          )}
          {step === 5 && path === 'B' && (
            <div className="step active">
              <p className="stepcount">Step 5 of {TOTAL}</p>
              <p className="qtitle">What is your primary reason for refinancing?</p>
              <OptButtons field="refinanceReason" options={REFI_REASON_OPTIONS} />
            </div>
          )}

          {/* ── PATH C — Turn equity into cash ───────────────────────────── */}
          {step === 2 && path === 'C' && (
            <div className="step active">
              <p className="stepcount">Step 2 of {TOTAL}</p>
              <p className="qtitle">Where is your property located?</p>
              <PropertyStateField />
            </div>
          )}
          {step === 3 && path === 'C' && (
            <div className="step active">
              <p className="stepcount">Step 3 of {TOTAL}</p>
              <p className="qtitle">What is your estimated home value?</p>
              <SelectField
                field="homeValue"
                options={HOME_VALUE_OPTIONS}
                label="Estimated home value"
                placeholder="Select a range…"
                errorMsg="Please select an estimated value."
              />
            </div>
          )}
          {step === 4 && path === 'C' && (
            <div className="step active">
              <p className="stepcount">Step 4 of {TOTAL}</p>
              <p className="qtitle">What is your current mortgage balance?</p>
              <SelectField
                field="mortgageBalance"
                options={MORTGAGE_BALANCE_OPTIONS}
                label="Current mortgage balance"
                placeholder="Select a range…"
                errorMsg="Please select your mortgage balance."
              />
            </div>
          )}
          {step === 5 && path === 'C' && (
            <div className="step active">
              <p className="stepcount">Step 5 of {TOTAL}</p>
              <p className="qtitle">How much cash are you looking to access?</p>
              <SelectField
                field="cashAmount"
                options={CASH_AMOUNT_OPTIONS}
                label="Cash amount needed"
                placeholder="Select a range…"
                errorMsg="Please select a cash amount."
              />
            </div>
          )}

          {/* ── PATH D — Just exploring ───────────────────────────────────── */}
          {step === 2 && path === 'D' && (
            <div className="step active">
              <p className="stepcount">Step 2 of {TOTAL}</p>
              <p className="qtitle">Are you currently a homeowner?</p>
              <OptButtons field="isHomeowner" options={HOMEOWNER_OPTIONS} />
            </div>
          )}
          {step === 3 && path === 'D' && (
            <div className="step active">
              <p className="stepcount">Step 3 of {TOTAL}</p>
              <p className="qtitle">What is your approximate annual household income?</p>
              <SelectField
                field="annualIncome"
                options={INCOME_OPTIONS}
                label="Annual household income"
                placeholder="Select a range…"
                errorMsg="Please select an income range."
              />
            </div>
          )}
          {step === 4 && path === 'D' && (
            <div className="step active">
              <p className="stepcount">Step 4 of {TOTAL}</p>
              <p className="qtitle">What is your approximate credit score range?</p>
              <OptButtons field="creditScore" options={CREDIT_SCORE_OPTIONS} />
            </div>
          )}
          {step === 5 && path === 'D' && (
            <div className="step active">
              <p className="stepcount">Step 5 of {TOTAL}</p>
              <p className="qtitle">What is your biggest concern about getting a mortgage?</p>
              <OptButtons field="biggestConcern" options={CONCERN_OPTIONS} />
            </div>
          )}

          {/* ── Step 6: Contact info (universal across all paths) ── */}
          {step === 6 && (
            <div className="step active">
              <p className="stepcount">Step 6 of {TOTAL}</p>
              <p className="qtitle">Almost done — where should we send your personalized plan?</p>
              <div className="field-row">
                <div className={`field${errors.firstName ? ' invalid' : ''}`}>
                  <label htmlFor="firstName">First name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    autoComplete="given-name"
                    enterKeyHint="next"
                    placeholder="Jordan"
                    value={data.firstName}
                    onChange={e => setField('firstName', e.target.value)}
                  />
                  <div className="err">Enter your first name.</div>
                </div>
                <div className={`field${errors.lastName ? ' invalid' : ''}`}>
                  <label htmlFor="lastName">Last name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    autoComplete="family-name"
                    enterKeyHint="next"
                    placeholder="Smith"
                    value={data.lastName}
                    onChange={e => setField('lastName', e.target.value)}
                  />
                  <div className="err">Enter your last name.</div>
                </div>
              </div>
              <div className={`field${errors.email ? ' invalid' : ''}`}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  enterKeyHint="next"
                  placeholder="you@email.com"
                  value={data.email}
                  onChange={e => setField('email', e.target.value)}
                />
                <div className="err">Please enter a valid email.</div>
              </div>
              <div className={`field${errors.phone ? ' invalid' : ''}`}>
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  autoComplete="tel"
                  enterKeyHint="done"
                  placeholder="(555) 555-1234"
                  value={data.phone}
                  onChange={e => setField('phone', e.target.value)}
                />
                <div className="err">Please enter a valid phone number.</div>
              </div>
              <label className="consent">
                <input
                  type="checkbox"
                  id="consent"
                  checked={data.consent}
                  onChange={e => setField('consent', e.target.checked)}
                />
                <span>
                  By submitting, you agree to our{' '}
                  <a href="/terms" target="_blank" rel="noopener noreferrer">Terms and Conditions</a>
                  {' '}and{' '}
                  <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                  , and consent to be contacted by Jake Rosenbloom via phone, email, or text
                  regarding your mortgage inquiry. Message and data rates may apply.
                </span>
              </label>
              {errors.consent && (
                <div className="field invalid" style={{ marginTop: 0 }}>
                  <div className="err" style={{ display: 'block' }}>Please check the box so we can reach you.</div>
                </div>
              )}
            </div>
          )}

          <div className="nav">
            {step > 1 && (
              <button type="button" className="btn btn-ghost" onClick={goBack}>
                Back
              </button>
            )}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Sending…' : step === TOTAL ? 'Get My Personalized Plan' : 'Continue'}
            </button>
          </div>
          <p className="reassure">🔒 Your information is kept private and never sold.</p>
        </div>
      </form>
    </div>
  );
}
