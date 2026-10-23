import type { FocusEvent, KeyboardEvent } from "react";

const TAB_SELECTOR = '[role="tab"]:not([aria-disabled="true"])';

function isEnabledTab(element: HTMLElement, tablist: HTMLElement) {
  return (
    element.closest('[role="tablist"]') === tablist &&
    !element.matches(":disabled")
  );
}

export function scrollKeyboardFocusedTabIntoView(
  event: FocusEvent<HTMLElement>,
) {
  if (!event.currentTarget.matches(":focus-visible")) return;

  event.currentTarget.scrollIntoView({
    block: "nearest",
    inline: "nearest",
  });
}

export function handleRovingTabKeyDown(event: KeyboardEvent<HTMLElement>) {
  const tablist = event.currentTarget.closest<HTMLElement>('[role="tablist"]');
  if (!tablist) return;

  if (event.key === " ") {
    event.preventDefault();
    event.currentTarget.click();
    return;
  }

  if (
    event.key !== "ArrowLeft" &&
    event.key !== "ArrowRight" &&
    event.key !== "ArrowUp" &&
    event.key !== "ArrowDown" &&
    event.key !== "Home" &&
    event.key !== "End"
  ) {
    return;
  }

  const tabs = Array.from(
    tablist.querySelectorAll<HTMLElement>(TAB_SELECTOR),
  ).filter((tab) => isEnabledTab(tab, tablist));
  const currentIndex = tabs.indexOf(event.currentTarget);
  if (currentIndex < 0 || tabs.length === 0) return;

  event.preventDefault();
  const nextIndex =
    event.key === "Home"
      ? 0
      : event.key === "End"
        ? tabs.length - 1
        : (currentIndex +
            (event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1) +
            tabs.length) %
          tabs.length;

  const nextTab = tabs[nextIndex];
  nextTab?.focus({ preventScroll: true });
  nextTab?.click();
}
