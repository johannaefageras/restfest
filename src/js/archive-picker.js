// The icon menus on the archives share selection and keyboard behavior.
function setupArchivePicker(picker, choose) {
  const trigger = picker.querySelector("summary");
  const icon = trigger.querySelector("img");
  const label = trigger.querySelector("span");
  // A recipe dialog can change the address while the archive is still open.
  const base = document.baseURI;
  const options = [...picker.querySelectorAll("button[data-value]")];
  const visibleOptions = () => options.filter((option) => !option.hidden);
  const optionFor = (value) => options.find((option) => !option.hidden && option.dataset.value === value);
  let selected = options.find(option => option.getAttribute("aria-pressed") === "true") ?? options[0];

  function close() {
    picker.open = false;
    trigger.focus({ preventScroll: true });
  }

  picker.addEventListener("toggle", () => {
    if (picker.open) selected.focus();
  });
  picker.addEventListener("click", (event) => {
    const option = event.target.closest("button[data-value]");
    if (!option) return;
    choose(option.dataset.value);
    close();
  });
  picker.addEventListener("keydown", (event) => {
    const { key } = event;
    if (key === "Escape" && picker.open) {
      event.preventDefault();
      event.stopPropagation();
      close();
    } else if (key === "ArrowDown" || key === "ArrowUp") {
      event.preventDefault();
      if (!picker.open) {
        picker.open = true;
        return;
      }
      const available = visibleOptions();
      const index = available.indexOf(event.target);
      const step = key === "ArrowDown" ? 1 : -1;
      (index < 0 ? selected : available[(index + step + available.length) % available.length]).focus();
    } else if (picker.open && (key === "Home" || key === "End")) {
      event.preventDefault();
      const available = visibleOptions();
      available[key === "Home" ? 0 : available.length - 1].focus();
    }
  });
  picker.addEventListener("focusout", (event) => {
    if (event.relatedTarget && !picker.contains(event.relatedTarget)) picker.open = false;
  });
  document.addEventListener("click", (event) => {
    if (picker.open && !picker.contains(event.target)) picker.open = false;
  });

  return {
    get value() {
      return selected.dataset.value;
    },
    hasValue: (value) => Boolean(optionFor(value)),
    setValue(value) {
      const option = optionFor(value);
      if (!option || option === selected) return;
      selected.setAttribute("aria-pressed", "false");
      selected = option;
      selected.setAttribute("aria-pressed", "true");
      icon.src = new URL(selected.querySelector("img").getAttribute("src"), base).href;
      label.textContent = selected.querySelector("span").textContent;
    },
  };
}
