import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { captureServerEvent, sendMetaCAPIEvent } from '@/lib/analytics';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { firstName, lastName, email, phone, consent } = body;

  // Basic validation — required fields only
  if (!firstName || !lastName || !email || !phone || !consent) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 422 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 422 });
  }
  if (phone.replace(/\D/g, '').length < 10) {
    return NextResponse.json({ error: 'Invalid phone' }, { status: 422 });
  }

  // Persist to Supabase
  const supabase = getSupabaseAdmin();
  const { data: lead, error: dbError } = await supabase
    .from('leads')
    .insert({
      goal: body.goal || null,
      state: body.state || null,
      timeline: body.timeline || null,
      price: body.price || null,
      agent: body.agent || null,
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      consent: true,
      consent_at: new Date().toISOString(),
      source: body.source || null,
      page: body.page || null,
      utm_source: body.utmSource || null,
      utm_medium: body.utmMedium || null,
      utm_campaign: body.utmCampaign || null,
      utm_term: body.utmTerm || null,
      utm_content: body.utmContent || null,
    })
    .select('id')
    .single();

  if (dbError) {
    // Log the error type but NOT PII
    console.error('[submit-lead] Supabase insert error:', dbError.code, dbError.message);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  // PostHog server-side event (non-blocking)
  const distinctId = lead?.id || email;
  captureServerEvent(distinctId, 'lead_submitted', {
    goal: body.goal,
    state: body.state,
    timeline: body.timeline,
    price: body.price,
    utm_source: body.utmSource,
    utm_medium: body.utmMedium,
    utm_campaign: body.utmCampaign,
  }).catch(() => {});

  // Meta CAPI (non-blocking) — hashed user data per Meta requirements
  // META_PIXEL_ID must be all digits (real pixel IDs are numeric); skips when placeholder
  if (/^\d+$/.test(process.env.META_PIXEL_ID || '') && process.env.META_CAPI_ACCESS_TOKEN) {
    const crypto = await import('node:crypto');
    const hash = (val) => crypto.createHash('sha256').update(val.toLowerCase().trim()).digest('hex');
    sendMetaCAPIEvent({
      pixelId: process.env.META_PIXEL_ID,
      accessToken: process.env.META_CAPI_ACCESS_TOKEN,
      eventName: 'Lead',
      eventData: {
        user_data: {
          em: [hash(email)],
          ph: [hash(phone.replace(/\D/g, ''))],
          fn: [hash(firstName)],
          ln: [hash(lastName)],
        },
        custom_data: {
          lead_id: lead?.id,
          state: body.state,
          goal: body.goal,
        },
      },
    }).catch(() => {});
  }

  return NextResponse.json({ success: true, id: lead?.id });
}
