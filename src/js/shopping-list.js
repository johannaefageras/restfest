// The account tab shares app.js's shopping list. Like the profile, it returns here after sign-in.
const account = window.restfestAccount;

function checkSignIn() {
  if (account && !account.signedIn()) location.replace(account.loginUrl());
}

checkSignIn();
document.addEventListener('restfest:account', checkSignIn);

const status = document.querySelector('[data-shopping-sync-status]');
const retry = document.querySelector('[data-shopping-sync-retry]');
function showSync() {
  const state = window.restfestShopping?.status();
  if (!state) return;
  retry.hidden = state.phase !== 'waiting' || !navigator.onLine;
  if (!state.durable && state.pending) {
    status.textContent = 'Ändringarna kan inte sparas på den här enheten. Håll sidan öppen tills de har synkats.';
  } else if (!state.durable) {
    status.textContent = 'Listan är sparad i kontot, men kan inte sparas på den här enheten för offlineanvändning.';
  } else if (!navigator.onLine) {
    status.textContent = 'Du är offline. Ändringarna sparas på den här enheten och synkas när du är online igen.';
  } else if (state.phase === 'waiting') {
    status.textContent = 'Kunde inte synka just nu. Ändringarna finns kvar på den här enheten.';
  } else if (state.phase === 'loading') status.textContent = 'Hämtar inköpslistan …';
  else if (state.phase === 'syncing' || state.phase === 'pending') status.textContent = 'Synkar inköpslistan …';
  else status.textContent = 'Sparat i kontot.';
}
document.addEventListener('restfest:shopping-sync', showSync);
window.addEventListener('online', showSync);
window.addEventListener('offline', showSync);
retry.addEventListener('click', () => window.restfestShopping?.refresh());
showSync();

// Cache only the static shopping page and its own assets. Account data and API responses never
// enter the service-worker cache; the account-scoped outbox above handles those.
if (account?.signedIn() && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register(assetUrl('shopping-worker.js')).catch(() => {});
}
