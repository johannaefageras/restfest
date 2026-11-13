// Checks the account pages in a browser, against the stand-in backend: the first sign-in's hearts in
// one request, what receptbok.html fetches, the header's count, ?spara=1, the lock between tabs, and
// problems tied to their fields. HANDOFF.md, "Konton och receptbok".
//
// It is a function for the Playwright tool (browser_run_code_unsafe with this file), not a script
// for node. First start the two servers, as tools/standin/server.mjs says at its top:
//   node tools/standin/server.mjs
//   RESTFEST_SUPABASE_URL=http://localhost:54399 RESTFEST_PUBLISHABLE_KEY=sb_publishable_test \
//     npx @11ty/eleventy --serve --port 8765 --output=<a folder outside the project>
// The tool only reads files inside the project. It answers {name: 'ok'} or {name: {FAIL: what it saw}}.
async (page) => {
  const site = 'http://localhost:8765';
  const api = 'http://localhost:54399';
  const control = async body => (await page.request.post(`${api}/__control`, { data: body })).json();
  const state = async () => (await page.request.get(`${api}/__state`)).json();
  const results = {};
  // The local server sends no cache headers, so the browser may hold on to old scripts.
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  const check = (name, ok, detail) => { results[name] = ok ? 'ok' : { FAIL: detail }; };
  const settle = async () => { await page.waitForLoadState('networkidle'); await page.waitForTimeout(400); };
  const hearts = ['01-rodbetspytt', '02-glaserade-morotter', '29-shakshuka', '30-fiskpinnetacos', '31-stekt-ris'];

  const clean = async () => {
    await page.goto(`${site}/integritet.html`);
    await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
  };
  const signIn = async (email) => {
    await page.fill('#auth-email', email);
    await page.fill('#auth-password', 'hemligt123');
    await page.click('[data-auth-submit]');
    await page.waitForURL(url => !url.pathname.endsWith('logga-in.html'));
    await settle();
  };

  await control({
    reset: true,
    users: [{ email: 'a@example.se', password: 'hemligt123', name: 'Anna' }, { email: 'b@example.se', password: 'hemligt123' }],
    generated: { 'a@example.se': ['Synlig', 'Dold'], 'b@example.se': ['Annans'] },
    hide: ['Dold']
  });
  const ids = Object.fromEntries((await state()).generated.map(g => [g.title, g.id]));

  // 8. A problem with a field is tied to that field.
  await clean();
  await page.goto(`${site}/logga-in.html`);
  await settle();
  await page.click('[data-auth-submit]');
  let field = await page.evaluate(() => {
    const input = document.querySelector('#auth-email');
    const described = (input.getAttribute('aria-describedby') ?? '').split(' ').map(id => document.getElementById(id)?.textContent);
    return { invalid: input.getAttribute('aria-invalid'), described, focused: document.activeElement === input };
  });
  check('8 empty email: the field is marked, described by the error and focused',
    field.invalid === 'true' && field.described.includes('Skriv din e-postadress.') && field.focused, field);
  await page.fill('#auth-email', 'a@example.se');
  await page.click('[data-auth-submit]');
  field = await page.evaluate(() => {
    const email = document.querySelector('#auth-email');
    const password = document.querySelector('#auth-password');
    const described = input => (input.getAttribute('aria-describedby') ?? '').split(' ').filter(Boolean).map(id => document.getElementById(id)?.textContent);
    return { email: email.getAttribute('aria-invalid'), emailDescribed: described(email), password: password.getAttribute('aria-invalid'), passwordDescribed: described(password) };
  });
  check('8 then no password: the mark moves to the password field, which keeps its hint',
    field.email == null && field.emailDescribed.length === 0 && field.password === 'true'
      && field.passwordDescribed.includes('Skriv ditt lösenord.') && field.passwordDescribed.includes('Minst 8 tecken.'), field);

  // 4. The first sign-in sends the browser's hearts together.
  await page.evaluate(list => localStorage.setItem('restfest-saved', JSON.stringify(list)), hearts);
  await page.goto(`${site}/logga-in.html`);
  await settle();
  await signIn('a@example.se');
  let s = await state();
  const posts = s.log.filter(entry => entry.method === 'POST' && entry.path.startsWith('/rest/v1/saved_recipes'));
  check('4 five hearts reach the account at the first sign-in', s.saved['a@example.se'].length === 5, s.saved['a@example.se']);
  check('4 in one request', posts.length === 1, posts.map(entry => entry.body));

  // 5. Opening the recipe book fetches the lists once.
  await page.evaluate(() => sessionStorage.removeItem('restfest-book-synced'));
  let mark = (await state()).log.length;
  await page.goto(`${site}/receptbok.html`);
  await page.waitForFunction(() => /^Visar/.test(document.querySelector('[data-book-status]')?.textContent ?? ''));
  await settle();
  let log = (await state()).log.slice(mark);
  const reads = name => log.filter(entry => entry.method !== 'OPTIONS' && entry.path.startsWith(name)).map(entry => entry.path);
  check('5 the book page reads the hearts twice (ids, then the cards) and the profile once',
    reads('/rest/v1/saved_recipes').length === 2 && reads('/rest/v1/profiles').length === 1,
    { saved: reads('/rest/v1/saved_recipes'), profiles: reads('/rest/v1/profiles'), generated: reads('/rest/v1/saved_generated'), rpc: reads('/rest/v1/rpc') });
  const shown = await page.evaluate(() => document.querySelector('[data-book-status]').textContent);
  check('5 the book shows five hearts and the one visible generated recipe', shown === 'Visar 6 recept', shown);

  // 6. The header's count leaves out generated recipes the owner has hidden.
  const count = await page.evaluate(() => document.querySelector('#saved-count').textContent);
  check('6 the header counts 5 hearts + 1 visible generated recipe', count === '6', count);

  // 7. ?spara=1 in a link saves nothing for a visitor who didn't ask.
  await page.goto(`${site}/nytt-recept.html?id=${ids.Annans}&spara=1`);
  await page.waitForSelector('[data-save-generated]');
  await settle();
  s = await state();
  check('7 a link with ?spara=1 saves nothing by itself', !s.savedGenerated['a@example.se'].includes(ids.Annans), s.savedGenerated['a@example.se']);
  check('7 and the address is tidied', !page.url().includes('spara'), page.url());
  const pressed = await page.getAttribute('[data-save-generated]', 'aria-pressed');
  check('7 the heart is still there to click', pressed === 'false', pressed);

  // 7. "Spara i receptboken" signed out, then signing in, still saves the recipe.
  await clean();
  await page.goto(`${site}/nytt-recept.html?id=${ids.Synlig}`);
  await page.waitForSelector('a.dialog-save');
  await page.click('a.dialog-save');
  await page.waitForURL(url => url.pathname.endsWith('logga-in.html'));
  await settle();
  await signIn('b@example.se');
  await page.waitForSelector('[data-save-generated]');
  await settle();
  s = await state();
  check('7 the save link, then signing in, saves the recipe', s.savedGenerated['b@example.se'].includes(ids.Synlig), s.savedGenerated['b@example.se']);
  check('7 and the address is tidied afterwards', page.url().includes(`id=${ids.Synlig}`) && !page.url().includes('spara'), page.url());
  const heart = await page.getAttribute('[data-save-generated]', 'aria-pressed');
  check('7 and the heart shows it', heart === 'true', heart);

  // Hearts one at a time (b is signed in): a removal, then the same heart again.
  await control({ saved: { 'b@example.se': ['01-rodbetspytt'] } });
  await page.evaluate(() => sessionStorage.removeItem('restfest-book-synced'));
  await page.goto(`${site}/recept/01-rodbetspytt.html`);
  await page.waitForSelector('.dialog-save[data-save][aria-pressed="true"]');
  await settle();
  await page.click('.dialog-save[data-save]');
  await settle();
  s = await state();
  check('a heart taken out leaves the account', !s.saved['b@example.se'].includes('01-rodbetspytt'), s.saved['b@example.se']);
  const removal = s.log.filter(entry => entry.method === 'DELETE').at(-1)?.path;
  check('with the id in the request', /recipe_id=in\.(%28|\()01-rodbetspytt/.test(removal ?? ''), removal);

  // 3. While another tab holds the book's lock, this tab waits its turn; the heart itself doesn't.
  let mark2 = (await state()).log.length;
  await page.evaluate(() => {
    window.releaseBook = null;
    navigator.locks.request('restfest-book', () => new Promise(resolve => { window.releaseBook = resolve; }));
  });
  await page.waitForFunction(() => window.releaseBook);
  await page.click('.dialog-save[data-save]');
  await page.waitForTimeout(800);
  const pressedNow = await page.getAttribute('.dialog-save[data-save]', 'aria-pressed');
  let sentMeanwhile = (await state()).log.slice(mark2).filter(entry => entry.method === 'POST' && entry.path.startsWith('/rest/v1/saved_recipes'));
  check('3 the heart shows at once while another tab is at work', pressedNow === 'true', pressedNow);
  check('3 and nothing is sent until that tab is done', sentMeanwhile.length === 0, sentMeanwhile);
  await page.evaluate(() => window.releaseBook());
  await settle();
  s = await state();
  check('3 then it is sent', s.saved['b@example.se'].includes('01-rodbetspytt'), s.saved['b@example.se']);

  // 8. A problem Supabase finds with a field is tied to it too.
  await page.goto(`${site}/konto.html`);
  await page.waitForSelector('#account-new-password', { state: 'visible' });
  await page.fill('#account-new-password', 'hemligt123');
  await page.click('[data-password-change] button[type="submit"]');
  await page.waitForSelector('[data-password-error]:not([hidden])');
  field = await page.evaluate(() => {
    const input = document.querySelector('#account-new-password');
    return {
      invalid: input.getAttribute('aria-invalid'),
      described: (input.getAttribute('aria-describedby') ?? '').split(' ').map(id => document.getElementById(id)?.textContent),
      focused: document.activeElement === input
    };
  });
  check('8 the same password again: the field is marked and described',
    field.invalid === 'true' && field.described.includes('Det nya lösenordet behöver skilja sig från det gamla.') && field.described.includes('Minst 8 tecken.') && field.focused, field);
  await page.fill('#account-new-password', 'ett-nytt-losenord');
  await page.click('[data-password-change] button[type="submit"]');
  await page.waitForFunction(() => document.querySelector('[data-password-status]').textContent === 'Lösenordet är sparat.');
  field = await page.evaluate(() => {
    const input = document.querySelector('#account-new-password');
    return { invalid: input.getAttribute('aria-invalid'), described: input.getAttribute('aria-describedby') };
  });
  check('8 once it is right, the mark is gone and the hint stays', field.invalid == null && field.described === 'account-new-password-hint', field);

  // The profile's food list: the 31st food.
  await page.goto(`${site}/profil.html`);
  await page.waitForSelector('#profile-avoid', { state: 'visible' });
  for (let index = 0; index < 31; index++) {
    await page.fill('#profile-avoid', `mat ${index}`);
    await page.press('#profile-avoid', 'Enter');
  }
  field = await page.evaluate(() => {
    const input = document.querySelector('#profile-avoid');
    return { invalid: input.getAttribute('aria-invalid'), described: (input.getAttribute('aria-describedby') ?? '').split(' ').map(id => document.getElementById(id)?.textContent.slice(0, 24)) };
  });
  check('8 the 31st food: the field is marked and described', field.invalid === 'true' && field.described.includes('Listan rymmer 30 råvaror'), field);
  await page.click('[data-avoid-remove="0"]');
  field = await page.evaluate(() => document.querySelector('#profile-avoid').getAttribute('aria-invalid'));
  check('8 and unmarked when a food is taken out', field == null, field);

  // Signing out with the page open elsewhere leaves no hearts behind.
  await page.click('[data-sign-out]');
  await page.waitForURL(url => url.pathname === '/' || url.pathname.endsWith('index.html'));
  await settle();
  const after = await page.evaluate(() => ({ saved: localStorage.getItem('restfest-saved'), marker: localStorage.getItem('restfest-account'), count: document.querySelector('#saved-count').textContent }));
  check('signed out: no hearts or marker left in the browser', after.saved === '[]' && after.marker == null && after.count === '0', after);
  return results;
}
