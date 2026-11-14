import { generatedBookRow, recipeBookStorage, recipeBookSync } from './recipe-book-sync.js';

// The same durable outbox engine as the shopping list. Each account keeps its own snapshot, pending
// hearts and viewed generated recipes; guest favorites are imported once on sign-in.
export function createRecipeBookAccount({ client, currentUser, show }) {
  const ownerKey = 'restfest-book-owner';
  const guestKey = 'restfest-book-guest';
  const stores = new Map();
  const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
  const write = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} };
  let owner, sync, timer;
  let retry = 0;
  let issue = null;
  let state = { phase: 'loading', pending: 0, durable: true };
  const active = id => owner === id && currentUser() === id;
  const storeFor = id => {
    if (!stores.has(id)) stores.set(id, recipeBookStorage(localStorage, id));
    return stores.get(id);
  };
  const publish = snapshot => { show(snapshot); document.dispatchEvent(new Event('restfest:book')); };
  function status(next) {
    state = { ...next, issue, pendingGenerated: sync?.items().pendingGenerated ?? 0 };
    document.dispatchEvent(new Event('restfest:book-sync'));
  }
  function schedule(delay = 200) {
    clearTimeout(timer);
    if (owner && !document.hidden && navigator.onLine) timer = setTimeout(refresh, delay);
  }
  async function refresh() {
    clearTimeout(timer);
    const id = owner, current = sync;
    if (!id || !active(id)) return false;
    if (!navigator.onLine) { status({ ...state, phase: 'waiting' }); return false; }
    const ok = await current.refresh();
    if (!active(id) || sync !== current) return false;
    retry = ok ? 0 : Math.min(retry + 1, 5);
    schedule(ok ? 15000 : [2000, 5000, 15000, 30000, 60000][retry - 1]);
    return ok;
  }
  function activate(id) {
    id ||= null;
    if (owner === id) return;
    clearTimeout(timer);
    const previous = read(ownerKey, null);
    const leavingAccount = Boolean(owner);
    if (!previous) write(guestKey, [...(readSavedRecipes() ?? new Set())]);
    owner = id;
    issue = null;
    retry = 0;
    if (!id) {
      sync = null;
      write(ownerKey, 'guest');
      if (leavingAccount || (previous && previous !== 'guest')) publish({ archive: read(guestKey, []).map(recipe_id => ({ recipe_id })), generated: [], fetched: false });
      return;
    }
    const storage = storeFor(id);
    // Migrate the previous queue once, including changes stashed for a different account. A stash
    // is put in that owner's outbox, never in whichever account happens to be open now.
    const oldQueue = read('restfest-saved-queue', []);
    if (oldQueue.length) {
      const legacy = previous && previous !== 'guest' ? storeFor(previous) : storage;
      legacy.append(oldQueue);
      if (legacy.durable()) localStorage.removeItem('restfest-saved-queue');
    }
    const stash = read('restfest-saved-stash', null);
    if (stash?.user && Array.isArray(stash.queue)) {
      const ownerStorage = storeFor(stash.user);
      ownerStorage.append(stash.queue);
      if (ownerStorage.durable()) localStorage.removeItem('restfest-saved-stash');
    }
    sync = recipeBookSync({
      storage, active: () => active(id), status,
      show: publish,
      lock: task => navigator.locks
        ? navigator.locks.request(`restfest-book:${id}`, { ifAvailable: true }, lock => lock ? task() : false)
        : task(),
      async remote(changes) {
        const { data, error } = await (await client()).auth.getSession();
        const session = data?.session;
        if (error || session?.user.id !== id || !active(id)) throw new Error('Book session changed');
        const meta = document.querySelector('meta[name="restfest-account"]');
        const response = await fetch(`${meta.content}/rest/v1/rpc/sync_recipe_book`, {
          method: 'POST',
          headers: { apikey: meta.dataset.key, Authorization: `Bearer ${session.access_token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ changes }), signal: AbortSignal.timeout(12000),
        });
        if (!response.ok) throw new Error('Recipe book unavailable');
        const book = await response.json();
        if (!Array.isArray(book.archive) || !Array.isArray(book.generated)) throw new Error('Invalid recipe book');
        if (active(id)) issue = book.rejected?.[0]?.reason ?? null;
        return { ...book, fetched: true };
      },
    });
    if (!previous || previous === 'guest') {
      const guests = previous === 'guest' ? [...(readSavedRecipes() ?? new Set())] : read(guestKey, []);
      sync.change(guests.map(id => ({ kind: 'archive', id, saved: true, import: true })));
      write(guestKey, []);
      // The old generated-id cache belongs to the existing sign-in, not to a later guest session.
      if (!previous) sync.change(read('restfest-saved-generated', []).map(id => ({ kind: 'generated', id, saved: true, import: true })));
    }
    write(ownerKey, id);
    publish(sync.items());
    status({ phase: 'loading', pending: storage.pending().length, durable: storage.durable() });
    schedule(0);
    if ('serviceWorker' in navigator) navigator.serviceWorker.register(assetUrl('shopping-worker.js')).catch(() => {});
  }
  function change(change) {
    activate(currentUser());
    if (!owner) return;
    issue = null;
    if (change.kind === 'generated' && change.saved && !change.row) {
      const data = read(`restfest-book:${owner}:recipe:${change.id}`, null);
      if (data?.recipe) change = { ...change, row: generatedBookRow(data) };
    }
    publish(sync.change([change]));
    schedule();
  }
  function rememberRecipe(data, id = owner) {
    if (id && data?.recipe) write(`restfest-book:${id}:recipe:${data.id}`, data);
  }
  function noteGenerated(data) {
    const id = data.saveFor;
    if (!id) return;
    const recipe = { ...data, image: data.image ?? { status: 'pending', url: null } };
    rememberRecipe(recipe, id);
    const change = { kind: 'generated', id: data.id, saved: true, import: true, row: generatedBookRow(recipe) };
    // Even if the user switched accounts during generation, retain the save for the original owner.
    if (!active(id)) { storeFor(id).append([change]); return; }
    publish(sync.change([change]));
    schedule();
  }
  window.addEventListener('online', () => { schedule(0); });
  window.addEventListener('offline', () => { if (owner) status({ ...state, phase: 'waiting' }); });
  window.addEventListener('focus', () => { schedule(0); });
  window.addEventListener('pageshow', () => { schedule(0); });
  document.addEventListener('visibilitychange', () => document.hidden ? clearTimeout(timer) : schedule(0));
  window.addEventListener('storage', event => {
    if (owner && (event.key === null || event.key?.startsWith(`restfest-book:${owner}:`))) {
      publish(sync.items());
      if (event.key?.includes(':change:') && event.newValue !== null) schedule(500);
    }
  });
  return {
    activate, refresh, change, noteGenerated, rememberRecipe,
    snapshot: () => owner && active(owner) ? sync.items() : { archive: [], generated: [], fetched: false },
    status: () => state,
    cachedRecipe: id => owner && active(owner) ? read(`restfest-book:${owner}:recipe:${id}`, null) : null,
    discard() {
      clearTimeout(timer);
      const prefix = `restfest-book:${owner}:`, keys = [];
      for (let i = 0; i < localStorage.length; i++) { const key = localStorage.key(i); if (key?.startsWith(prefix)) keys.push(key); }
      keys.forEach(key => localStorage.removeItem(key));
      stores.delete(owner); owner = null; sync = null;
      write(ownerKey, 'guest');
      publish({ archive: read(guestKey, []).map(recipe_id => ({ recipe_id })), generated: [], fetched: false });
    },
  };
}
