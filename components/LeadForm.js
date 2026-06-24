'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import posthog from 'posthog-js';
import { STATES, STATE_NOTICES, BLOCKED_STATES } from '@/lib/states';

const TOTAL = 6;

const GOAL_OPTIONS = [
  { value: 'Buying my first home', icon: '🏠', label: 'Buying my first home' },
  { value: 'Buying again / moving', icon: '📦', label: 'Buying again or moving' },
  { value: 'Refinancing', icon: '🔄', label: 'Refinancing my current home' },
  { value: 'Just exploring', icon: '🔍', label: 'Just exploring my options' },
];

const TIMELINE_OPTIONS = [
  { value: 'Ready now', icon: '⚡', label: "I'm ready now" },
  { value: '1–3 months', icon: '📅', label: 'In the next 1–3 months' },
  { value: '3–6 months', icon: '🗓️', label: '3–6 months out' },
  { value: 'Just researching', icon: '💭', label: 'Just researching for now' },
];

const AGENT_OPTIONS = [
  { value: 'Yes, I have an agent', icon: '🤝', label: 'Yes, I have an agent' },
  { value: 'No, not yet', icon: '🔎', label: "No, not yet" },
  { value: 'I am a real estate agent', icon: '🏡', label: 'I am a real estate agent' },
];

const PRICE_OPTIONS = [
  'Under $250k',
  '$250k – $400k',
  '$400k – $600k',
  '$600k – $850k',
  '$850k – $1.2M',
  'Over $1.2M',
  'Not sure yet',
];

function initData() {
  return {
    goal: '', state: '', timeline: '', price: '', agent: '',
    firstName: '', lastName: '', email: '', phone: '', consent: false,
    utmSource: '', utmMedium: '', utmCampaign: '', utmTerm: '', utmContent: '',
  };
}

export default function LeadForm() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [data, setData] = useState(initData);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [stateNotice, setStateNotice] = useState(null);
  const [stateBlocked, setStateBlocked] = useState(false);

  // Capture UTMs once on mount
  useEffect(() => {
    setData(prev => ({
      ...prev,
      utmSource: searchParams.get('utm_source') || '',
      utmMedium: searchParams.get('utm_medium') || '',
      utmCampaign: searchParams.get('utm_campaign') || '',
      utmTerm: searchParams.get('utm_term') || '',
      utmContent: searchParams.get('utm_content') || '',
    }));
  }, [searchParams]);

  // Fire step view events
  useEffect(() => {
    try { posthog.capture(`step_${step}_view`, { step, total: TOTAL }); } catch {}
  }, [step]);

  function setField(field, value) {
    setData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: false }));
  }

  function handleStateChange(value) {
    setField('state', value);
    const notice = STATE_NOTICES[value];
    const blocked = BLOCKED_STATES.includes(value);
    setStateNotice(notice || null);
    setStateBlocked(blocked);
  }

  function markErrors(fields) {
    const next = {};
    fields.forEach(f => { next[f] = true; });
    setErrors(prev => ({ ...prev, ...next }));
  }

  function validateStep() {
    if (step === 1) return !!data.goal;
    if (step === 2) {
      const chosen = !!data.state;
      if (!chosen) { markErrors(['state']); return false; }
      if (stateBlocked) return false;
      return true;
    }
    if (step === 3) return !!data.timeline;
    if (step === 4) {
      const ok = !!data.price;
      if (!ok) markErrors(['price']);
      return ok;
    }
    if (step === 5) return true; // agent is optional
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
    return true;
  }

  function advance() {
    if (!validateStep()) return;
    if (step < TOTAL) setStep(s => s + 1);
    else submitLead();
  }

  function goBack() {
    setStep(s => Math.max(1, s - 1));
  }

  // Option card click — auto-advance on choice steps
  function pickOption(field, value, autoAdvance = true) {
    setData(prev => ({ ...prev, [field]: value }));
    if (autoAdvance && step < TOTAL) {
      setTimeout(() => setStep(s => s + 1), 240);
    }
  }

  async function submitLead() {
    setSubmitting(true);
    const payload = {
      ...data,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      source: 'Google Ads – Homebuyer Funnel',
      page: typeof window !== 'undefined' ? window.location.href : '',
      submittedAt: new Date().toISOString(),
    };
    try {
      const res = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      try { posthog.capture('lead_submitted', { state: data.state, goal: data.goal }); } catch {}
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

  return (
    <div className="card" id="lead-form-card">
      <div className="card-head">
        <h2>Start your homebuying game plan</h2>
        <p>A few questions, then Jake follows up personally.</p>
        <div className="progress">
          <div className="bar" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <form noValidate onSubmit={e => { e.preventDefault(); advance(); }}>
        <div className="stepwrap">

          {/* ── Step 1: Goal ── */}
          {step === 1 && (
            <div className="step active">
              <p className="stepcount">Step 1 of {TOTAL}</p>
              <p className="qtitle">What brings you in today?</p>
              <div className="opts">
                {GOAL_OPTIONS.map(o => (
                  <button
                    key={o.value}
                    type="button"
                    className={`opt${data.goal === o.value ? ' sel' : ''}`}
                    onClick={() => pickOption('goal', o.value)}
                  >
                    <span className="ic">{o.icon}</span>
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 2: State ── */}
          {step === 2 && (
            <div className="step active">
              <p className="stepcount">Step 2 of {TOTAL}</p>
              <p className="qtitle">Where are you looking to buy?</p>
              <div className={`field${errors.state ? ' invalid' : ''}`}>
                <label htmlFor="state">State</label>
                <select
                  id="state"
                  name="state"
                  value={data.state}
                  onChange={e => handleStateChange(e.target.value)}
                >
                  <option value="">Select a state…</option>
                  {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <div className="err">Please choose a state.</div>
              </div>
              {stateNotice && (
                <div className={`state-notice${stateBlocked ? ' blocked' : ''}`}>
                  {stateNotice}
                </div>
              )}
              <p style={{ fontSize: 12, color: 'var(--gray)', margin: '2px 0 0' }}>
                Program availability and terms vary by state and eligibility.
              </p>
            </div>
          )}

          {/* ── Step 3: Timeline ── */}
          {step === 3 && (
            <div className="step active">
              <p className="stepcount">Step 3 of {TOTAL}</p>
              <p className="qtitle">When are you hoping to buy?</p>
              <div className="opts">
                {TIMELINE_OPTIONS.map(o => (
                  <button
                    key={o.value}
                    type="button"
                    className={`opt${data.timeline === o.value ? ' sel' : ''}`}
                    onClick={() => pickOption('timeline', o.value)}
                  >
                    <span className="ic">{o.icon}</span>
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 4: Price range ── */}
          {step === 4 && (
            <div className="step active">
              <p className="stepcount">Step 4 of {TOTAL}</p>
              <p className="qtitle">Roughly what price range?</p>
              <div className={`field${errors.price ? ' invalid' : ''}`}>
                <label htmlFor="price">Estimated home price</label>
                <select
                  id="price"
                  name="price"
                  value={data.price}
                  onChange={e => setField('price', e.target.value)}
                >
                  <option value="">Select a range…</option>
                  {PRICE_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <div className="err">Please pick a range (or &quot;Not sure yet&quot;).</div>
              </div>
            </div>
          )}

          {/* ── Step 5: Agent status ── */}
          {step === 5 && (
            <div className="step active">
              <p className="stepcount">Step 5 of {TOTAL}</p>
              <p className="qtitle">Are you working with a real estate agent?</p>
              <div className="opts">
                {AGENT_OPTIONS.map(o => (
                  <button
                    key={o.value}
                    type="button"
                    className={`opt${data.agent === o.value ? ' sel' : ''}`}
                    onClick={() => pickOption('agent', o.value)}
                  >
                    <span className="ic">{o.icon}</span>
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 6: Contact info ── */}
          {step === 6 && (
            <div className="step active">
              <p className="stepcount">Step 6 of {TOTAL}</p>
              <p className="qtitle">Where should we send your options?</p>
              <div className="field-row">
                <div className={`field${errors.firstName ? ' invalid' : ''}`}>
                  <label htmlFor="firstName">First name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    autoComplete="given-name"
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
                  inputMode="email"
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
                  inputMode="numeric"
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
                  By submitting, I agree that Team Bloom at United Mortgage Corp. may contact me by
                  phone, text, or email about my inquiry, including by automated means. Consent is
                  not a condition of any purchase. Message/data rates may apply. This is not a
                  commitment to lend or an approval; all loans are subject to underwriting.
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
              {submitting ? 'Sending…' : step === TOTAL ? 'See my options →' : 'Continue'}
            </button>
          </div>
          <p className="reassure">🔒 Your information is kept private and never sold.</p>
        </div>
      </form>
    </div>
  );
}
