'use client';

import { useEffect, useRef, useState } from 'react';

export default function StickyBar({ phone }) {
  const [visible, setVisible] = useState(false);
  const sentinelRef = useRef(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  function scrollToForm() {
    document.getElementById('lead-form-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  return (
    <>
      {/* Sentinel sits at the bottom of the hero/form section */}
      <div ref={sentinelRef} id="sticky-sentinel" aria-hidden="true" style={{ height: 1 }} />
      <div className={`sticky-bar${visible ? ' visible' : ''}`} role="complementary" aria-label="Quick contact">
        <button className="btn-cta" onClick={scrollToForm}>
          Start my game plan →
        </button>
        <a href={`tel:${phone}`} className="btn-call">
          📞 Call Jake
        </a>
      </div>
    </>
  );
}
