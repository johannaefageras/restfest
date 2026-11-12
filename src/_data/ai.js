// The Supabase project behind the fridge photo and the new recipes (supabase/, HANDOFF.md,
// "Kylfoto och nya recept"), e.g. 'https://abcdefghijklmnop.supabase.co'. While it's empty the
// site has no photo button and no "Hitta på ett recept", and works as before.
const supabaseUrl = 'https://yatffwoobcsrxcxplecd.supabase.co';

export default {
  supabaseUrl,
  // Where the Edge Functions answer. The pages get it in <meta name="restfest-ai">.
  functionsUrl: supabaseUrl ? `${supabaseUrl.replace(/\/+$/, '')}/functions/v1` : ''
};
