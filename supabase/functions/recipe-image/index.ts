// POST {id} → {status, url}
//
// Makes a new recipe's photo, once. nytt-recept.html calls this when the recipe has no photo yet. The
// first call claims the recipe (claim_recipe_image in the migration), makes the photo and answers when
// it's stored, usually within a minute; a call while that's going on answers {status: 'generating'},
// and the page asks get-recipe again until the photo is there. A failed photo is tried once more.
import {db, imageBucket, imageUrl} from '../_shared/db.ts';
import {makePhoto} from '../_shared/image.ts';
import {readJson, recipeId, serve, VisitorError} from '../_shared/http.ts';
import type {RecipeDoc} from '../_shared/recipe.ts';

serve(['POST'], async req => {
  const id = recipeId((await readJson(req)).id);

  const {data: recipe, error: claimError} = await db.rpc('claim_recipe_image', {p_id: id});
  if (claimError) throw claimError;
  if (!recipe) {
    const {data: row, error} = await db
      .from('generated_recipes')
      .select('image_status, image_path')
      .eq('id', id)
      .eq('hidden', false)
      .maybeSingle();
    if (error) throw error;
    if (!row) throw new VisitorError(404, 'Receptet finns inte.');
    return {status: row.image_status, url: imageUrl(row.image_path)};
  }

  try {
    const photo = await makePhoto(recipe as RecipeDoc);
    const path = `${id}.jpg`;
    const {error: uploadError} = await db.storage.from(imageBucket).upload(path, photo, {
      contentType: 'image/jpeg',
      cacheControl: '31536000',
      upsert: true
    });
    if (uploadError) throw uploadError;
    const {error} = await db.from('generated_recipes').update({image_status: 'done', image_path: path}).eq('id', id);
    if (error) throw error;
    return {status: 'done', url: imageUrl(path)};
  } catch (error) {
    console.error(error);
    await db.from('generated_recipes')
      .update({image_status: 'failed', image_error: String((error as Error)?.message ?? error).slice(0, 1000)})
      .eq('id', id);
    return {status: 'failed', url: null};
  }
});
