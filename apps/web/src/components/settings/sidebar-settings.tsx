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

  return (
    <div className="space-y-5 py-6">
      <SettingsSection
        title="Sidebar"
        description="Choose how navigation and the main content fit your workspace."
      >
        <div className="rounded-2xl border border-accent/30 bg-accent/5 p-4">
          <h3 className="text-sm font-semibold">Sidebar position</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Choose where the school navigation appears on every screen size.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {positionChoices.map(({ id, label, detail, icon: Icon }) => (
              <button
                key={id}
                type="button"
                aria-pressed={preferences.sidebarPosition === id}
                onClick={() => updatePreference("sidebarPosition", id)}
                className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
                  preferences.sidebarPosition === id
                    ? "border-accent bg-accent/10"
                    : "border-border bg-background hover:border-accent/50"
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
                {preferences.sidebarPosition === id && (
                  <Check size={16} className="text-accent" />
                )}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Header behavior</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Choose how the navigation dock behaves while the page scrolls.
          </p>
          <div className="mt-3">
            <ChoiceCards
              value={preferences.sidebarHeaderBehavior}
              onChange={(value) =>
                updatePreference("sidebarHeaderBehavior", value)
              }
              choices={[
                {
                  id: "fixed",
                  label: "Pinned",
                  detail: "Keep navigation in view",
                },
                {
                  id: "scroll",
                  label: "Scroll with page",
                  detail: "Move with page content",
                },
                {
                  id: "hide-on-scroll",
                  label: "Auto-hide",
                  detail: "Hide while scrolling down",
                },
              ]}
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
        <SettingToggle
          label="Show sidebar on mobile"
          description="Keep the selected navigation position visible on narrow screens."
          checked={preferences.showSidebarOnMobile}
          onChange={(value) => updatePreference("showSidebarOnMobile", value)}
        />
        <SettingToggle
          label="Hide sidebar"
          description="Allow the sidebar to be hidden and restored with Ctrl+B or the screen-edge button."
          checked={preferences.hideSidebar}
          onChange={(value) => updatePreference("hideSidebar", value)}
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
