// Offline account pages and visited public recipes. Private API responses stay in per-user browser
// storage; this worker never caches authentication or API traffic.
const cacheName = "ofta-bra-efter-account-v25";
const base = self.registration.scope;
const files = [
  "inkopslista.html",
  "delad-inkopslista.html",
  "lista/",
  "receptbok.html",
  "nytt-recept.html",
  "css/fonts.css",
  "css/styles.css",
  "css/dark.css",
  "css/kitchen.css",
  "css/shopping-share.css",
  "css/icons.css",
  "data/recipe-index.js",
  "data/foods.js",
  "data/shopping-departments.js",
  "js/shopping-departments.js",
  "js/recipes.js",
  "js/cooking-times.js",
  "js/cooking.js",
  "js/load-more.js",
  "js/tiktok-save.js",
  "js/app.js",
  "js/account.js",
  "js/account-helpers.js",
  "js/shopping-account.js",
  "js/shopping-sync.js",
  "js/shopping-list.js",
  "js/vendor/supabase.js",
  "js/account-sync.js",
  "js/recipe-book-sync.js",
  "js/recipe-book-account.js",
  "js/recipe-book.js",
  "js/new-recipe.js",
  "js/recipe-amounts.js",
  "js/shopping-groups.js",
  "js/shopping-copy.js",
  "js/shopping-copy-links.js",
  "js/shopping-share.js",
  "js/shopping-copy-view.js",
  // The weights the account pages use: Trio for headings, Spot Grotesk for text, Spot Semi for labels.
  "assets/fonts/TrioGrotesk-Bold.woff2",
  "assets/fonts/SpotGrotesk-Regular.woff2",
  "assets/fonts/SpotGrotesk-Medium.woff2",
  "assets/fonts/SpotGrotesk-Bold.woff2",
  "assets/fonts/SpotSemi-Regular.woff2",
  "assets/fonts/SpotSemi-Medium.woff2",
  "assets/fonts/font-awesome-400.woff2",
  "assets/fonts/font-awesome-700.woff2",
  "assets/icons/shopping-basket.svg",
  "assets/icons/check-mark.svg",
  "assets/icons/share.svg",
  "assets/icons/heart.svg",
  "assets/icons/user-profile.svg",
  "assets/icons/sun.svg",
  "assets/icons/moon.svg",
  "assets/icons/ramen.svg",
  "assets/icons/cook-book.svg",
  "assets/icons/magic-wand.svg",
  "assets/icons/recipe-archive.svg",
];
const urls = new Set(files.map((file) => new URL(file, base).href));
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => cache.addAll([...urls]))
      .then(() => self.skipWaiting()),
  );
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (key) =>
                (key.startsWith("ofta-bra-efter-shopping-") ||
                  key.startsWith("ofta-bra-efter-account-")) &&
                key !== cacheName,
            )
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  url.search = "";
  const root = new URL(base);
  const path =
    url.origin === root.origin && url.pathname.startsWith(root.pathname)
      ? url.pathname.slice(root.pathname.length)
      : "";
  const publicRecipe = /^recept\/[a-z0-9-]+\.html$/.test(path);
  const publicAsset =
    /^assets\/(?:recipes|icons)\/[a-z0-9-]+\.(?:png|jpe?g|svg|webp)$/i.test(
      path,
    );
  if (
    event.request.method !== "GET" ||
    (!urls.has(url.href) && !publicRecipe && !publicAsset)
  )
    return;
  event.respondWith(
    (async () => {
      const cache = await caches.open(cacheName);
      try {
        const response = await fetch(event.request, {
          signal: AbortSignal.timeout(5000),
        });
        if (response.ok && !response.redirected) {
          await cache.put(url.href, response.clone()).catch(() => {});
          // Bound images and visited recipes without evicting the account-page shell.
          if (!urls.has(url.href)) {
            const dynamic = (await cache.keys()).filter(
              (request) => !urls.has(request.url),
            );
            await Promise.all(
              dynamic
                .slice(0, Math.max(0, dynamic.length - 200))
                .map((request) => cache.delete(request)),
            );
          }
        }
        if (response.status >= 500)
          return (await cache.match(url.href)) ?? response;
        return response;
      } catch (error) {
        const cached = await cache.match(url.href);
        if (cached) return cached;
        throw error;
      }
    })(),
  );
});
