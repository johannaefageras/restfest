// GET ?id=… → {id, createdAt, recipe, image: {status, url}, promotedAs}
//
// A stored recipe, for nytt-recept.html and tools/promote.mjs. Recipes marked hidden aren't shown.
import {db, imageUrl} from '../_shared/db.ts';
import {recipeId, serve, VisitorError} from '../_shared/http.ts';

serve(['GET'], async req => {
  const id = recipeId(new URL(req.url).searchParams.get('id'));
  const {data: row, error} = await db
    .from('generated_recipes')
    .select('id, created_at, recipe, image_status, image_path, promoted_as')
    .eq('id', id)
    .eq('hidden', false)
    .maybeSingle();
  if (error) throw error;
  if (!row) throw new VisitorError(404, 'Receptet finns inte.');
  return {
    id: row.id,
    createdAt: row.created_at,
    recipe: row.recipe,
    image: {status: row.image_status, url: imageUrl(row.image_path)},
    promotedAs: row.promoted_as
  };
});
