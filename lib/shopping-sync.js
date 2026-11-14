import { accountSync, outboxStorage } from './account-sync.js';

// Shopping-list changes are queued individually, scoped to their owner. Sending a stale whole list
// would undo purchases or removals made on another device. These helpers also run in the tests.
export function applyShoppingChanges(items, changes) {
  const result = new Map(items.map(item => [item.id, { ...item }]));
  for (const change of changes) {
    if (change.kind === 'remove') result.delete(change.id);
    else if (change.kind === 'check') {
      const item = result.get(change.id);
      if (item) result.set(change.id, { ...item, checked: change.checked });
    } else if (change.kind === 'edit') {
      const item = result.get(change.id);
      // A delayed edit must never bring back a removed row or reset its recipe/checkmark.
      if (item) for (const key of ['customText', 'note']) {
        if (typeof change.fields?.[key] === 'string') item[key] = change.fields[key];
      }
    } else if (change.kind === 'add' || (change.kind === 'import' && !result.has(change.id))) {
      result.set(change.id, { ...change.item });
    }
  }
  return [...result.values()];
}

export const shoppingStorage = (storage, userId, uuid) => outboxStorage(storage, userId, 'restfest-shopping', uuid);
export const shoppingSync = options => accountSync({ ...options, apply: applyShoppingChanges });
