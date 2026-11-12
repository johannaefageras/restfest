"use strict";

// The fridge photo and "Hitta på ett recept" on the home page. Both call the Supabase Edge Functions in
// supabase/functions/ (HANDOFF.md, "Kylfoto och nya recept"). Until their address is set in
// src/_data/ai.js the page has neither, there's no <meta name="restfest-ai">, and this does nothing.
(() => {
  const api = document.querySelector('meta[name="restfest-ai"]')?.content;
  if (!api) return;

  const photoButton = $("#fridge-photo");
  const photoInput = $("#fridge-photo-input");
  // Progress and results go under the list, where the foods appear.
  const photoStatus = $("#pantry-status");
  const inventBox = $("#invent-recipe");
  const inventButton = $("#invent-button");
  const inventStatus = $("#invent-status");
  const generalError = "Något gick fel. Prova igen om en stund.";

  // The functions answer {error} in Swedish when something is wrong; a lost connection doesn't.
  async function post(name, body) {
    let response;
    try {
      response = await fetch(`${api}/${name}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch {
      throw new Error(
        "Kunde inte nå Restfest. Kolla uppkopplingen och prova igen.",
      );
    }
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || generalError);
    return result;
  }

  // About 1500 px on the longest side is plenty for reading labels, and keeps the upload small.
  async function shrink(file) {
    let bitmap;
    try {
      bitmap = await createImageBitmap(file, {
        imageOrientation: "from-image",
      });
    } catch {
      throw new Error(
        `${file.name || "Bilden"} gick inte att läsa. Prova en JPEG- eller PNG-bild.`,
      );
    }
    const scale = Math.min(1, 1568 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas
      .getContext("2d")
      .drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.82),
    );
    if (!blob) throw new Error(generalError);
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    return dataUrl.slice(dataUrl.indexOf(",") + 1);
  }

  // The names to add: the site's own name for a recognised food, the photo's name for the rest.
  function foundNames({ keys = [], other = [] }) {
    const known = keys
      .filter((key) => foods[key])
      .map((key) => foods[key].name);
    const rest = other.map((name) => {
      const key = keyForIngredient(name);
      return foods[key] && !genericIngredientKeys.has(key)
        ? foods[key].name
        : capitalize(name);
    });
    return [...known, ...rest].filter(
      (name) => !basicIngredientWords.has(normalizeIngredient(name)),
    );
  }

  function setPhotoBusy(busy) {
    photoButton.disabled = busy;
    photoButton.setAttribute("aria-busy", String(busy));
    $("span", photoButton).textContent = busy
      ? "Tittar i kylen …"
      : "Fota eller välj bilder";
  }

  photoButton.addEventListener("click", () => photoInput.click());

  photoInput.addEventListener("change", async () => {
    const files = [...photoInput.files].slice(0, 3);
    photoInput.value = "";
    if (!files.length) return;
    setPhotoBusy(true);
    photoStatus.textContent =
      files.length > 1
        ? "Tittar på bilderna. Det tar några sekunder …"
        : "Tittar på bilden. Det tar några sekunder …";
    try {
      const images = await Promise.all(files.map(shrink));
      const names = foundNames(await post("detect-ingredients", { images }));
      const added = [];
      for (const name of names) {
        if (pantry.items.length >= 60) break;
        if (pantry.items.some((item) => sameIngredient(item, name))) continue;
        pantry.items.push(name);
        added.push(name);
      }
      let message =
        "Hittade inga råvaror. Prova med kylen öppen och bra ljus, eller skriv in dem.";
      if (added.length) {
        message = `${added.length === 1 ? "1 råvara" : `${added.length} råvaror`} från ${files.length > 1 ? "bilderna" : "bilden"} lades till. Stämmer något inte, tryck på det för att ta bort det.`;
      } else if (names.length) {
        message = `Allt på ${files.length > 1 ? "bilderna" : "bilden"} fanns redan i listan.`;
      }
      updatePantry(message);
      if (added.length) {
        const smooth = !matchMedia("(prefers-reduced-motion: reduce)").matches;
        $("#pantry-list").scrollIntoView({
          block: "nearest",
          behavior: smooth ? "smooth" : "auto",
        });
      }
    } catch (error) {
      photoStatus.textContent = error.message;
    } finally {
      setPhotoBusy(false);
    }
  });

  // The list as the recipe function wants it: each name with the ingredient key it matches, or null.
  function listItems() {
    return pantry.items.map((name) => {
      const key = keyForIngredient(name);
      return { name, key: foods[key] ? key : null };
    });
  }

  function updateInvent() {
    if (inventButton.disabled) return;
    inventBox.hidden = !listItems().some((item) => item.key);
  }

  document.addEventListener("restfest:pantry", updateInvent);
  updateInvent();

  inventButton.addEventListener("click", async () => {
    inventButton.disabled = true;
    inventButton.setAttribute("aria-busy", "true");
    inventStatus.textContent =
      "Vi skriver receptet. Det tar ungefär en halv minut …";
    const slow = setTimeout(() => {
      inventStatus.textContent = "Snart klart …";
    }, 25000);
    try {
      const { id } = await post("generate-recipe", { items: listItems() });
      inventStatus.textContent = "Klart. Öppnar receptet …";
      location.href = `${siteBase}nytt-recept.html?id=${encodeURIComponent(id)}`;
    } catch (error) {
      inventStatus.textContent = error.message;
      inventButton.disabled = false;
      inventButton.removeAttribute("aria-busy");
      updateInvent();
    } finally {
      clearTimeout(slow);
    }
  });

  // Back from the new recipe, the browser may show this page as it was left, mid-"Öppnar receptet".
  window.addEventListener("pageshow", (event) => {
    if (!event.persisted) return;
    inventButton.disabled = false;
    inventButton.removeAttribute("aria-busy");
    inventStatus.textContent = "";
    updateInvent();
  });
})();
