// Each pending operation has its own key: two tabs adding at the same time cannot overwrite a
// shared queue. Failed writes stay in memory, with `durable()` telling the UI they are not on disk.
export function outboxStorage(storage, userId, namespace, uuid = () => crypto.randomUUID()) {
  const prefix = `${namespace}:${userId}:`;
  const memory = new Map();
  function read(key, fallback) {
    if (memory.has(key)) return memory.get(key);
    try { return JSON.parse(storage.getItem(key)) ?? fallback; } catch { return fallback; }
  }
  function write(key, value) {
    try { storage.setItem(key, JSON.stringify(value)); memory.delete(key); }
    catch { memory.set(key, value); }
  }
  function pending() {
    const keys = new Set(memory.keys());
    try { for (let i = 0; i < storage.length; i++) keys.add(storage.key(i)); } catch {}
    return [...keys].filter(key => key?.startsWith(prefix + 'change:'))
      .map(key => read(key, null)).filter(Boolean)
      .sort((a, b) => a.order - b.order || a.op.localeCompare(b.op));
  }
  return {
    items: () => read(prefix + 'items', []),
    save: items => write(prefix + 'items', items),
    pending,
    append(changes) {
      let order = Math.max(Date.now(), ...pending().map(change => change.order));
      for (const change of changes) {
        const entry = { ...change, op: uuid(), order: ++order };
        write(prefix + 'change:' + entry.op, entry);
      }
    },
    acknowledge(changes) {
      for (const change of changes) {
        const key = prefix + 'change:' + change.op;
        try { storage.removeItem(key); memory.delete(key); }
        catch { memory.set(key, null); }
      }
    },
    durable: () => memory.size === 0,
  };
}

export function accountSync({ storage, remote, show, apply, active = () => true, lock = task => task(), status = () => {} }) {
  let flight;
  const items = () => apply(storage.items(), storage.pending());
  const report = phase => { if (active()) status({ phase, pending: storage.pending().length, durable: storage.durable() }); };
  async function run() {
    if (!active()) return false;
    report('syncing');
    try {
      do {
        const batch = storage.pending().slice(0, 100);
        const rows = await remote(batch);
        // The user may have signed out, or another account may now be open in this browser.
        if (!active()) return false;
        // Save the server snapshot before acknowledging: replay after a closed tab is harmless
        // because the server remembers operation ids. Acknowledging first could lose a change.
        storage.save(rows);
        storage.acknowledge(batch);
        show(items());
      } while (storage.pending().length && active());
      report('saved');
      return true;
    } catch {
      report('waiting');
      return false;
    }
  }
  return {
    items,
    change(changes) {
      storage.append(changes);
      report('pending');
      return items();
    },
    refresh() {
      flight ??= Promise.resolve().then(() => lock(run)).catch(() => false).finally(() => { flight = null; });
      return flight;
    },
  };
}
