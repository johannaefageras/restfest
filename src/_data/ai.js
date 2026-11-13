// The Supabase project behind the fridge photo, the new recipes and the accounts (supabase/,
// HANDOFF.md, "Kylfoto och nya recept" and "Konton och receptbok"), e.g.
// 'https://abcdefghijklmnop.supabase.co'. While it's empty the site has no photo button, no
// "Hitta på ett recept" and no accounts, and works as before.
const supabaseUrl = process.env.RESTFEST_SUPABASE_URL ?? 'https://yatffwoobcsrxcxplecd.supabase.co';

// The project's publishable key (sb_publishable_…, from the dashboard: Project Settings → API keys).
// It is meant to be public: what a visitor may reach is decided by the database's row level
// security, not by this key. Never put a secret key (sb_secret_…) here. While it's empty the site has
// no accounts. RESTFEST_PUBLISHABLE_KEY in the environment replaces it for one build, which the tests
// use; RESTFEST_SUPABASE_URL does the same for the address, to try the site against a stand-in backend
// (tools/standin/server.mjs). The names are the project's own, so a host that sets SUPABASE_URL for
// its own purposes can't repoint the site by accident.
const publishableKey = process.env.RESTFEST_PUBLISHABLE_KEY ?? 'sb_publishable_OIRfXMGxAMwY2TSn72TJ2w_9KpVs5uU';

export default {
  supabaseUrl,
  publishableKey,
  // Where the Edge Functions answer. The pages get it in <meta name="restfest-ai">.
  functionsUrl: supabaseUrl ? `${supabaseUrl.replace(/\/+$/, '')}/functions/v1` : '',
  // Sign-in, the recipe book and the account pages. The pages get the address and the key in
  // <meta name="restfest-account">.
  accounts: Boolean(supabaseUrl && publishableKey)
};
