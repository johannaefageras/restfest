// The recipe's photo, from OpenAI's image API (https://developers.openai.com/api/docs/guides/image-generation).
// The prompt is in photo-prompt.ts. With style references (the default) it uses the edits endpoint, which
// takes reference images: two archive photos from supabase/style/, so the new photo gets the archive's
// light, props and colours.
import {env} from './http.ts';
import {photoPrompt} from './photo-prompt.ts';
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

// Returns the photo as JPEG bytes.
export async function makePhoto(recipe: RecipeDoc): Promise<Uint8Array> {
  const {model, size, quality, references} = settings();
  const response = await fetch(`https://api.openai.com/v1/images/${references ? 'edits' : 'generations'}`, {
    method: 'POST',
    headers: {Authorization: `Bearer ${env('OPENAI_API_KEY')}`, 'Content-Type': 'application/json'},
    body: JSON.stringify({
      model,
      prompt: photoPrompt(recipe.imagePrompt, references),
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
