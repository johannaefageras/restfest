// Account-scoped local copies and an outbox. account.js calls activate whenever sign-in changes;
// app.js records each user action synchronously before saving its browser copy.
import { applyShoppingChanges, shoppingStorage, shoppingSync } from './shopping-sync.js';

export function createShoppingAccount({ client, currentUser }) {
  const ownerKey = 'restfest-shopping-owner';
  const guestKey = 'restfest-shopping-guest';
  const copies = new Map();
  let owner;
  let sync;
  let timer;
  let retry = 0;
  let state = { phase: 'loading', pending: 0, durable: true };
  const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
  const write = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} };
  const active = id => owner === id && currentUser() === id;
  function status(next) {
    state = next;
    document.dispatchEvent(new Event('restfest:shopping-sync'));
  }
  function schedule(delay = 200) {
    clearTimeout(timer);
    if (!owner || document.hidden || !navigator.onLine) return;
    timer = setTimeout(refresh, delay);
  }
  async function refresh() {
    clearTimeout(timer);
    const id = owner;
    const current = sync;
    if (!id || !active(id)) return false;
    if (!navigator.onLine) {
      status({ ...state, phase: 'waiting' });
      return false;
    }
    const ok = await current.refresh();
    if (!active(id) || sync !== current) return false;
    retry = ok ? 0 : Math.min(retry + 1, 5);
    // Open, visible pages pick up changes from another device. Failed attempts back off to a minute.
    schedule(ok ? 15000 : [2000, 5000, 15000, 30000, 60000][retry - 1]);
    return ok;
  }
  function activate(id) {
    id ||= null;
    if (owner === id) return;
    clearTimeout(timer);
    const previous = read(ownerKey, null);
    // One-time adoption of lists made before account syncing existed.
    if (!previous) write(guestKey, [...(readShoppingItems() ?? new Map()).values()]);
    owner = id;
    retry = 0;
    if (!id) {
      sync = null;
      // A signed-out browser's current list is authoritative; leaving an account restores its
      // separate guest list, never the preceding account's private list.
      const items = previous === 'guest' ? [...(readShoppingItems() ?? new Map()).values()] : read(guestKey, []);
      write(ownerKey, 'guest');
      setShoppingItems(items);
      return;
    }
    let storage = copies.get(id);
    if (!storage) { storage = shoppingStorage(localStorage, id); copies.set(id, storage); }
    sync = shoppingSync({
      storage,
      active: () => active(id),
      status,
      show: setShoppingItems,
      lock: task => navigator.locks
        ? navigator.locks.request(`restfest-shopping:${id}`, { ifAvailable: true }, lock => lock ? task() : false)
        : task(),
      async remote(changes) {
        const { data, error } = await (await client()).auth.getSession();
        const session = data?.session;
        if (error || session?.user.id !== id || !active(id)) throw new Error('Shopping session changed');
        const meta = document.querySelector('meta[name="restfest-account"]');
        // Bind the request to this exact session. A sign-in in another tab cannot redirect an
        // in-flight operation to that other account by replacing the client's default token.
        const response = await fetch(`${meta.content}/rest/v1/rpc/sync_shopping_list`, {
          method: 'POST',
          headers: { apikey: meta.dataset.key, Authorization: `Bearer ${session.access_token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ changes }),
          signal: AbortSignal.timeout(12000),
        });
        if (!response.ok) throw new Error('Shopping sync unavailable');
        const items = await response.json();
        if (!Array.isArray(items)) throw new Error('Invalid shopping list');
        return items;
      },
    });
    // Only guest items are imported. Cached account snapshots are never re-imported on page loads,
    // which would resurrect items removed on another device. Import also preserves remote checks.
    if (!previous || previous === 'guest') {
      const guest = read(guestKey, []);
      sync.change(guest.map(item => ({ kind: 'import', id: item.id, item })));
      write(guestKey, []);
    }
    write(ownerKey, id);
    setShoppingItems(sync.items());
    status({ phase: 'loading', pending: storage.pending().length, durable: storage.durable() });
    schedule(0);
  }
  window.addEventListener('online', () => { schedule(0); });
  window.addEventListener('offline', () => { if (owner) status({ ...state, phase: 'waiting' }); });
  window.addEventListener('pageshow', () => { schedule(0); });
  window.addEventListener('focus', () => { schedule(0); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearTimeout(timer);
    else schedule(0);
  });
  window.addEventListener('storage', event => {
    if (owner && (event.key === null || event.key?.startsWith(`restfest-shopping:${owner}:`))) {
      setShoppingItems(sync.items());
      if (event.key?.includes(':change:') && event.newValue !== null) schedule(500);
    }
  });
  return {
    activate,
    refresh,
    // Called only after delete-account succeeds. Ordinary sign-out retains this owner's outbox.
    discard() {
      clearTimeout(timer);
      const prefix = `restfest-shopping:${owner}:`;
      const keys = [];
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith(prefix)) keys.push(key);
        }
        keys.forEach(key => localStorage.removeItem(key));
      } catch {}
      copies.delete(owner);
      owner = null;
      sync = null;
      write(ownerKey, 'guest');
      setShoppingItems(read(guestKey, []));
    },
    status: () => state,
    change(changes) {
      // The marker changes first when someone signs in or out in another tab.
      activate(currentUser());
      if (owner) {
        const items = sync.change(changes);
        schedule();
        return items;
      }
      const items = applyShoppingChanges([...(readShoppingItems() ?? new Map()).values()], changes);
      write(guestKey, items);
      return items;
    },
  };
}
