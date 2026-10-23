const TAB_NAVIGATION_ATTRIBUTE = "data-tab-navigation";

export function installFocusVisibility(root: HTMLElement) {
  function enableKeyboardFocus(event: KeyboardEvent) {
    if (
      event.key === "Shift" ||
      event.key === "Control" ||
      event.key === "Alt" ||
      event.key === "Meta"
    ) {
      return;
    }
    root.setAttribute(TAB_NAVIGATION_ATTRIBUTE, "true");
  }

  function disableKeyboardFocus() {
    root.setAttribute(TAB_NAVIGATION_ATTRIBUTE, "false");
  }

  window.addEventListener("keydown", enableKeyboardFocus, true);
  window.addEventListener("pointerdown", disableKeyboardFocus, true);
  document.addEventListener("fullscreenchange", disableKeyboardFocus);

  return () => {
    window.removeEventListener("keydown", enableKeyboardFocus, true);
    window.removeEventListener("pointerdown", disableKeyboardFocus, true);
    document.removeEventListener("fullscreenchange", disableKeyboardFocus);
  };
}
