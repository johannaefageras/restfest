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
  async function post(name, body, { signedIn = false } = {}) {
    let response;
    try {
      const headers = { "Content-Type": "application/json" };
      // A signed-in visitor's access token (account.js), so the function knows whose preferences
      // to follow and whose recipe book the recipe goes in. Without one it works as before.
      const token = signedIn
        ? await window.restfestAccount?.token().catch(() => null)
        : null;
      if (token) headers.Authorization = `Bearer ${token}`;
      response = await fetch(`${api}/${name}`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
    } catch {
      throw new Error(
        "Kunde inte nå Ofta bra efter. Kolla uppkopplingen och prova igen.",
      );
    }
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || generalError);
    return result;
  }

  // Preserve small labels for high-resolution vision. Keep each JPEG under the function's base64 cap.
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
    const scale = Math.min(1, 2560 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    let blob;
    try {
      do {
        const context = canvas.getContext("2d");
        context.fillStyle = "#fff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        blob = await new Promise((resolve) =>
          canvas.toBlob(resolve, "image/jpeg", 0.9),
        );
        if (!blob) throw new Error(generalError);
        if (blob.size <= 2_250_000) break;
        canvas.width = Math.max(1, Math.round(canvas.width * 0.8));
        canvas.height = Math.max(1, Math.round(canvas.height * 0.8));
      } while (true);
    } finally {
      bitmap.close();
    }
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    return dataUrl.slice(dataUrl.indexOf(",") + 1);
  }

  // Preserve observed product names. Recipe aliases are for matching, not for renaming a photo's foods.
  // Fall back to the previous response while an older Edge Function is still deployed.
  function foundNames({ names, keys = [], other = [] }) {
    if (Array.isArray(names)) {
      return names
        .filter((name) => typeof name === "string" && name.trim())
        .map((name) => capitalize(cleanIngredient(name)))
        .filter((name) => !basicIngredientWords.has(normalizeIngredient(name)));
    }
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
      // New foods the list had no room for (it holds 60, like the typed ones).
      let leftOut = 0;
      for (const name of names) {
        if (pantry.items.some((item) => normalizeIngredient(item) === normalizeIngredient(name))) continue;
        if (pantry.items.length >= 60) {
          leftOut++;
          continue;
        }
        pantry.items.push(name);
        added.push(name);
      }
      const where = files.length > 1 ? "bilderna" : "bilden";
      let message =
        "Hittade inga råvaror. Prova med kylen öppen och bra ljus, eller skriv in dem.";
      const count = `${added.length === 1 ? "1 råvara" : `${added.length} råvaror`} från ${where} lades till.`;
      if (leftOut) {
        message = added.length
          ? `${count} Listan rymmer 60 råvaror, så ${leftOut} fick inte plats. Ta bort några och fota igen.`
          : `Listan rymmer 60 råvaror, så ${leftOut} från ${where} fick inte plats. Ta bort några och fota igen.`;
      } else if (added.length) {
        message = `${count} Stämmer något inte, tryck på det för att ta bort det.`;
      } else if (names.length) {
        message = `Allt på ${where} fanns redan i listan.`;
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
      const result = await post(
        "generate-recipe",
        { items: listItems() },
        { signedIn: true },
      );
      // Cache the recipe and persist a retry before navigating, even when the initial save failed.
      window.restfestAccount?.noteGenerated(result);
      inventStatus.textContent = "Klart. Öppnar receptet …";
      location.href = `${siteBase}nytt-recept.html?id=${encodeURIComponent(result.id)}`;
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
