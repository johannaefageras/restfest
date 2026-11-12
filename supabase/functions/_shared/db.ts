// The database and storage, with the project's secret key. Supabase gives every function its project's
// address and keys, so nothing needs setting here.
import {createClient} from 'npm:@supabase/supabase-js@2';
import {env} from './http.ts';

// New projects have secret keys (sb_secret_…, in SUPABASE_SECRET_KEYS as {"default": "…"});
// older ones the service_role key.
function secretKey(): string {
  try {
    const keys = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') ?? '{}');
    const key = keys.default ?? Object.values(keys)[0];
    if (typeof key === 'string' && key) return key;
  } catch {
    // Fall back to the legacy key below.
  }
  return env('SUPABASE_SERVICE_ROLE_KEY');
}

export const db = createClient(env('SUPABASE_URL'), secretKey(), {auth: {persistSession: false}});

// The public bucket the photos go in (supabase/migrations/…_ai_recipes.sql).
export const imageBucket = 'recipe-images';

export function imageUrl(path: string | null): string | null {
  return path ? db.storage.from(imageBucket).getPublicUrl(path).data.publicUrl : null;
}
