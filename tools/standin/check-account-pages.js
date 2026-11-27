// Checks the account pages in a browser, against the stand-in backend: the first sign-in's hearts in
// one request, what receptbok.html fetches, the header's count, ?spara=1, the lock between tabs,
// problems tied to their fields, the e-mail step behind its button, and sign-in by text message,
// including a number added on konto.html.
// HANDOFF.md, "Konton och receptbok".
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
  // E-mail and password are a step of their own, behind "Fortsätt med e-post".
  const signIn = async (email) => {
    await page.click('[data-email-open]');
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

  // 12. The e-mail step: its title follows the mode, the switch works there too, and "Glömt
  // lösenordet?" leads back to it.
  await clean();
  await page.goto(`${site}/logga-in.html`);
  await settle();
  const view = () => page.evaluate(() => ({
    title: document.querySelector('[data-auth-title]').textContent,
    email: !document.querySelector('[data-email-part]').hidden,
    name: !document.querySelector('#auth-name').closest('.account-field').hidden,
    focus: document.activeElement.id || document.activeElement.tagName
  }));
  await page.click('[data-email-open]');
  let step = await view();
  check('12 e-post opens its own step, at the address', step.title === 'Logga in med e-post.' && step.email && !step.name && step.focus === 'auth-email', step);
  await page.click('[data-email-part] [data-mode="skapa"]');
  step = await view();
  check('12 "Skapa konto" there stays on the step, with the name field', step.title === 'Skapa konto med e-post.' && step.email && step.name && step.focus === 'auth-name', step);
  await page.click('[data-email-part] [data-mode="logga"]');
  await page.fill('#auth-email', 'a@example.se');
  await page.click('[data-forgot]');
  await page.click('[data-reset-back]');
  step = await view();
  check('12 back from "Glömt lösenordet?" is the e-mail step, at the password', step.title === 'Logga in med e-post.' && step.email && step.focus === 'auth-password', step);
  await page.click('[data-email-back]');
  step = await view();
  check('12 back from the e-mail step is the buttons', step.title === 'Logga in.' && !step.email, step);

  // 8. A problem with a field is tied to that field.
  await clean();
  await page.goto(`${site}/logga-in.html`);
  await settle();
  await page.click('[data-email-open]');
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
  const posts = s.log.filter(entry => entry.method === 'POST' && entry.path.startsWith('/rest/v1/rpc/sync_recipe_book') && entry.body.changes?.some(change => change.kind === 'archive' && change.saved));
  check('4 five hearts reach the account at the first sign-in', s.saved['a@example.se'].length === 5, s.saved['a@example.se']);
  check('4 in one request', posts.length === 1, posts.map(entry => entry.body));

  // 5. Opening the recipe book fetches a combined snapshot rather than separate ids and cards.
  let mark = (await state()).log.length;
  await page.goto(`${site}/receptbok.html`);
  await page.waitForFunction(() => /^Visar/.test(document.querySelector('[data-book-status]')?.textContent ?? ''));
  await settle();
  let log = (await state()).log.slice(mark);
  const reads = name => log.filter(entry => entry.method !== 'OPTIONS' && entry.path.startsWith(name)).map(entry => entry.path);
  check('5 the book page uses the combined snapshot endpoint',
    reads('/rest/v1/rpc/sync_recipe_book').length >= 1 && reads('/rest/v1/saved_recipes').length === 0 && reads('/rest/v1/profiles').length === 0,
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

  // 7. "Spara i receptsamlingen" signed out, then signing in, still saves the recipe.
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
  await page.goto(`${site}/recept/01-rodbetspytt.html`);
  await page.waitForSelector('.recipe-actions [data-save][aria-pressed="true"]');
  await settle();
  await page.click('.recipe-actions [data-save]');
  await settle();
  s = await state();
  check('a heart taken out leaves the account', !s.saved['b@example.se'].includes('01-rodbetspytt'), s.saved['b@example.se']);
  const removal = s.log.filter(entry => entry.method === 'POST' && entry.path.startsWith('/rest/v1/rpc/sync_recipe_book')).flatMap(entry => entry.body.changes ?? []).findLast(change => change.id === '01-rodbetspytt' && !change.saved);
  check('with the id in the queued operation', Boolean(removal?.op), removal);

  // 3. While another tab holds the book's lock, this tab waits its turn; the heart itself doesn't.
  let mark2 = (await state()).log.length;
  await page.evaluate(() => {
    window.releaseBook = null;
    const owner = JSON.parse(localStorage.getItem('restfest-account')).id;
    navigator.locks.request(`restfest-book:${owner}`, () => new Promise(resolve => { window.releaseBook = resolve; }));
  });
  await page.waitForFunction(() => window.releaseBook);
  await page.click('.recipe-actions [data-save]');
  await page.waitForTimeout(800);
  const pressedNow = await page.getAttribute('.recipe-actions [data-save]', 'aria-pressed');
  let sentMeanwhile = (await state()).log.slice(mark2).filter(entry => entry.method === 'POST' && entry.path.startsWith('/rest/v1/rpc/sync_recipe_book') && entry.body.changes?.length);
  check('3 the heart shows at once while another tab is at work', pressedNow === 'true', pressedNow);
  check('3 and nothing is sent until that tab is done', sentMeanwhile.length === 0, sentMeanwhile);
  await page.evaluate(() => { window.releaseBook(); window.dispatchEvent(new Event('focus')); });
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

  // Sign-in by text message. The stand-in keeps each code in its state instead of texting it.
  const signOut = async () => {
    await page.click('[data-sign-out]');
    await page.waitForURL(url => url.pathname === '/' || url.pathname.endsWith('index.html'));
    await settle();
  };
  const problemOf = selector => page.evaluate(selector => {
    const input = document.querySelector(selector);
    const described = (input.getAttribute('aria-describedby') ?? '').split(' ').filter(Boolean).map(id => document.getElementById(id)?.textContent ?? '');
    return { invalid: input.getAttribute('aria-invalid'), described: described.join(' | '), focused: document.activeElement === input };
  }, selector);

  // 9. A new number gets an account, with the name typed under "Skapa konto" (here on the e-mail step
  // first, before the visitor changes their mind).
  await clean();
  await page.goto(`${site}/logga-in.html?lage=skapa`);
  await settle();
  await page.click('[data-email-open]');
  await page.fill('#auth-name', 'Mona Mobil');
  await page.click('[data-email-back]');
  await page.click('[data-phone-open]');
  field = await page.evaluate(() => ({ name: document.querySelector('#auth-phone-name').value, title: document.querySelector('[data-auth-title]').textContent }));
  check('9 the phone form takes the name along', field.name === 'Mona Mobil' && field.title === 'Skapa konto med mobilen.', field);
  await page.fill('#auth-phone', '08-123 456 78');
  await page.click('[data-phone-form] [type="submit"]');
  field = await problemOf('#auth-phone');
  s = await state();
  check('9 a landline number is refused at the field, before anything is sent',
    field.invalid === 'true' && field.described.includes('Skriv ett svenskt mobilnummer') && field.focused && s.sms.length === 0, { field, sms: s.sms });
  await page.fill('#auth-phone', '070-123 45 67');
  await page.click('[data-phone-form] [type="submit"]');
  await page.waitForSelector('[data-code-form]:not([hidden])');
  s = await state();
  const first = s.sms.at(-1);
  check('9 the code goes to the number in the international form', first?.type === 'sms' && first.phone === '+46701234567', s.sms);
  const title = await page.textContent('[data-auth-title]');
  check('9 the page asks for the code', title === 'Kolla din mobil.', title);
  await page.fill('#auth-code', first.code === '000000' ? '111111' : '000000');
  await page.click('[data-code-form] [type="submit"]');
  await page.waitForSelector('[data-code-error]:not([hidden])');
  field = await problemOf('#auth-code');
  check('9 a wrong code is tied to the code field', field.invalid === 'true' && field.described.includes('Koden stämmer inte'), field);
  await page.fill('#auth-code', first.code);
  await page.click('[data-code-form] [type="submit"]');
  await page.waitForURL(url => url.pathname.endsWith('receptbok.html'));
  await settle();
  s = await state();
  check('9 the right code signs in, to a new account with the name', s.profiles['+46701234567']?.display_name === 'Mona Mobil', s.profiles);

  // 10. Konto for an account without an email address.
  await page.goto(`${site}/konto.html`);
  await settle();
  field = await page.evaluate(() => ({
    who: document.querySelector('[data-account-email]').textContent,
    methods: document.querySelector('[data-account-methods]').textContent,
    email: document.querySelector('#account-email-title').textContent,
    password: document.querySelector('[data-password-section]').hidden,
    phone: document.querySelector('[data-phone-title]').textContent
  }));
  check('10 konto shows the number and how the account signs in', field.who === '070-123 45 67' && field.methods === 'Du loggar in med en kod per sms.', field);
  check('10 it offers to add an email address, and no password without one', field.email === 'Lägg till e-postadress' && field.password === true, field);
  check('10 and to change the number', field.phone === 'Byt mobilnummer', field);
  await signOut();

  // 11. An account with an email address adds a number on Konto, then signs in with it.
  await clean();
  await page.goto(`${site}/logga-in.html`);
  await settle();
  await signIn('a@example.se');
  await page.goto(`${site}/konto.html`);
  await settle();
  const before = await page.textContent('[data-phone-title]');
  check('11 konto offers to add a number', before === 'Lägg till mobilnummer', before);
  await page.fill('#account-new-phone', '070-123 45 67');
  await page.click('[data-phone-submit]');
  await page.waitForSelector('[data-phone-error]:not([hidden])');
  field = await problemOf('#account-new-phone');
  check('11 a number on another account is tied to the field', field.invalid === 'true' && field.described.includes('hör redan till ett annat konto'), field);
  await page.fill('#account-new-phone', '+46 73 555 12 34');
  await page.click('[data-phone-submit]');
  await page.waitForSelector('[data-phone-code-field]:not([hidden])');
  s = await state();
  const change = s.sms.at(-1);
  check('11 a code goes to the new number', change?.type === 'phone_change' && change.phone === '+46735551234', s.sms);
  await page.fill('#account-phone-code', change.code);
  await page.click('[data-phone-submit]');
  await page.waitForFunction(() => document.querySelector('[data-phone-status]').textContent.includes('sparat'));
  field = await page.evaluate(() => ({
    methods: document.querySelector('[data-account-methods]').textContent,
    phone: document.querySelector('[data-phone-title]').textContent,
    code: document.querySelector('[data-phone-code-field]').hidden
  }));
  check('11 once the code is typed, the number is a way to sign in',
    field.methods === 'Du loggar in med lösenord eller med en kod per sms.' && field.phone === 'Byt mobilnummer' && field.code === true, field);
  await signOut();
  await clean();
  await page.goto(`${site}/logga-in.html`);
  await settle();
  await page.click('[data-phone-open]');
  await page.fill('#auth-phone', '0735551234');
  await page.click('[data-phone-form] [type="submit"]');
  await page.waitForSelector('[data-code-form]:not([hidden])');
  s = await state();
  await page.fill('#auth-code', s.sms.at(-1).code);
  await page.click('[data-code-form] [type="submit"]');
  await page.waitForURL(url => url.pathname.endsWith('receptbok.html'));
  await settle();
  s = await state();
  const marker = await page.evaluate(() => JSON.parse(localStorage.getItem('restfest-account') ?? 'null'));
  const owners = s.users.filter(user => user.phone === '+46735551234').map(user => user.email);
  check('11 signing in with that number reaches the same account', marker?.name === 'Anna' && owners.length === 1 && owners[0] === 'a@example.se', { marker, owners });
  return results;
}
