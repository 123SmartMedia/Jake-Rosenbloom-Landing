import { PostHog } from 'posthog-node';

let _posthog = null;

function getPostHogClient() {
  if (!_posthog) {
    _posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
      flushAt: 1,
      flushInterval: 0,
    });
  }
  return _posthog;
}

export async function captureServerEvent(distinctId, event, properties = {}) {
  try {
    const client = getPostHogClient();
    client.capture({ distinctId, event, properties });
    await client.flush();
  } catch (err) {
    console.error('[PostHog server]', event, err?.message);
  }
}

// TODO Phase 0: replace stub with real Meta Graph API call
// https://developers.facebook.com/docs/marketing-api/conversions-api
export async function sendMetaCAPIEvent({ pixelId, accessToken, eventName, eventData }) {
  if (!pixelId || !accessToken) return;
  try {
    const url = `https://graph.facebook.com/v19.0/${pixelId}/events`;
    const body = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'website',
          ...eventData,
        },
      ],
      access_token: accessToken,
    };
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error('[Meta CAPI] error:', res.status, text);
    }
  } catch (err) {
    console.error('[Meta CAPI]', err?.message);
  }
}
