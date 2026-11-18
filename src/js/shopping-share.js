import { createShoppingCopy } from './shopping-copy.js';
import { createShoppingCopyLink } from './shopping-copy-links.js';

let dialog;
let generation = 0;

export function openShoppingShare({ items, base }) {
  if (!dialog) {
    dialog = document.createElement('dialog');
    dialog.className = 'shopping-share-dialog';
    dialog.setAttribute('aria-labelledby', 'shopping-share-title');
    dialog.innerHTML = `
      <div class="dialog-main">
        <button class="dialog-close" type="button" aria-label="Stäng delningen"><i class="fas fa-xmark" aria-hidden="true"></i></button>
        <header class="shopping-share-heading">
          <img data-share-art alt="" width="64" height="64">
          <div>
            <h2 id="shopping-share-title" class="auth-title"><span class="marker">Dela inköpslistan.</span></h2>
            <p class="dialog-intro">Skicka en kopia till någon som handlar åt dig.</p>
          </div>
        </header>
        <form data-share-form>
          <label class="shopping-field"><span>Namn på listan</span><input name="title" type="text" maxlength="80" required value="Inköpslista" autocomplete="off"></label>
          <section class="shopping-share-summary" aria-labelledby="shopping-share-preview-title">
            <h3 id="shopping-share-preview-title" class="shopping-section-title">Att köpa <span class="count" data-share-count></span></h3>
            <ul data-share-preview></ul><p class="meta" data-share-more hidden></p>
          </section>
          <div class="shopping-share-footer">
            <p class="shopping-share-note">Kopian sparas för delning och öppnas utan konto. Avbockningar i kopian ändrar inte din lista.</p>
            <button class="button primary" type="submit">Skapa länk <i class="fas fa-arrow-up-right" aria-hidden="true"></i></button>
          </div>
        </form>
        <div class="shopping-share-result" data-share-result hidden>
          <div class="shopping-share-ready">
            <img data-share-ready-art alt="" width="30" height="30">
            <div><h3 class="shopping-section-title" data-share-result-title></h3><p class="meta" data-share-result-count></p></div>
          </div>
          <label class="shopping-field"><span>Din delningslänk</span><input type="url" readonly data-share-link aria-describedby="shopping-share-link-hint"></label>
          <p class="meta" id="shopping-share-link-hint">Alla som har länken kan öppna kopian.</p>
          <div class="shopping-share-actions"><button class="button primary" type="button" data-share-copy>Kopiera länk</button><button class="button" type="button" data-share-send hidden>Skicka länken</button><a class="text-button" target="_blank" rel="noopener" data-share-open>Öppna kopian <i class="fas fa-arrow-up-right" aria-hidden="true"></i></a></div>
          <button class="text-button shopping-share-back" type="button" data-share-edit><i class="fas fa-arrow-left" aria-hidden="true"></i> Ändra listans namn</button>
        </div>
        <p class="meta shopping-share-status" role="status" data-share-status></p>
      </div>`;
    document.body.append(dialog);
    dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => { generation++; dialog.querySelector('[data-share-link]').value = ''; });
    document.addEventListener('restfest:account', () => { if (dialog.open) dialog.close(); });
  }
  const current = ++generation;
  dialog.querySelector('[data-share-art]').src = new URL('assets/icons/share.svg', base).href;
  dialog.querySelector('[data-share-ready-art]').src = new URL('assets/icons/check-mark.svg', base).href;
  const form = dialog.querySelector('form');
  const title = form.elements.title;
  const submit = form.querySelector('[type="submit"]');
  const result = dialog.querySelector('[data-share-result]');
  const link = dialog.querySelector('[data-share-link]');
  const status = dialog.querySelector('[data-share-status]');
  const copyButton = dialog.querySelector('[data-share-copy]');
  const send = dialog.querySelector('[data-share-send]');
  title.value = 'Inköpslista';
  form.hidden = false;
  result.hidden = true;
  status.textContent = '';
  submit.disabled = false;
  function submitLabel(text) {
    const icon = document.createElement('i');
    icon.className = 'fas fa-arrow-up-right';
    icon.setAttribute('aria-hidden', 'true');
    submit.replaceChildren(document.createTextNode(text + ' '), icon);
  }
  submitLabel('Skapa länk');
  copyButton.textContent = 'Kopiera länk';
  const snapshot = createShoppingCopy(items);
  dialog.querySelector('[data-share-count]').textContent = snapshot.i.length;
  dialog.querySelector('[data-share-preview]').replaceChildren(...snapshot.i.slice(0, 3).map(([text]) => {
    const row = document.createElement('li'); row.textContent = text; return row;
  }));
  const more = dialog.querySelector('[data-share-more]');
  more.hidden = snapshot.i.length <= 3;
  more.textContent = `… och ${snapshot.i.length - 3} till`;
  title.oninput = () => {
    result.hidden = true;
    status.textContent = '';
    submitLabel('Skapa länk');
  };
  form.onsubmit = async event => {
    event.preventDefault();
    if (current !== generation || !dialog.open) return;
    const name = title.value.trim();
    if (!name) { title.value = ''; title.reportValidity(); return; }
    submit.disabled = true;
    title.readOnly = true;
    status.textContent = 'Skapar din kopia …';
    try {
      const url = await createShoppingCopyLink({ ...snapshot, t: name }, {
        base, api: document.querySelector('meta[name="restfest-ai"]')?.content,
      });
      if (current !== generation || !dialog.open) return;
      link.value = url;
      dialog.querySelector('[data-share-open]').href = url;
      dialog.querySelector('[data-share-result-title]').textContent = name;
      dialog.querySelector('[data-share-result-count]').textContent = `${snapshot.i.length} ${snapshot.i.length === 1 ? 'vara' : 'varor'} att köpa`;
      form.hidden = true;
      result.hidden = false;
      send.hidden = typeof navigator.share !== 'function';
      submitLabel('Skapa länk igen');
      status.textContent = 'Kopian är klar att dela.';
      copyButton.focus();
    } catch (error) {
      if (current === generation) status.textContent = error.message || 'Kopian kunde inte skapas. Försök igen.';
    } finally {
      if (current === generation) { submit.disabled = false; title.readOnly = false; }
    }
  };
  dialog.querySelector('[data-share-edit]').onclick = () => {
    form.hidden = false;
    result.hidden = true;
    status.textContent = '';
    submitLabel('Skapa länk');
    title.focus(); title.select();
  };
  copyButton.onclick = async () => {
    try {
      await navigator.clipboard.writeText(link.value);
      if (current !== generation) return;
      copyButton.textContent = 'Länken är kopierad';
      status.textContent = 'Klistra in länken i ett meddelande till den som ska handla.';
    } catch {
      if (current !== generation) return;
      link.focus(); link.select();
      status.textContent = 'Kopiera den markerade länken och klistra in den i ett meddelande.';
    }
  };
  link.onclick = () => link.select();
  send.onclick = async () => {
    try { await navigator.share({ title: title.value.trim(), url: link.value }); }
    catch (error) { if (error.name !== 'AbortError' && current === generation) status.textContent = 'Du kan dela genom att kopiera länken i stället.'; }
  };
  title.readOnly = false;
  dialog.showModal();
  title.focus();
}
