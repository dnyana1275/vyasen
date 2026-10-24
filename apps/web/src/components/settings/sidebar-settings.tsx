import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Command,
  Home,
  Settings,
} from "lucide-react";
import type { CSSProperties } from "react";

import {
  ChoiceCards,
  SettingToggle,
  SettingsSection,
} from "@/components/settings/settings-controls";
import { useTheme } from "@/providers/theme-provider";

const iconColors = [
  { label: "Ocean", value: "#818cf8" },
  { label: "Sky", value: "#38bdf8" },
  { label: "Violet", value: "#a78bfa" },
  { label: "Rose", value: "#fb7185" },
  { label: "Amber", value: "#fbbf24" },
  { label: "Emerald", value: "#34d399" },
];

const positionChoices = [
  { id: "left", label: "Left", detail: "Vertical navigation", icon: ArrowLeft },
  {
    id: "right",
    label: "Right",
    detail: "Vertical navigation",
    icon: ArrowRight,
  },
  { id: "top", label: "Top", detail: "Horizontal navigation", icon: ArrowUp },
  {
    id: "bottom",
    label: "Bottom",
    detail: "Horizontal navigation",
    icon: ArrowDown,
  },
] as const;

export function SidebarSettings() {
  const { preferences, updatePreference } = useTheme();
  const [isSmallScreen, setIsSmallScreen] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 639px)").matches,
  );
  const [canResizeSidebar, setCanResizeSidebar] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 768px)").matches,
  );

  useEffect(() => {
    const smallScreenQuery = window.matchMedia("(max-width: 639px)");
    const resizeSidebarQuery = window.matchMedia("(min-width: 768px)");
    const updateScreenSizes = () => {
      setIsSmallScreen(smallScreenQuery.matches);
      setCanResizeSidebar(resizeSidebarQuery.matches);
    };
    updateScreenSizes();
    smallScreenQuery.addEventListener("change", updateScreenSizes);
    resizeSidebarQuery.addEventListener("change", updateScreenSizes);
    return () => {
      smallScreenQuery.removeEventListener("change", updateScreenSizes);
      resizeSidebarQuery.removeEventListener("change", updateScreenSizes);
    };
  }, []);

  const horizontal = isSmallScreen
    ? true
    : preferences.sidebarPosition === "top" ||
      preferences.sidebarPosition === "bottom";
  const activePosition = isSmallScreen
    ? preferences.sidebarMobilePosition
    : preferences.sidebarPosition;

  return (
    <div className="space-y-5 py-6">
      <SettingsSection
        title="Sidebar"
        description="Choose how navigation appears and fits your workspace."
      >
        <div className="rounded-2xl border border-accent/30 bg-accent/5 p-4">
          <h3 className="text-sm font-semibold">Sidebar position</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {isSmallScreen
              ? "Choose the top or bottom position for small screens."
              : "Choose where the school navigation appears on larger screens."}
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {positionChoices.map(({ id, label, detail, icon: Icon }) => (
              <button
                key={id}
                type="button"
                aria-pressed={activePosition === id}
                onClick={() => {
                  if (isSmallScreen) {
                    if (id === "top" || id === "bottom") {
                      updatePreference("sidebarMobilePosition", id);
                    }
                    return;
                  }
                  if (preferences.sidebarPosition !== id) {
                    const currentIsHorizontal =
                      preferences.sidebarPosition === "top" ||
                      preferences.sidebarPosition === "bottom";
                    const nextIsHorizontal = id === "top" || id === "bottom";
                    updatePreference("sidebarPosition", id);
                    if (currentIsHorizontal !== nextIsHorizontal) {
                      updatePreference(
                        "sidebarBehavior",
                        nextIsHorizontal ? "hide-on-scroll" : "pinned",
                      );
                    }
                  }
                }}
                className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
                  activePosition === id
                    ? "border-accent bg-accent/10"
                    : "border-border bg-background hover:border-accent/50"
                } ${
                  isSmallScreen && (id === "left" || id === "right")
                    ? "hidden"
                    : ""
                }`}
              >
                <span className="grid size-9 place-items-center rounded-xl bg-surface text-accent">
                  <Icon size={17} />
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-semibold">{label}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {detail}
                  </span>
                </span>
                {activePosition === id && (
                  <Check size={16} className="text-accent" />
                )}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Sidebar behavior</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {horizontal
              ? "Pin top or bottom navigation, or hide it while scrolling."
              : "Pin the sidebar in place, or reveal it only when needed."}
          </p>
          <div className="mt-3">
            {isSmallScreen ? (
              <ChoiceCards
                value={preferences.sidebarMobileBehavior}
                onChange={(value) =>
                  updatePreference("sidebarMobileBehavior", value)
                }
                choices={[
                  {
                    id: "pinned",
                    label: "Pinned",
                    detail: "Keep navigation in view",
                  },
                  {
                    id: "hide-on-scroll",
                    label: "Hide while scrolling",
                    detail: "Reveal when scrolling up",
                  },
                ]}
              />
            ) : horizontal ? (
              <ChoiceCards
                value={preferences.sidebarBehavior}
                onChange={(value) =>
                  updatePreference("sidebarBehavior", value)
                }
                choices={[
                  {
                    id: "pinned",
                    label: "Pinned",
                    detail: "Keep navigation in view",
                  },
                  {
                    id: "hide-on-scroll",
                    label: "Hide while scrolling",
                    detail: "Reveal when scrolling up",
                  },
                ]}
              />
            ) : (
              <ChoiceCards
                value={preferences.sidebarBehavior}
                onChange={(value) =>
                  updatePreference("sidebarBehavior", value)
                }
                choices={[
                  {
                    id: "pinned",
                    label: "Pinned",
                    detail: "Keep the sidebar in place",
                  },
                  {
                    id: "hidden",
                    label: "Hidden",
                    detail: "Reveal from the screen edge",
                  },
                ]}
              />
            )}
          </div>
          {!horizontal && canResizeSidebar && (
            <p className="mt-3 text-xs text-muted-foreground">
              On medium screens and larger, drag the sidebar edge to resize it
              from 64 to 500 pixels.
            </p>
          )}
          <div className="mt-5 border-t border-border pt-4">
            <SettingToggle
              label="Floating navigation button"
              description="Show a draggable circular button over the content when navigation is hidden or auto-hidden."
              checked={preferences.floatingSidebarButtonEnabled}
              onChange={(value) =>
                updatePreference("floatingSidebarButtonEnabled", value)
              }
            />
          </div>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Icon style"
        description="Choose how icons are displayed in the sidebar."
      >
        <ChoiceCards
          value={preferences.sidebarIconStyle}
          onChange={(value) => updatePreference("sidebarIconStyle", value)}
          choices={[
            {
              id: "monochrome",
              label: "Monochrome",
              detail: "Use one icon color",
            },
            {
              id: "multicolor",
              label: "Multicolor",
              detail: "Give each icon its own color",
            },
          ]}
        />
      </SettingsSection>

      <SettingsSection
        title="Icon color"
        description="This setting applies only when Monochrome style is selected."
      >
        <div className="flex flex-wrap items-center gap-3">
          {iconColors.map(({ label, value }) => (
            <button
              key={value}
              type="button"
              aria-label={`${label} icon color`}
              aria-pressed={preferences.sidebarIconColor === value}
              disabled={preferences.sidebarIconStyle !== "monochrome"}
              onClick={() => updatePreference("sidebarIconColor", value)}
              className={`grid size-10 place-items-center rounded-full border-2 transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 ${
                preferences.sidebarIconColor === value
                  ? "border-foreground"
                  : "border-transparent"
              }`}
              style={{ backgroundColor: value }}
            >
              {preferences.sidebarIconColor === value && (
                <Check size={16} className="text-slate-950" />
              )}
            </button>
          ))}
          <label className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium">
            <span>Custom</span>
            <input
              type="color"
              aria-label="Custom monochrome icon color"
              value={preferences.sidebarIconColor}
              disabled={preferences.sidebarIconStyle !== "monochrome"}
              onChange={(event) =>
                updatePreference("sidebarIconColor", event.currentTarget.value)
              }
              className="size-6 cursor-pointer border-0 bg-transparent p-0 disabled:cursor-not-allowed"
            />
          </label>
        </div>
        {preferences.sidebarIconStyle === "multicolor" && (
          <p className="text-xs text-muted-foreground">
            Custom monochrome colors are saved but do not affect Multicolor
            style.
          </p>
        )}
      </SettingsSection>

      <SettingsSection
        title="Main content layout"
        description="Choose the content width used alongside the navigation."
      >
        <ChoiceCards
          value={preferences.mainContentLayout}
          onChange={(value) => updatePreference("mainContentLayout", value)}
          choices={[
            {
              id: "contained",
              label: "Contained",
              detail: "Focused reading width",
            },
            {
              id: "wide",
              label: "Wide",
              detail: "Comfortable workspace width",
            },
            {
              id: "full",
              label: "Full width",
              detail: "Use all available space",
            },
          ]}
        />
      </SettingsSection>

      <SettingsSection
        title="Menu behavior"
        description="Tune how navigation works in your school workspace."
      >
        <SettingToggle
          label="Show keyboard shortcuts"
          description="Display shortcut hints when hovering or focusing menu items."
          checked={preferences.showKeyboardShortcuts}
          onChange={(value) => updatePreference("showKeyboardShortcuts", value)}
        />
        <SettingToggle
          label="Elevate sidebar menus"
          description="Add subtle edge light and depth to sidebar menu items."
          checked={preferences.elevatedSidebarMenus}
          onChange={(value) => updatePreference("elevatedSidebarMenus", value)}
        />
      </SettingsSection>

      <div className="rounded-2xl border border-border bg-surface p-4">
        <p className="text-xs font-semibold text-muted-foreground">
          Navigation preview
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            Home,
            Settings,
            ChevronLeft,
            ChevronRight,
            ChevronUp,
            ChevronDown,
            Command,
          ].map((Icon, index) => (
            <span
              key={index}
              className={`grid size-10 place-items-center rounded-xl bg-background ${
                preferences.sidebarIconStyle === "monochrome"
                  ? "text-[var(--sidebar-icon-color)]"
                  : [
                      "text-sky-400",
                      "text-violet-400",
                      "text-emerald-400",
                      "text-rose-400",
                      "text-amber-400",
                      "text-indigo-400",
                      "text-cyan-400",
                    ][index]
              }`}
              style={
                preferences.sidebarIconStyle === "monochrome"
                  ? ({
                      "--sidebar-icon-color": preferences.sidebarIconColor,
                    } as CSSProperties)
                  : undefined
              }
            >
              <Icon size={18} />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
