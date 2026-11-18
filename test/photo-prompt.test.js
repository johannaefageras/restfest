import assert from 'node:assert/strict';
import test from 'node:test';
import { photoClosing, photoOpening, photoPrompt } from '../supabase/functions/_shared/photo-prompt.ts';
import { recipeDoc, recipeSystem } from '../supabase/functions/_shared/recipe.ts';
import { data } from '../supabase/functions/_shared/data.ts';

const scene = 'A black cast-iron pan of shakshuka, the yolks glowing orange. Setting: a cozy Scandinavian kitchen table of dark wood with a pink linen napkin. Warm golden side light with a strong backlight so the sauce glows.';

test('the photo prompt opens and closes like the archive photos\' prompts', () => {
  assert.equal(photoOpening, 'Hyper-realistic food photograph, wide 16:9 landscape format, three-quarter angle.');
  assert.equal(photoClosing, 'Vivid, saturated colors, luminous almost glowing highlights, shallow depth of field, 85 mm lens at f/2.8, crisp texture detail, editorial cookbook style. No text, no logos, no labels, no people.');
  assert.equal(photoPrompt(scene, false), `${photoOpening} ${scene} ${photoClosing}`);
});

test('with style references, the note about them comes after the prompt', () => {
  const prompt = photoPrompt(scene, true);
  assert.ok(prompt.startsWith(`${photoOpening} ${scene} ${photoClosing}\n\n`));
  assert.match(prompt, /reference images show the style only/);
});

test('an opening or closing Claude wrote anyway is not repeated, and the scene ends a sentence', () => {
  assert.equal(photoPrompt(`${photoOpening} ${scene} ${photoClosing}`, false), photoPrompt(scene, false));
  assert.equal(photoPrompt('A bowl of soup, steam rising', false), `${photoOpening} A bowl of soup, steam rising. ${photoClosing}`);
});

test('Claude is told the pattern, and the examples follow it', () => {
  assert.ok(recipeSystem.includes(photoOpening) && recipeSystem.includes(photoClosing));
  assert.match(recipeSystem, /"Setting: "/);
  assert.match(recipeSystem, /backlight/);
  for (const example of data.examples) {
    const words = example.imagePrompt.split(/\s+/).length;
    assert.ok(words >= 90 && words <= 160, `${example.title}: ${words} words`);
    assert.ok(!example.imagePrompt.includes('Hyper-realistic') && !example.imagePrompt.includes('No text'), example.title);
    assert.match(example.imagePrompt, /\. (Beside|In front|Behind)\b/, example.title);
    assert.match(example.imagePrompt, /\. Setting: /, example.title);
    assert.match(example.imagePrompt, /backlight/, example.title);
  }
});

test('recipeDoc keeps a full-length scene', () => {
  const long = `${'A golden, glossy, glistening dish. '.repeat(40)}`.trim();
  const doc = recipeDoc({
    title: 'Gratäng', description: 'Av resterna.',
    ingredientGroups: [{title: '', items: [{name: '1 kg potatis', key: 'potatis', basic: false}]}],
    steps: ['Skiva potatisen.'], imagePrompt: long
  });
  assert.equal(doc.imagePrompt, long);
});
