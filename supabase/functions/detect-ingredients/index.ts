// POST {images: [base64 JPEG, …]} → {names: [observed Swedish grocery names], keys, other}
//
// Claude looks at one to three photos of an open fridge, freezer or pantry and lists the foods it can
// see, preserving their names rather than substituting the site's broader recipe ingredients.
// The home page adds them to the visitor's fridge list (src/js/fridge-ai.js). The photos aren't stored.
import {askClaude, efforts, models} from '../_shared/claude.ts';
import {detectedFoods, detectionSchema, detectionSystem} from '../_shared/detection.ts';
import {checkCap, unanswered} from '../_shared/limits.ts';
import {readJson, serve, VisitorError} from '../_shared/http.ts';

// The browser keeps label detail at up to 2560 px, reducing size further if needed to fit this cap.
const maxImageLength = 3_000_000;

serve(['POST'], async req => {
  const body = await readJson(req);
  const images = Array.isArray(body.images) ? body.images.filter(image => typeof image === 'string' && image) : [];
  if (!images.length || images.length > 3) throw new VisitorError(400, 'Skicka en till tre bilder.');
  if (images.some(image => image.length > maxImageLength || !/^[A-Za-z0-9+/=]+$/.test(image.slice(0, 200)))) {
    throw new VisitorError(413, 'Bilden är för stor eller går inte att läsa.');
  }
  await checkCap(req, 'detect');

  const answer = await askClaude<{names: string[]}>({
    label: 'detect',
    model: models.detect(),
    effort: efforts.detect(),
    system: detectionSystem,
    content: [
      ...images.flatMap((data, i) => [
        {type: 'text' as const, text: `Bild ${i + 1}:`},
        {type: 'image' as const, source: {type: 'base64' as const, media_type: 'image/jpeg' as const, data}}
      ]),
      {type: 'text', text: 'Inventera alla synliga råvaror i bilderna, även på dörrhyllorna och längre bak. Läs etiketterna där de går att läsa. Kontrollera att varje namn stöds av bilden och att inga tydligt identifierbara råvaror har missats.'}
    ],
    schema: detectionSchema
  }).catch(error => unanswered(req, 'detect', error));

  return detectedFoods(answer);
});
