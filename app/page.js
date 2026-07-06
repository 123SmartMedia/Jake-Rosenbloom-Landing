import { Suspense } from 'react';
import TopBar from '@/components/TopBar';
import SiteHeader from '@/components/SiteHeader';
import LeadForm from '@/components/LeadForm';
import StickyBar from '@/components/StickyBar';
import HeadshotAvatar from '@/components/HeadshotAvatar';

const phone = process.env.NEXT_PUBLIC_JAKE_PHONE || '+10000000000';

export default function Home() {
  return (
    <>
      <TopBar />
      <SiteHeader />

      {/* ── Trust Split: video left / form right ── */}
      <div className="trust-split">

        {/* Left — background video */}
        <div className="video-col">
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="/jake-poster.jpg"
            aria-hidden="true"
          >
            {/* TODO: replace src with CDN URL before deploying to production */}
            <source src="/JakeVideo.mp4" type="video/mp4" />
          </video>
          <div className="video-overlay" aria-hidden="true" />
        </div>

        {/* Right — form column */}
        <div className="form-col">
          <p className="form-col-eyebrow">✦ No obligation · No credit pull</p>
          <h1 className="form-col-headline">Get Pre-Approved with Jake Rosenbloom</h1>
          <p className="form-col-lede">
            Licensed in 26 states · Personal follow-up from Jake · No hard credit pull to get started
          </p>

          <Suspense>
            <LeadForm />
          </Suspense>

          {/* Loan officer intro card */}
          <div className="intro">
            <HeadshotAvatar />
            <div className="who">
              <span className="role">Your loan officer</span>
              <strong>Jake Rosenbloom</strong>
              <span>&ldquo;Hi! I&apos;ll personally make sure you get clear answers — no pressure, no runaround.&rdquo;</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trust strip — key stats below the fold break */}
      <div className="trust-strip">
        <div className="wrap">
          <div className="item"><strong>26</strong> states licensed</div>
          <div className="item"><strong>8</strong> loan programs</div>
          <div className="item"><strong>Same-day</strong> follow-up from Jake</div>
          <div className="item">
            NMLS{' '}
            <a
              href="https://www.nmlsconsumeraccess.org/EntityDetails.aspx/INDIVIDUAL/1284586"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--teal)', fontWeight: 600 }}
            >
              #1284586
            </a>
          </div>
        </div>
      </div>

      {/* Sticky bar — watches when form scrolls off screen */}
      <Suspense>
        <StickyBar phone={phone} />
      </Suspense>

      {/* Reviews */}
      <section className="block" style={{ background: '#fff', borderBottom: '1px solid var(--line)' }}>
        <div className="wrap">
          <p className="sec-eyebrow">What buyers say</p>
          <h2 className="sec-title">Trusted by buyers across the region</h2>

          <div className="rev-head">
            <div className="rating-pill">
              <span className="dot g">G</span>
              <div>
                <div className="stars" role="img" aria-label="5 out of 5 stars">★★★★★</div>
                <div className="rp-meta"><strong>5.0</strong> · 6 Google reviews</div>
              </div>
            </div>
            <div className="rating-pill">
              <span className="dot z">Z</span>
              <div>
                <div className="stars" role="img" aria-label="5 out of 5 stars">★★★★★</div>
                <div className="rp-meta"><strong>4.94</strong> · 18 Zillow reviews</div>
              </div>
            </div>
          </div>

          <div className="rev-grid">
            <div className="rev">
              <div className="stars" role="img" aria-label="5 out of 5 stars">★★★★★</div>
              <p>&ldquo;Being a first-time homeowner was a very challenging process to navigate, however, Jake made this journey seem much more manageable for my husband and I. He is extremely knowledgeable in his trade, responsive, attentive, and compassionate. We were so lucky to have him by our side! I have and will continue to recommend him to everyone!&rdquo;</p>
              <div className="by"><span className="av">JS</span><span className="nm">Joanna S.<small>Google review</small></span></div>
            </div>
            <div className="rev">
              <div className="stars" role="img" aria-label="5 out of 5 stars">★★★★★</div>
              <p>&ldquo;Jake helped us get our house as first-time home buyers and made the process easy. Very honest, and will answer your questions any time of the day. Highly recommend!&rdquo;</p>
              <div className="by"><span className="av">CS</span><span className="nm">Cody S.<small>Google review</small></span></div>
            </div>
            <div className="rev">
              <div className="stars" role="img" aria-label="5 out of 5 stars">★★★★★</div>
              <p>&ldquo;Working with Jake as my mortgage officer was an outstanding experience from start to finish. He was incredibly helpful throughout the entire process, always taking the time to explain each step clearly and making sure I felt confident in every decision.&rdquo;</p>
              <div className="by"><span className="av">GJ</span><span className="nm">Garrett J.<small>Google review</small></span></div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="block">
        <div className="wrap">
          <p className="sec-eyebrow">Simple from here</p>
          <h2 className="sec-title">Three steps, no guesswork</h2>
          <p className="sec-sub">We keep it human. You&apos;ll always know what&apos;s happening and what comes next.</p>
          <div className="steps3">
            <div className="s3">
              <div className="n">1</div>
              <h3>Tell us your goal</h3>
              <p>Your answers go straight to Jake so he can tailor your options to your situation and state.</p>
            </div>
            <div className="s3">
              <div className="n">2</div>
              <h3>Talk it through</h3>
              <p>Jake reviews your goals and explains your real options in plain English — including programs you may not know about.</p>
            </div>
            <div className="s3">
              <div className="n">3</div>
              <h3>Move forward with a plan</h3>
              <p>When you&apos;re ready, we guide you through the application and toward closing. All loans are subject to underwriting approval.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Loan products */}
      <section className="block" style={{ background: '#fff', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="wrap">
          <p className="sec-eyebrow">One team, every loan type</p>
          <h2 className="sec-title">Loan options under one roof</h2>
          <p className="sec-sub">First home, dream home, or somewhere in between — we&apos;ll match you to the right fit. Availability and terms vary by state and eligibility.</p>
          <div className="prods">
            <div className="prod"><h3>Conventional</h3><p>Flexible terms for buyers with steady credit and income.</p></div>
            <div className="prod"><h3>FHA</h3><p>Lower down payment options, popular with first-time buyers.</p></div>
            <div className="prod"><h3>VA</h3><p>For eligible veterans, service members, and surviving spouses.</p></div>
            <div className="prod"><h3>USDA</h3><p>For eligible buyers in qualifying rural and suburban areas.</p></div>
            <div className="prod"><h3>Jumbo</h3><p>Financing for higher-value homes above conforming limits.</p></div>
            <div className="prod"><h3>Down Payment Assistance</h3><p>Programs that can help with upfront costs, if eligible.</p></div>
            <div className="prod"><h3>Refinance</h3><p>Explore whether a refinance fits your goals down the road.</p></div>
            <div className="prod"><h3>Reverse / HECM</h3><p>Options for qualifying homeowners 62+.</p></div>
          </div>
        </div>
      </section>

      {/* Why Jake */}
      <section className="block">
        <div className="wrap">
          <div className="why">
            <div>
              <h2>Why buyers choose Jake</h2>
              <p>You get a knowledgeable partner who picks up the phone, explains the details, and keeps your file moving — backed by a full lender with national reach.</p>
              <p style={{ margin: 0 }}>We compete on reliability, speed, and product range — not gimmicks.</p>
            </div>
            <div className="why-stats">
              <div className="st"><span className="num">26</span><span className="lbl">States licensed</span></div>
              <div className="st"><span className="num">8</span><span className="lbl">Loan programs</span></div>
              <div className="st"><span className="num">1:1</span><span className="lbl">Direct access to Jake</span></div>
              <div className="st"><span className="num">Same-day</span><span className="lbl">Typical follow-up</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="block" style={{ background: '#fff', borderTop: '1px solid var(--line)' }}>
        <div className="wrap">
          <p className="sec-eyebrow">Good questions</p>
          <h2 className="sec-title">Before you get started</h2>
          <div className="faq" style={{ marginTop: 34 }}>
            <details className="qa">
              <summary>Will this affect my credit?</summary>
              <p>No. Filling out this short form does not pull your credit. If you decide to move forward later, Jake will explain every step before anything happens.</p>
            </details>
            <details className="qa">
              <summary>Do I have to commit to anything?</summary>
              <p>Not at all. This is an inquiry, not an application or a commitment. It simply connects you with Jake, who can answer your questions.</p>
            </details>
            <details className="qa">
              <summary>I&apos;m a first-time buyer and feel lost. Is that okay?</summary>
              <p>That&apos;s exactly who we love working with. We&apos;ll walk you through how much you may be able to put toward a home, which programs fit, and what the path looks like — no jargon.</p>
            </details>
            <details className="qa">
              <summary>Which states do you serve?</summary>
              <p>We&apos;re currently licensed in 26 states: Alabama, Arkansas, California, Connecticut, Florida, Idaho, Indiana, Iowa, Kentucky, Louisiana, Maryland, Massachusetts, Mississippi, Montana, New Jersey, New Mexico, New York, North Carolina, Ohio, Oklahoma, Pennsylvania, South Carolina, Tennessee, Texas, Washington, and Wyoming. Program availability and terms vary by state and eligibility — Jake will confirm what&apos;s available where you&apos;re buying.</p>
            </details>
            <details className="qa">
              <summary>How soon will someone reach out?</summary>
              <p>Typically the same business day. Jake follows up personally — not an automated call center.</p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="block">
        <div className="wrap">
          <div className="cta-band">
            <h2>Ready to see your options?</h2>
            <p>It takes about a minute, and there&apos;s no obligation.</p>
            <a href="#lead-form-card" className="btn btn-primary" style={{ textDecoration: 'none' }}>
              Start now
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="site">
        <div className="wrap">
          <div className="foot-top">
            <div>
              <img
                className="foot-logo"
                src="/United-Mortgage-Color-Logo-200x200.png"
                alt="United Mortgage Corp."
              />
              <div>United Mortgage Corp. · Headquartered in Melville, NY · Licensed in 26 states</div>
            </div>
            <div className="foot-links">
              <a href="https://unitedmortgage.com/wp-content/uploads/2021/02/UNITED-MORTGAGE-CORP.-PRIVACY-NOTICE.pdf" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
              <a href="https://unitedmortgage.com/about-us/policies/" target="_blank" rel="noopener noreferrer">Terms of Use</a>
              <a href="/licensing">Licensing</a>
              <a href="mailto:placeholder@unitedmortgage.com">Contact</a>
            </div>
          </div>
          <div className="compliance">
            <img src="/ehl-logo.svg" alt="Equal Housing Lender" className="ehl-logo-footer" />
            <span className="block">
              Jake Rosenbloom, NMLS{' '}
              <a
                href="https://www.nmlsconsumeraccess.org/EntityDetails.aspx/INDIVIDUAL/1284586"
                target="_blank"
                rel="noopener noreferrer"
                className="nmls-link"
              >
                #1284586
              </a>{' '}
              · United Mortgage Corp., NMLS #1330
            </span>
            <br />
            Not a commitment to lend.
            <br /><br />
            United Mortgage Corp., NMLS #1330, Corporate Office: 401 Broadhollow Road, Suite 150,
            Melville, NY 11747. United Mortgage Corp. is not affiliated with your current lender nor
            an agency of the federal government. This is not a government form, a credit decision, or
            a commitment to lend. All loans are subject to credit approval and underwriting. Rates,
            terms, and programs are subject to change without notice, may not be available at
            commitment or closing, and vary by state and borrower eligibility. Submitting this form
            does not constitute a loan application or an approval. Refinancing an existing loan may
            increase the total finance charges over the life of the loan. Equal Housing Opportunity.
            NMLS Consumer Access:{' '}
            <a
              href="https://www.nmlsconsumeraccess.org/EntityDetails.aspx/INDIVIDUAL/1284586"
              target="_blank"
              rel="noopener noreferrer"
              className="nmls-link"
            >
              www.nmlsconsumeraccess.org
            </a>.
          </div>
        </div>
      </footer>
    </>
  );
}
