// The recipe's photo, from OpenAI's image API (https://developers.openai.com/api/docs/guides/image-generation).
// With style references (the default) it uses the edits endpoint, which takes reference images: two
// archive photos from supabase/style/, so the new photo gets the archive's light, props and colours.
import {env} from './http.ts';
import type {RecipeDoc} from './recipe.ts';
import {styleReferences} from './style-references.ts';

// All can be changed with secrets, without deploying again. 1536x864 is 16:9 like the archive photos.
const settings = () => ({
  model: Deno.env.get('IMAGE_MODEL') || 'gpt-image-2.5-flare',
  size: Deno.env.get('IMAGE_SIZE') || '1536x864',
  quality: Deno.env.get('IMAGE_QUALITY') || 'medium',
  // IMAGE_STYLE_REFERENCES=off draws from the text alone, if the photos start copying the references.
  references: Deno.env.get('IMAGE_STYLE_REFERENCES') !== 'off' && styleReferences.length > 0
});

export function imagePrompt(recipe: RecipeDoc, withReferences: boolean): string {
  return [
    'An appetising editorial food photograph for a Swedish home-cooking website. Landscape, 16:9.',
    `The dish: ${recipe.imagePrompt}`,
    'Style: warm, low golden-hour side light; a dark, rustic wooden table; cast iron, speckled handmade stoneware or a wooden board; a linen napkin in a muted warm colour; a few of the raw ingredients and fresh herbs placed around the dish; soft out-of-focus background with a candle or a window; seen from the front and slightly above; shallow depth of field; rich, saturated colours.',
    withReferences
      ? 'The reference images show the style only. Make a completely new photograph of this dish: do not reuse their food, their exact props or their layout.'
      : '',
    'No people, no hands, no text, no logos, no branded packaging.'
  ].filter(Boolean).join('\n\n');
}

// Returns the photo as JPEG bytes.
export async function makePhoto(recipe: RecipeDoc): Promise<Uint8Array> {
  const {model, size, quality, references} = settings();
  const response = await fetch(`https://api.openai.com/v1/images/${references ? 'edits' : 'generations'}`, {
    method: 'POST',
    headers: {Authorization: `Bearer ${env('OPENAI_API_KEY')}`, 'Content-Type': 'application/json'},
    body: JSON.stringify({
      model,
      prompt: imagePrompt(recipe, references),
      size,
      quality,
      output_format: 'jpeg',
      output_compression: 85,
      n: 1,
      ...(references && {images: styleReferences.map(image_url => ({image_url}))})
    })
  });
  if (!response.ok) throw new Error(`OpenAI answered ${response.status}: ${(await response.text()).slice(0, 500)}`);
  const result = await response.json();
  const base64 = result.data?.[0]?.b64_json;
  if (typeof base64 !== 'string') throw new Error('OpenAI sent no image.');
  return Uint8Array.from(atob(base64), char => char.charCodeAt(0));
}
