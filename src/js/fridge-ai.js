"use strict";

// The fridge photo and "Hitta på ett recept" on the home page. Both call the Supabase Edge Functions in
// supabase/functions/ (HANDOFF.md, "Kylfoto och nya recept"). Until their address is set in
// src/_data/ai.js the page has neither, there's no <meta name="restfest-ai">, and this does nothing.
(() => {
  const api = document.querySelector('meta[name="restfest-ai"]')?.content;
  if (!api) return;

  // "Välj bilder": up to three photos from the library.
  const photoButton = $("#fridge-photo");
  const photoInput = $("#fridge-photo-input");
  // "Fota": one photo straight from a camera.
  const cameraButton = $("#fridge-camera");
  const cameraInput = $("#fridge-camera-input");
  const cameraDialog = $("#fridge-camera-dialog");
  const cameraVideo = $("#fridge-camera-video");
  const cameraShoot = $("#fridge-camera-shoot");
  // Progress and results go above the list, so the review starts with a confirmation.
  const photoStatus = $("#pantry-status");
  const pantryPanel = $("#pantry-panel");
  const inventBox = $("#invent-recipe");
  const inventButton = $("#invent-button");
  const inventStatus = $("#invent-status");
  const inventMobile = $("#invent-mobile");
  const inventMobileButton = $("#invent-mobile-button");
  const inventMobileStatus = $("#invent-mobile-status");
  const inventButtons = [inventButton, inventMobileButton];
  let scanning = false;
  let generating = false;
  let pantryVisible = false;
  let inventVisible = false;
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

  // Some phone browsers can display a photo even when createImageBitmap cannot decode it.
  // Both paths respect the photo's orientation. Keep the decoded source only until it is resized.
  async function readPhoto(file) {
    // The webcam already gave us a decoded canvas; don't allocate another full-size bitmap.
    if (typeof file.getContext === "function") {
      return {
        image: file, width: file.width, height: file.height,
        release() { file.width = file.height = 0; },
      };
    }
    try {
      const bitmap = await createImageBitmap(file, {
        imageOrientation: "from-image",
      });
      return {
        image: bitmap, width: bitmap.width, height: bitmap.height,
        release() { bitmap.close(); },
      };
    } catch {
      // Also handles browsers without createImageBitmap. Try their native image loader below.
    }
    const url = URL.createObjectURL(file);
    const image = new Image();
    const release = () => {
      image.removeAttribute("src");
      URL.revokeObjectURL(url);
    };
    try {
      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
        image.src = url;
      });
      if (!image.naturalWidth || !image.naturalHeight) throw new Error();
      return {image, width: image.naturalWidth, height: image.naturalHeight, release};
    } catch {
      release();
      throw new Error(
        `${file.name || "Bilden"} gick inte att läsa. Prova att välja bilden från bildbiblioteket eller ta en ny bild med Fota.`,
      );
    }
  }

  // Preserve small labels for high-resolution vision. Keep each JPEG under the function's base64 cap.
  // `file` is a photo from one of the inputs, or the canvas the webcam's picture was drawn on.
  async function shrink(file) {
    const photo = await readPhoto(file);
    const canvas = document.createElement("canvas");
    let blob;
    try {
      const scale = Math.min(1, 2560 / Math.max(photo.width, photo.height));
      canvas.width = Math.round(photo.width * scale);
      canvas.height = Math.round(photo.height * scale);
      do {
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Bilden kunde inte förberedas. Prova en bild i taget.");
        context.fillStyle = "#fff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(photo.image, 0, 0, canvas.width, canvas.height);
        blob = await new Promise((resolve) =>
          canvas.toBlob(resolve, "image/jpeg", 0.9),
        );
        if (!blob) throw new Error(generalError);
        if (blob.size <= 2_250_000) break;
        canvas.width = Math.max(1, Math.round(canvas.width * 0.8));
        canvas.height = Math.max(1, Math.round(canvas.height * 0.8));
      } while (true);
    } finally {
      photo.release();
      // Safari can retain canvas storage until GC even after its bitmap has been closed.
      canvas.width = canvas.height = 0;
    }
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error(generalError));
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

  // The webcam, for browsers that ignore `capture`. The picture is taken with "Ta bilden" below.
  async function openWebcam() {
    cameraButton.disabled = true;
    cameraShoot.disabled = true;
    photoStatus.textContent = "";
    try {
      cameraVideo.srcObject = await window.navigator.mediaDevices.getUserMedia({
        audio: false,
        // The back camera where there is one, and as many pixels as it has, for the small labels.
        video: {
          facingMode: "environment",
          width: { ideal: 2560 },
          height: { ideal: 1440 },
        },
      });
    } catch (error) {
      photoStatus.textContent =
        error.name === "NotAllowedError"
          ? "Kameran är blockerad. Tillåt den i webbläsaren, eller välj bilder i stället."
          : "Kunde inte öppna kameran. Välj bilder i stället.";
      return;
    } finally {
      cameraButton.disabled = false;
    }
    cameraDialog.showModal();
  }

  // "Fota" opens a camera at once. A phone's browser knows `capture` and opens the phone's own camera.
  // A computer's doesn't, and would show the file picker, so there the webcam opens in a dialog.
  // With neither, "Välj bilder" is the only button.
  const openCamera =
    "capture" in cameraInput
      ? () => cameraInput.click()
      : window.navigator?.mediaDevices?.getUserMedia && cameraDialog?.showModal
        ? openWebcam
        : null;
  cameraButton.hidden = !openCamera;

  // While a scan runs, the button that started it says so and the other one steps aside.
  const labels = new Map([
    [cameraButton, "Fota"],
    [photoButton, "Välj bilder"],
  ]);
  function setPhotoBusy(button, busy) {
    const other = button === cameraButton ? photoButton : cameraButton;
    button.disabled = busy;
    button.setAttribute("aria-busy", String(busy));
    $("span", button).textContent = busy
      ? "Tittar i kylen …"
      : labels.get(button);
    other.hidden = busy || (other === cameraButton && !openCamera);
  }

  photoButton.addEventListener("click", () => photoInput.click());
  cameraButton.addEventListener("click", () => openCamera?.());
  for (const [button, input] of [
    [photoButton, photoInput],
    [cameraButton, cameraInput],
  ]) {
    input.addEventListener("change", () => {
      const files = [...input.files].slice(0, 3);
      input.value = "";
      return scan(files, button);
    });
  }

  if (openCamera === openWebcam) {
    // The picture can be taken once the camera shows one.
    cameraVideo.addEventListener("loadedmetadata", () => {
      cameraShoot.disabled = false;
    });
    cameraShoot.addEventListener("click", () => {
      const canvas = document.createElement("canvas");
      canvas.width = cameraVideo.videoWidth;
      canvas.height = cameraVideo.videoHeight;
      canvas.getContext("2d").drawImage(cameraVideo, 0, 0);
      cameraDialog.close();
      return scan([canvas], cameraButton);
    });
    $(".dialog-close", cameraDialog).addEventListener("click", () =>
      cameraDialog.close(),
    );
    // However the dialog closes (the picture, the cross, Esc), the camera is turned off.
    cameraDialog.addEventListener("close", () => {
      for (const track of cameraVideo.srcObject?.getTracks() ?? []) track.stop();
      cameraVideo.srcObject = null;
    });
  }

  // Sends the photos, and puts the foods Claude sees in them on the list. `button` is the one that was used.
  async function scan(files, button) {
    if (!files.length) return;
    scanning = true;
    updateInvent();
    setPhotoBusy(button, true);
    photoStatus.textContent =
      files.length > 1
        ? "Tittar på bilderna. Det tar några sekunder …"
        : "Tittar på bilden. Det tar några sekunder …";
    try {
      // Three full-size phone photos at once can exhaust a mobile browser's image memory.
      const images = [];
      for (const file of files) images.push(await shrink(file));
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
        message = `${count} Kontrollera listan och ta bort det som inte stämmer.`;
      } else if (names.length) {
        message = `Allt på ${where} fanns redan i listan.`;
      }
      updatePantry(message);
      const smooth = !matchMedia("(prefers-reduced-motion: reduce)").matches;
      pantryPanel.scrollIntoView({
        block: "start",
        behavior: smooth ? "smooth" : "auto",
      });
    } catch (error) {
      photoStatus.textContent = error.message;
    } finally {
      setPhotoBusy(button, false);
      scanning = false;
      updateInvent();
    }
  }

  // The list as the recipe function wants it: each name with the ingredient key it matches, or null.
  function listItems() {
    return pantry.items.map((name) => {
      const key = keyForIngredient(name);
      return { name, key: foods[key] ? key : null };
    });
  }

  function updateInvent() {
    inventBox.hidden = !generating && !listItems().some((item) => item.key);
    for (const button of inventButtons) {
      button.disabled = scanning || generating;
      if (generating) button.setAttribute("aria-busy", "true");
      else button.removeAttribute("aria-busy");
    }
    inventMobile.hidden = inventBox.hidden || scanning || !pantryVisible || inventVisible;
  }

  function setInventStatus(message) {
    inventStatus.textContent = message;
    inventMobileStatus.textContent = message;
  }

  // The mobile bar hands over to the regular button once it is fully visible. Without observer
  // support, the regular action beside the ingredients remains available.
  if (window.IntersectionObserver) {
    const observer = new window.IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === pantryPanel) pantryVisible = entry.isIntersecting;
        if (entry.target === inventButton) inventVisible = entry.intersectionRatio === 1;
      }
      updateInvent();
    }, { threshold: [0, 1] });
    observer.observe(pantryPanel);
    observer.observe(inventButton);
  }
  document.addEventListener("restfest:pantry", updateInvent);
  updateInvent();

  async function inventRecipe() {
    if (scanning || generating || inventBox.hidden) return;
    generating = true;
    updateInvent();
    setInventStatus("Vi skriver receptet. Det tar ungefär en halv minut …");
    const slow = setTimeout(() => {
      setInventStatus("Snart klart …");
    }, 25000);
    try {
      const result = await post(
        "generate-recipe",
        { items: listItems() },
        { signedIn: true },
      );
      // Cache the recipe and persist a retry before navigating, even when the initial save failed.
      window.restfestAccount?.noteGenerated(result);
      setInventStatus("Klart. Öppnar receptet …");
      location.href = `${siteBase}nytt-recept.html?id=${encodeURIComponent(result.id)}`;
    } catch (error) {
      setInventStatus(error.message);
      generating = false;
      updateInvent();
    } finally {
      clearTimeout(slow);
    }
  }
  for (const button of inventButtons) button.addEventListener("click", inventRecipe);

  // Back from the new recipe, the browser may show this page as it was left, mid-"Öppnar receptet".
  window.addEventListener("pageshow", (event) => {
    if (!event.persisted) return;
    generating = false;
    setInventStatus("");
    updateInvent();
  });
})();
