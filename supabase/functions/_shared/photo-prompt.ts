// The prompt for a new recipe's photo, in the pattern the archive's newer photos were made with (136
// Kycklingbuljong, 139 Örtsmör and others): a fixed opening, the scene Claude writes for the recipe (imagePrompt in recipe.ts: the dish,
// what's beside it, "Setting: …" and the light) and a fixed closing. Kept apart from image.ts so that
// recipe.ts can quote the opening and closing to Claude, and the tests can load it without Deno.

export const photoOpening = 'Hyper-realistic food photograph, wide 16:9 landscape format, three-quarter angle.';
export const photoClosing = 'Vivid, saturated colors, luminous almost glowing highlights, shallow depth of field, 85 mm lens at f/2.8, crisp texture detail, editorial cookbook style. No text, no logos, no labels, no people.';

const startsWith = (text: string, part: string) => text.toLowerCase().startsWith(part.toLowerCase());
const endsWith = (text: string, part: string) => text.toLowerCase().endsWith(part.toLowerCase());

// Claude is told not to write the opening and closing; if it does anyway, they aren't repeated.
function sceneOnly(scene: string): string {
  let text = scene.trim();
  if (startsWith(text, photoOpening)) text = text.slice(photoOpening.length).trim();
  if (endsWith(text, photoClosing)) text = text.slice(0, -photoClosing.length).trim();
  return /[.!]$/.test(text) ? text : `${text}.`;
}

// `scene` is the recipe's imagePrompt. With style references, the image model is told to take only their style.
export function photoPrompt(scene: string, withReferences: boolean): string {
  const prompt = `${photoOpening} ${sceneOnly(scene)} ${photoClosing}`;
  return withReferences
    ? `${prompt}\n\nThe reference images show the style only. Make a completely new photograph of this dish: do not reuse their food, their exact props or their layout.`
    : prompt;
}
