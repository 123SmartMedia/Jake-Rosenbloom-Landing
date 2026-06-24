import { createClient } from '@supabase/supabase-js';

// Browser-safe client (anon key). Lazy — only created when called.
let _browserClient = null;
export function getSupabaseClient() {
  if (!_browserClient) {
    _browserClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  }
  return _browserClient;
}

// Server-only admin client (service role). NEVER import this in Client Components.
export function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
