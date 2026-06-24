'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import posthog from 'posthog-js';

export default function PostHogProvider({ children }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialized = useRef(false);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';
    if (!key || initialized.current) return;
    posthog.init(key, {
      api_host: host,
      capture_pageview: false,
      persistence: 'localStorage+cookie',
    });
    initialized.current = true;
  }, []);

  useEffect(() => {
    if (!initialized.current) return;
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
    posthog.capture('$pageview', { $current_url: window.location.href });
  }, [pathname, searchParams]);

  return children;
}
