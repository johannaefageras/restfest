// POST {items: [{name, key}]} → {id, recipe, saved}
//
// Claude writes a new dinner recipe from the visitor's fridge list (`key` is the ingredient key the
// home page matched the name to, or null). The recipe is stored, and the visitor goes on to
// nytt-recept.html?id=…, which asks recipe-image for its photo.
//
// Signing in is optional. For a signed-in visitor (an access token in the Authorization header) Claude
// follows the preferences in their profile, and the recipe goes into their recipe book: `saved` says
// whether it did. Anyone else gets the recipe as before, with `saved` false.
import {userFor} from '../_shared/auth.ts';
import {askClaude, models} from '../_shared/claude.ts';
import {db} from '../_shared/db.ts';
import {checkCap} from '../_shared/limits.ts';
import {readJson, serve, VisitorError} from '../_shared/http.ts';
import {cleanPreferences, preferencesPrompt} from '../_shared/preferences.ts';
import {
  cleanName, DraftError, draftSchema, isFoodKey, type PantryItem, recipeDoc, type RecipeDoc, type RecipeDraft,
  recipePrompt, recipeSystem, UnsuitableError
} from '../_shared/recipe.ts';

// The caller's preferences as lines for Claude, or '' when they have none or can't be read: a recipe
// without them is better than no recipe.
async function preferencesFor(userId: string): Promise<string> {
  const {data, error} = await db.from('profiles').select('diets, avoid, servings').eq('id', userId).maybeSingle();
  if (error) console.warn('Could not read the preferences:', error.message);
  return preferencesPrompt(cleanPreferences(data));
}

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
  // The cap first: once the day's recipes are used up, the sign-in and the profile aren't looked up.
  await checkCap(req, 'recipe');
  const user = await userFor(req);
  const preferences = user ? await preferencesFor(user.id) : '';

  // Structured outputs keep the answer to the schema, so a second try is for the rare recipe that
  // still misses a title or steps.
  let recipe: RecipeDoc | null = null;
  for (let attempt = 1; !recipe; attempt++) {
    const draft = await askClaude<RecipeDraft>({
      model: models.recipe(),
      system: recipeSystem,
      content: [{type: 'text', text: recipePrompt(items, preferences)}],
      schema: draftSchema,
      maxTokens: 6000
    });
    try {
      // Only preferences can make a fridge list unsuitable. Without them the flag is a slip.
      if (!preferences) draft.unsuitable = false;
      recipe = recipeDoc(draft);
    } catch (error) {
      // Nothing on the list fits the preferences. The request has still used one of today's recipes.
      if (error instanceof UnsuitableError) {
        throw new VisitorError(422, 'Det som finns i kyllistan passar inte dina preferenser. Lägg till fler råvaror, eller ändra preferenserna på din profil.');
      }
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

  // Into the caller's recipe book, in this request: the page moves on as soon as the answer arrives.
  let saved = false;
  if (user) {
    const {error: bookError} = await db.from('saved_generated_recipes').insert({user_id: user.id, recipe_id: data.id});
    if (bookError) console.error('Could not add the recipe to the book:', bookError.message);
    saved = !bookError;
  }
  return {id: data.id, recipe, saved};
});
