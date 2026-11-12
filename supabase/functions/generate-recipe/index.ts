// POST {items: [{name, key}]} → {id, recipe}
//
// Claude writes a new dinner recipe from the visitor's fridge list (`key` is the ingredient key the
// home page matched the name to, or null). The recipe is stored, and the visitor goes on to
// nytt-recept.html?id=…, which asks recipe-image for its photo.
import {askClaude, models} from '../_shared/claude.ts';
import {db} from '../_shared/db.ts';
import {checkCap} from '../_shared/limits.ts';
import {readJson, serve, VisitorError} from '../_shared/http.ts';
import {
  cleanName, DraftError, draftSchema, isFoodKey, type PantryItem, recipeDoc, type RecipeDoc, type RecipeDraft,
  recipePrompt, recipeSystem
} from '../_shared/recipe.ts';

serve(['POST'], async req => {
  const body = await readJson(req);
  const items: PantryItem[] = (Array.isArray(body.items) ? body.items : [])
    .slice(0, 60)
    .map(item => {
      const name = cleanName(item?.name);
      return name ? {name, key: isFoodKey(item?.key) ? item.key : null} : null;
    })
    .filter((item): item is PantryItem => item != null);
  if (!items.some(item => item.key)) {
    throw new VisitorError(400, 'Lägg till minst en råvara som känns igen, så har receptet något att utgå från.');
  }
  await checkCap(req, 'recipe');

  // Structured outputs keep the answer to the schema, so a second try is for the rare recipe that
  // still misses a title or steps.
  let recipe: RecipeDoc | null = null;
  for (let attempt = 1; !recipe; attempt++) {
    const draft = await askClaude<RecipeDraft>({
      model: models.recipe(),
      system: recipeSystem,
      content: [{type: 'text', text: recipePrompt(items)}],
      schema: draftSchema,
      maxTokens: 6000
    });
    try {
      recipe = recipeDoc(draft);
    } catch (error) {
      if (!(error instanceof DraftError) || attempt === 2) throw error;
      console.warn(`Retrying: ${error.message}`);
    }
  }

  const {data, error} = await db
    .from('generated_recipes')
    .insert({pantry: items.map(item => item.name), recipe})
    .select('id')
    .single();
  if (error) throw error;
  return {id: data.id, recipe};
});
