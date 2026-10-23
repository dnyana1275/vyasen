import { useEffect } from "react";
import { Check, Moon, Sun } from "lucide-react";

import { colorThemeIds, type UiPreferences } from "@school-sms/contracts";
import {
  ChoiceCards,
  RangeControl,
  SelectControl,
  SettingToggle,
  SettingsSection,
} from "@/components/settings/settings-controls";
import { useTheme } from "@/providers/theme-provider";

const themeDetails: Record<
  UiPreferences["colorTheme"],
  { label: string; swatch: string; detail: string }
> = {
  ocean: {
    label: "Ocean Blue",
    swatch: "#7193ff",
    detail: "Clear & confident",
  },
  midnight: {
    label: "Midnight Azure",
    swatch: "#4166d4",
    detail: "Deep blue & luminous",
  },
  lilac: {
    label: "Velvet Lilac",
    swatch: "#c18cff",
    detail: "Plum & lavender",
  },
  rose: {
    label: "Studio Rose",
    swatch: "#fb6f92",
    detail: "Expressive & warm",
  },
  ember: { label: "Ember Orange", swatch: "#ff8a34", detail: "Warm & focused" },
  sunlit: {
    label: "Sunlit Yellow",
    swatch: "#f6c945",
    detail: "Bright & optimistic",
  },
  grove: {
    label: "Grove Green",
    swatch: "#4ac28a",
    detail: "Fresh & grounded",
  },
  graphite: {
    label: "Graphite Studio",
    swatch: "#8b68ff",
    detail: "Graphite & violet",
  },
};

const displayModes = [
  {
    id: "light",
    label: "Light",
    detail: "Use a light color scheme",
    swatch: "#f4f6ff",
  },
  {
    id: "dark",
    label: "Dark",
    detail: "Use a dark color scheme",
    swatch: "#202538",
  },
  {
    id: "system",
    label: "System",
    detail: "Follow your device setting",
    swatch: "#a8b6e8",
  },
] as const;

export function AppearanceSettings() {
  const { preferences, updatePreference } = useTheme();

  useEffect(() => {
    const updateFullScreenPreference = () =>
      updatePreference("fullScreen", Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", updateFullScreenPreference);
    return () =>
      document.removeEventListener(
        "fullscreenchange",
        updateFullScreenPreference,
      );
  }, [updatePreference]);

  function toggleThemePool(theme: UiPreferences["colorTheme"]) {
    const selected = preferences.themeRotationPool.includes(theme);
    const nextPool = selected
      ? preferences.themeRotationPool.filter((item) => item !== theme)
      : [...preferences.themeRotationPool, theme];
    if (nextPool.length > 0) updatePreference("themeRotationPool", nextPool);
  }

  async function toggleFullScreen(enabled: boolean) {
    try {
      if (enabled && !document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else if (!enabled && document.fullscreenElement) {
        await document.exitFullscreen();
      }
      updatePreference("fullScreen", enabled);
    } catch (error) {
      console.warn("Could not change full-screen mode.", error);
    }
  }

  return (
    <div className="space-y-5 py-6">
      <SettingsSection
        title="Display mode"
        description="Choose a light or dark workspace, or follow your device."
      >
        <ChoiceCards
          columns={3}
          value={preferences.colorMode}
          onChange={(value) => updatePreference("colorMode", value)}
          choices={displayModes.map((mode) => ({
            ...mode,
            detail: mode.detail,
          }))}
        />
      </SettingsSection>

      <SettingsSection
        title="Color theme"
        description="Pick the color palette used by navigation, tabs, and controls."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {colorThemeIds.map((themeId) => {
            const theme = themeDetails[themeId];
            const selected = preferences.colorTheme === themeId;
            return (
              <button
                key={themeId}
                type="button"
                aria-pressed={selected}
                onClick={() => updatePreference("colorTheme", themeId)}
                className={`rounded-2xl border p-3 text-left transition-colors ${
                  selected
                    ? "border-accent bg-accent/10"
                    : "border-border bg-background hover:border-accent/50"
                }`}
              >
                <span className="flex items-center justify-between">
                  <span
                    className="grid size-8 place-items-center rounded-full"
                    style={{ backgroundColor: theme.swatch }}
                  >
                    {selected && <Check size={16} className="text-slate-950" />}
                  </span>
                  {selected && (
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-accent">
                      Selected
                    </span>
                  )}
                </span>
                <span className="mt-3 block text-sm font-semibold">
                  {theme.label}
                </span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  {theme.detail}
                </span>
              </button>
            );
          })}
        </div>
      </SettingsSection>

      <SettingsSection
        title="Theme rotation"
        description="Choose a theme at random when you open a new app session."
      >
        <SettingToggle
          label="Random theme on app open"
          description="Start each new app session with a theme from your selected pool."
          checked={preferences.themeRotationEnabled}
          onChange={(value) => updatePreference("themeRotationEnabled", value)}
        />
        {preferences.themeRotationEnabled && (
          <fieldset className="grid gap-2 border-t border-border pt-4 sm:grid-cols-2">
            <legend className="mb-2 text-sm font-medium">
              Themes in rotation
            </legend>
            {colorThemeIds.map((themeId) => (
              <label
                key={themeId}
                className="flex items-center gap-3 rounded-xl bg-background px-3 py-2.5 text-sm"
              >
                <input
                  type="checkbox"
                  checked={preferences.themeRotationPool.includes(themeId)}
                  onChange={() => toggleThemePool(themeId)}
                  disabled={
                    preferences.themeRotationPool.length === 1 &&
                    preferences.themeRotationPool.includes(themeId)
                  }
                  className="size-4 accent-accent"
                />
                <span
                  className="size-4 rounded-full"
                  style={{ backgroundColor: themeDetails[themeId].swatch }}
                />
                {themeDetails[themeId].label}
              </label>
            ))}
          </fieldset>
        )}
      </SettingsSection>

      <SettingsSection
        title="Reading mode"
        description="Shift the display tone and tune a paper-like grain."
      >
        <div className="rounded-xl border border-dashed border-border bg-background p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold">Live preview</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Preview the reading mode without applying it across the app.
              </p>
            </div>
            <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Preview only
            </span>
          </div>
          <div className="mt-4">
            <SettingToggle
              label="Preview reading mode"
              checked={preferences.readingModePreview}
              onChange={(value) =>
                updatePreference("readingModePreview", value)
              }
            />
          </div>
        </div>
        <SettingToggle
          label="Reading mode"
          description="Apply your selected temperature, texture, and colors across the application."
          checked={preferences.readingModeEnabled}
          onChange={(value) => updatePreference("readingModeEnabled", value)}
        />
        <div className="grid gap-5 border-t border-border pt-4 sm:grid-cols-2">
          <RangeControl
            label="Color temperature"
            min={0}
            max={100}
            value={preferences.readingTemperature}
            onChange={(value) => updatePreference("readingTemperature", value)}
          />
          <RangeControl
            label="Texture"
            min={0}
            max={100}
            suffix="%"
            value={preferences.readingTexture}
            onChange={(value) => updatePreference("readingTexture", value)}
          />
          <RangeControl
            label="Grain size"
            min={1}
            max={10}
            value={preferences.readingGrainSize}
            onChange={(value) => updatePreference("readingGrainSize", value)}
          />
        </div>
      </SettingsSection>

      <SettingsSection
        title="Scrollbars"
        description="Choose when scrollbars appear and how they look in content areas."
      >
        <SettingToggle
          label="Show scrollbars"
          description="Display content scrollbar controls alongside wheel, touch, and keyboard scrolling."
          checked={preferences.scrollbarVisibility === "visible"}
          onChange={(value) =>
            updatePreference(
              "scrollbarVisibility",
              value ? "visible" : "hidden",
            )
          }
        />
        <ChoiceCards
          value={preferences.scrollbarStyle}
          onChange={(value) => updatePreference("scrollbarStyle", value)}
          choices={[
            { id: "classic", label: "Classic", detail: "System scrollbar" },
            {
              id: "minimal",
              label: "Minimal",
              detail: "Slim content scrollbar",
            },
            { id: "floating", label: "Floating", detail: "Lightweight track" },
          ]}
        />
      </SettingsSection>

      <SettingsSection
        title="Elastic scroller"
        description="Customize the floating drag control for long lists."
      >
        <SettingToggle
          label="Enable elastic scroller"
          description="The drag-control preferences are saved for the scrolling shell."
          checked={preferences.elasticScrollerEnabled}
          onChange={(value) =>
            updatePreference("elasticScrollerEnabled", value)
          }
        />
        <div className="grid gap-4 border-t border-border pt-4 sm:grid-cols-2">
          <ChoiceCards
            value={preferences.elasticScrollerDepth}
            onChange={(value) =>
              updatePreference("elasticScrollerDepth", value)
            }
            choices={[
              { id: "flat", label: "Flat", detail: "Original flat control" },
              {
                id: "raised",
                label: "Raised",
                detail: "Raised control & socket",
              },
            ]}
          />
          <SelectControl
            label="Direction icon"
            value={preferences.elasticScrollerDirectionIcon}
            onChange={(value) =>
              updatePreference("elasticScrollerDirectionIcon", value)
            }
            options={[
              { value: "classic", label: "2D · Classic arrow" },
              { value: "arrow", label: "Arrow" },
              { value: "chevron", label: "Chevron" },
            ]}
          />
          <SelectControl
            label="Lock side"
            value={preferences.elasticScrollerLockSide}
            onChange={(value) =>
              updatePreference("elasticScrollerLockSide", value)
            }
            options={[
              { value: "left", label: "Left" },
              { value: "right", label: "Right" },
            ]}
          />
          <SelectControl
            label="Unlock side"
            value={preferences.elasticScrollerUnlockSide}
            onChange={(value) =>
              updatePreference("elasticScrollerUnlockSide", value)
            }
            options={[
              { value: "left", label: "Left" },
              { value: "right", label: "Right" },
            ]}
          />
        </div>
        <SettingToggle
          label="Animate direction changes"
          description="Rotate the icon when direction changes. Turn off to switch instantly."
          checked={preferences.elasticScrollerAnimateDirection}
          onChange={(value) =>
            updatePreference("elasticScrollerAnimateDirection", value)
          }
        />
        <RangeControl
          label="Hide after scrolling stops"
          min={1}
          max={10}
          suffix="s"
          value={preferences.elasticScrollerHideDelay}
          onChange={(value) =>
            updatePreference("elasticScrollerHideDelay", value)
          }
        />
      </SettingsSection>

      <SettingsSection title="Interface">
        <ChoiceCards
          value={preferences.controlRoundness}
          onChange={(value) => updatePreference("controlRoundness", value)}
          choices={[
            { id: "sharp", label: "Sharp", detail: "Crisp corners" },
            { id: "rounded", label: "Rounded", detail: "Balanced roundness" },
            { id: "pill", label: "Pill", detail: "Soft action buttons" },
          ]}
        />
        <SettingToggle
          label="Elevated surfaces"
          description="Add subtle edge light and depth to cards and navigation."
          checked={preferences.elevatedSurfaces}
          onChange={(value) => updatePreference("elevatedSurfaces", value)}
        />
        <SelectControl
          label="Shortcut key style"
          value={preferences.shortcutKeyStyle}
          onChange={(value) => updatePreference("shortcutKeyStyle", value)}
          options={[
            { value: "system", label: "Follow your system" },
            { value: "mac", label: "Command (⌘)" },
            { value: "windows", label: "Control (Ctrl)" },
          ]}
        />
        <SelectControl
          label="Page tab colors"
          value={preferences.pageTabColors}
          onChange={(value) => updatePreference("pageTabColors", value)}
          options={[
            { value: "sidebar", label: "Follow the sidebar" },
            { value: "independent", label: "Independent tab style" },
          ]}
        />
      </SettingsSection>

      <SettingsSection title="Screen">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Full screen</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Expand the app to fill your screen.
            </p>
          </div>
          <button
            type="button"
            aria-pressed={preferences.fullScreen}
            onClick={() => void toggleFullScreen(!preferences.fullScreen)}
            className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
              preferences.fullScreen
                ? "border-accent bg-accent/15 text-accent"
                : "border-border bg-background hover:bg-muted"
            }`}
          >
            {preferences.fullScreen ? "Exit full screen" : "Enter full screen"}
          </button>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Sun size={14} /> Light
          </span>
          <span className="inline-flex items-center gap-1">
            <Moon size={14} /> Dark
          </span>
          <span>·</span>
          <span>Preferences are stored in this browser.</span>
        </div>
      </SettingsSection>
    </div>
  );
}
