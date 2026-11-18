const sheet = document.querySelector('[data-shopping-copy]');
const loading = document.querySelector('[data-copy-loading]');
const error = document.querySelector('[data-copy-error]');
const list = document.querySelector('[data-copy-items]');
let copy;
let checked = new Set();
let revision = 0;
let tools;
// Storage can be unavailable even while the page itself works (e.g. private browsing policies).
function storage() { try { return localStorage; } catch { return null; } }

// The URL fragment holds the snapshot, so a skip link must focus main without replacing it.
document.querySelector('.skip-link').addEventListener('click', event => {
  event.preventDefault();
  const main = document.querySelector('#main');
  main.tabIndex = -1; main.focus(); main.scrollIntoView();
});

function progress() {
  const total = copy.i.length;
  const remaining = total - checked.size;
  document.querySelector('[data-copy-remaining]').textContent = remaining ? `${remaining} ${remaining === 1 ? 'vara' : 'varor'} kvar att köpa` : 'Allt är köpt';
  document.querySelector('[data-copy-count]').textContent = `${checked.size} av ${total} köpta`;
  const bar = document.querySelector('[data-copy-progress]');
  bar.max = total; bar.value = checked.size;
  document.querySelector('[data-copy-complete]').hidden = remaining > 0;
  document.querySelector('[data-copy-reset]').disabled = !checked.size;
  for (const checkbox of list.querySelectorAll('input')) {
    checkbox.checked = checked.has(Number(checkbox.value));
    checkbox.closest('li').classList.toggle('is-bought', checkbox.checked);
  }
}

async function openCopy() {
  const current = ++revision;
  copy = null;
  checked = new Set();
  sheet.hidden = true; error.hidden = true; loading.hidden = false;
  document.querySelector('[data-copy-storage]').hidden = true;
  try {
    const fragment = location.hash.slice(1);
    if (!fragment) throw new Error('Öppna hela länken du fick, eller be avsändaren att dela listan igen.');
    tools = await import('./shopping-copy.js');
    const { loadShoppingCopy } = await import('./shopping-copy-links.js');
    const next = await loadShoppingCopy(fragment, {
      api: document.querySelector('meta[name="restfest-ai"]')?.content, storage: storage(),
    });
    if (current !== revision) return;
    copy = next;
    checked = tools.readCopyChecks(storage(), copy);
    document.querySelector('[data-copy-title]').textContent = copy.t;
    document.title = `${copy.t} · Ofta bra efter`;
    const entries = copy.i.map(([text, note], index) => ({ text, note, index }));
    const renderRow = ({ text, note, index }) => {
      const row = document.createElement('li');
      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox'; checkbox.value = index;
      const content = document.createElement('span');
      const name = document.createElement('span'); name.className = 'shopping-copy-item-name'; name.textContent = text;
      content.append(name);
      if (note) { const detail = document.createElement('span'); detail.className = 'shopping-copy-item-note'; detail.textContent = note; content.append(detail); }
      label.append(checkbox, content); row.append(label); return row;
    };
    let departments;
    try {
      const module = await import('./shopping-departments.js');
      const classify = await module.loadShoppingDepartmentClassifier();
      departments = module.groupShoppingDepartments(entries, classify);
    } catch { departments = [{ id: '', items: entries }]; }
    if (current !== revision) return;
    list.replaceChildren(...departments.flatMap(department => {
      if (!department.id) return department.items.map(renderRow);
      const section = document.createElement('li'); section.className = 'shopping-department';
      const heading = document.createElement('h2'); heading.className = 'shopping-department-title'; heading.textContent = department.label;
      const items = document.createElement('ul'); items.className = 'ingredients shopping-department-items';
      items.append(...department.items.map(renderRow)); section.append(heading, items); return [section];
    }));
    progress();
    sheet.hidden = false;
  } catch (cause) {
    if (current !== revision) return;
    document.querySelector('[data-copy-error-message]').textContent = cause instanceof TypeError
      ? 'Listan kunde inte öppnas just nu. Kontrollera din anslutning och försök igen.'
      : cause.message || 'Listan kunde inte öppnas. Be om en ny länk.';
    error.hidden = false;
  } finally { if (current === revision) loading.hidden = true; }
}

list.addEventListener('change', event => {
  if (!copy || !event.target.matches('input[type="checkbox"]')) return;
  const index = Number(event.target.value);
  if (event.target.checked) checked.add(index); else checked.delete(index);
  document.querySelector('[data-copy-storage]').hidden = tools.writeCopyChecks(storage(), copy, checked);
  progress();
});
document.querySelector('[data-copy-reset]').addEventListener('click', () => {
  if (!copy) return;
  checked.clear();
  document.querySelector('[data-copy-storage]').hidden = tools.writeCopyChecks(storage(), copy, checked);
  progress();
  list.querySelector('input')?.focus();
});
window.addEventListener('storage', event => {
  if (!copy || (event.key !== null && event.key !== tools.shoppingCopyKey(copy))) return;
  checked = tools.readCopyChecks(storage(), copy); progress();
});
window.addEventListener('hashchange', openCopy);
openCopy();
