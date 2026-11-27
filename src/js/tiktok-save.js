"use strict";

// "Spara bilden" on a Scrollstopp recipe (layouts/recipe.njk): the recipe's TikTok image, 1080 × 1920
// with the site's address on it (tools/scrollstopp-images.mjs), for a visitor to post with what she
// baked. The link downloads the JPEG by itself, also without JavaScript. On a phone that can share
// files, a click opens the share sheet instead, where "Spara bild" puts it in Photos and TikTok is one
// of the choices; on iPhone a download would only reach Files. Computers keep the download, even
// where the browser can share (Safari on a Mac).
// A classic script loaded on every page before app.js, so they share one global scope: every
// top-level name here starts with "tiktok" (or is enhanceTiktokSave). The two functions before the
// page part are pure and tested in test/tiktok-save.test.js.

// What a click does: "share" when this is a phone (a coarse pointer) that can share files and the
// file has been fetched; otherwise "download", the link's own behaviour.
function tiktokSaveMode({ coarsePointer, canShareFiles, file }) {
  return coarsePointer && canShareFiles && file ? "share" : "download";
}

// Shares `file` alone (with a title or text beside it, some apps post the text and drop the image).
// `share` is called before anything is awaited, so it still runs inside the click, as Safari requires.
// Closing the sheet is a choice, so nothing happens; any other failure downloads the file instead.
async function tiktokShare(file, { share, download }) {
  try {
    await share({ files: [file] });
    return "shared";
  } catch (error) {
    if (error?.name === "AbortError") return "cancelled";
    download();
    return "downloaded";
  }
}

// ---- The page ----

// `article` is the recipe, on its own page or in the dialog. The dialog shows a recipe page fetched
// from recept/ and runs this before the address changes to it, so the link's address is set here from
// the site root (`assetUrl` from app.js) instead of being left relative to the page it came from.
function enhanceTiktokSave(article, assetUrl) {
  const link = article.querySelector("[data-tiktok-save]");
  if (!link) return;
  const url = assetUrl(link.dataset.tiktokSave);
  const name = link.getAttribute("download");
  link.href = url;

  const coarsePointer = window.matchMedia?.("(pointer: coarse)").matches ?? false;
  const canShareFiles =
    typeof navigator.share === "function" && typeof navigator.canShare === "function";
  let file = null;

  // The file has to be ready before the click: fetching it inside the click would use up the user
  // activation Safari needs for share(). It is fetched once the section is near, not on every visit
  // to the recipe, and only where it can be shared. If it fails, the link still downloads.
  async function fetchFile() {
    try {
      const response = await fetch(url);
      if (!response.ok) return;
      const candidate = new File([await response.blob()], name, { type: "image/jpeg" });
      if (navigator.canShare({ files: [candidate] })) file = candidate;
    } catch {
      // Offline, or the browser refused: keep the plain link.
    }
  }
  if (coarsePointer && canShareFiles) {
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          observer.disconnect();
          fetchFile();
        },
        { rootMargin: "600px 0px" },
      );
      observer.observe(link.closest("section") ?? link);
    } else {
      fetchFile();
    }
  }

  link.addEventListener("click", (event) => {
    if (tiktokSaveMode({ coarsePointer, canShareFiles, file }) !== "share") return;
    event.preventDefault();
    tiktokShare(file, {
      share: (data) => navigator.share(data),
      // A separate link, so this one's click handler doesn't share again.
      download: () => {
        const fallback = document.createElement("a");
        fallback.href = url;
        fallback.download = name;
        document.body.append(fallback);
        fallback.click();
        fallback.remove();
      },
    });
  });
}
