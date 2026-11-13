// The Supabase project behind the fridge photo, the new recipes and the accounts (supabase/,
// HANDOFF.md, "Kylfoto och nya recept" and "Konton och receptbok"), e.g.
// 'https://abcdefghijklmnop.supabase.co'. While it's empty the site has no photo button, no
// "Hitta på ett recept" and no accounts, and works as before.
const supabaseUrl = 'https://yatffwoobcsrxcxplecd.supabase.co';

// The project's publishable key (sb_publishable_…, from the dashboard: Project Settings → API keys).
// It is meant to be public: what a visitor may reach is decided by the database's row level
// security, not by this key. Never put a secret key (sb_secret_…) here. While it's empty the site has
// no accounts. SUPABASE_PUBLISHABLE_KEY in the environment replaces it for one build, which the tests use.
const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY ?? '';

export default {
  supabaseUrl,
  publishableKey,
  // Where the Edge Functions answer. The pages get it in <meta name="restfest-ai">.
  functionsUrl: supabaseUrl ? `${supabaseUrl.replace(/\/+$/, '')}/functions/v1` : '',
  // Sign-in, the recipe book and the account pages. The pages get the address and the key in
  // <meta name="restfest-account">.
  accounts: Boolean(supabaseUrl && publishableKey)
};
