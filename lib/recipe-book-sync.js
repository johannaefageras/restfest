import { accountSync, outboxStorage } from './account-sync.js';

export function applyBookChanges(snapshot, changes) {
  const book = snapshot && !Array.isArray(snapshot) ? snapshot : {};
  const archive = new Map((book.archive ?? []).map(row => [row.recipe_id, row]));
  const generated = new Map((book.generated ?? []).map(row => [row.id, row]));
  for (const change of changes) {
    const list = change.kind === 'generated' ? generated : archive;
    if (!change.saved) list.delete(change.id);
    else if (!list.has(change.id)) {
      const at = new Date(change.order ?? Date.now()).toISOString();
      list.set(change.id, change.kind === 'generated'
        ? { id: change.id, title: 'Recept', ...change.row, saved_at: at }
        : { recipe_id: change.id, created_at: at });
    }
  }
  return { ...book, archive: [...archive.values()], generated: [...generated.values()], fetched: Boolean(book.fetched) };
}

export const recipeBookStorage = (storage, userId, uuid) => outboxStorage(storage, userId, 'restfest-book', uuid);
export const recipeBookSync = options => accountSync({ ...options, apply: applyBookChanges });

// The fields used by recipe-book.js, available immediately after generation or a recipe page loads.
export function generatedBookRow(data) {
  const recipe = data.recipe;
  return {
    id: data.id, title: recipe.title, description: recipe.description, time_label: recipe.timeLabel,
    categories: recipe.categories ?? [], tags: recipe.tags ?? [],
    image_status: data.image?.status ?? 'pending', image_path: null,
    image_url: data.image?.url ?? null,
  };
}
