function initRecipeCarousel(carousel) {
  const track = carousel.querySelector(".recipe-carousel-track");
  if (track.children.length < 2) return;

  const controls = carousel.querySelector(".recipe-carousel-controls");
  const rotation = carousel.querySelector(".recipe-carousel-play");
  const previous = carousel.querySelector(".recipe-carousel-prev");
  const next = carousel.querySelector(".recipe-carousel-next");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const canHover = matchMedia("(hover: hover)");
  const visibleRatio = 0.35;
  let playing;
  let inView = false;
  let timer;

  function move(direction) {
    const [first, second] = track.children;
    const step = second.getBoundingClientRect().left - first.getBoundingClientRect().left;
    const end = track.scrollWidth - track.clientWidth;
    const left = track.scrollLeft;
    const atStart = left <= 2;
    const atEnd = left >= end - 2;
    const wraps = direction > 0 ? atEnd : atStart;
    let target;
    if (wraps) target = direction > 0 ? 0 : end;
    else if (direction > 0) target = Math.min(end, (Math.floor((left + 2) / step) + 1) * step);
    else target = Math.max(0, (Math.ceil((left - 2) / step) - 1) * step);
    track.scrollTo({ left: target, behavior: wraps || reducedMotion.matches ? "instant" : "smooth" });
  }

  function schedule() {
    clearTimeout(timer);
    if (!playing || !inView || document.hidden) return;

    timer = setTimeout(() => {
      const hovering = canHover.matches && track.matches(":hover");
      const browsing = track.matches(":focus-within, :active") ||
        previous.matches(":focus-visible") || next.matches(":focus-visible");
      if (!hovering && !browsing && !document.querySelector("dialog[open]")) move(1);
      schedule();
    }, 5000);
  }

  function setPlaying(value) {
    playing = value;
    rotation.dataset.playing = String(value);
    rotation.setAttribute("aria-label", value ? "Pausa receptkarusellen" : "Spela upp receptkarusellen");
    schedule();
  }

  previous.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));
  rotation.addEventListener("click", () => setPlaying(!playing));
  reducedMotion.addEventListener("change", ({ matches }) => {
    if (matches) setPlaying(false);
  });
  document.addEventListener("visibilitychange", schedule);
  track.addEventListener("scroll", schedule, { passive: true });
  track.addEventListener("pointerleave", schedule);
  track.addEventListener("focusout", schedule);

  // Run the timer only while the recipes are in view, including after scrolling back to them.
  const observer = new IntersectionObserver(([entry]) => {
    inView = entry.intersectionRatio >= visibleRatio;
    schedule();
  }, { threshold: visibleRatio });
  observer.observe(track);

  setPlaying(!reducedMotion.matches);
  track.dataset.ready = "";
  controls.hidden = false;
}

const carousel = document.querySelector(".recipe-carousel");
if (carousel) initRecipeCarousel(carousel);
