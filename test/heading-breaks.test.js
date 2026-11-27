// headingBreaks() in src/js/recipes.js: the visible recipe headings get a soft hyphen (U+00AD) where a
// long Swedish compound meets an English loanword, as Chrome's Swedish hyphenation doesn't know the
// loanwords and breaks "Halloncheesecake" as "Hallonchee-secake". With a soft hyphen in a word, the
// browser breaks that word only there.
import assert from 'node:assert/strict';
import test from 'node:test';
import {taxonomy} from '../lib/taxonomy.js';

const {headingBreaks} = taxonomy();
const shy = '­';

test('a long compound gets a soft hyphen where it meets a loanword, before or after it', () => {
  assert.equal(headingBreaks('Halloncheesecake i rutor'), `Hallon${shy}cheesecake i rutor`);
  assert.equal(headingBreaks('Chokladtiramisu i glas'), `Choklad${shy}tiramisu i glas`);
  assert.equal(headingBreaks('Kladdkakemuffins med hemlig mitt'), `Kladdkake${shy}muffins med hemlig mitt`);
  assert.equal(headingBreaks('Äppeldumplings med vaniljglass'), `Äppel${shy}dumplings med vaniljglass`);
  assert.equal(headingBreaks('Churrosvåfflor med chokladsås'), `Churros${shy}våfflor med chokladsås`);
  assert.equal(headingBreaks('Croissanter med cookiefyllning'), `Croissanter med cookie${shy}fyllning`);
});

test('the case of the heading is kept', () => {
  assert.equal(headingBreaks('HALLONCHEESECAKE'), `HALLON${shy}CHEESECAKE`);
});

test('a loanword on its own, a short compound or a hyphenated word is left alone', () => {
  for (const title of ['Tjocka cookies med brynt smör', 'Glassmackor med brownie', 'Varsin allt-i-ett-cookie', 'Brownieglass', 'Cheesecake', 'Kladdkaka med mörk choklad'])
    assert.equal(headingBreaks(title), title);
});
