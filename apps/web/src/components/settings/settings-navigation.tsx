import { Link, useRouterState } from "@tanstack/react-router";
import {
  handleRovingTabKeyDown,
  scrollKeyboardFocusedTabIntoView,
} from "@/accessibility/roving-tab-focus";

const settingsLinks = [
  { label: "Appearance", to: "/settings/appearance" },
  { label: "Sidebar", to: "/settings/sidebar" },
] as const;

export function SettingsNavigation() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return (
    <nav
      role="tablist"
      aria-label="Settings pages"
      className="mt-7 flex gap-1 overflow-x-auto border-b border-border"
    >
      {settingsLinks.map(({ label, to }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            id={`${label.toLowerCase()}-settings-tab`}
            role="tab"
            aria-selected={active}
            aria-controls="settings-content"
            tabIndex={active ? 0 : -1}
            onFocus={scrollKeyboardFocusedTabIntoView}
            onKeyDown={handleRovingTabKeyDown}
            className={`shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              active
                ? "settings-nav-active border-accent text-accent"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
