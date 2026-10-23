import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ColorMode = "light" | "dark";
export type AccentColor = "indigo" | "ocean" | "rose" | "emerald";

interface ThemeContextValue {
  colorMode: ColorMode;
  accent: AccentColor;
  setColorMode: (mode: ColorMode) => void;
  setAccent: (accent: AccentColor) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const colorModes: ColorMode[] = ["light", "dark"];
const accentColors: AccentColor[] = ["indigo", "ocean", "rose", "emerald"];

function readPreference<T extends string>(
  key: string,
  allowedValues: readonly T[],
  fallback: T,
): T {
  if (typeof window === "undefined") return fallback;
  const storedValue = window.localStorage.getItem(key);
  return allowedValues.find((value) => value === storedValue) ?? fallback;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [colorMode, setColorMode] = useState<ColorMode>(() =>
    readPreference("school-sms-color-mode", colorModes, "dark"),
  );
  const [accent, setAccent] = useState<AccentColor>(() =>
    readPreference("school-sms-accent", accentColors, "indigo"),
  );

  useEffect(() => {
    document.documentElement.dataset.theme = colorMode;
    window.localStorage.setItem("school-sms-color-mode", colorMode);
  }, [colorMode]);

  useEffect(() => {
    document.documentElement.dataset.accent = accent;
    window.localStorage.setItem("school-sms-accent", accent);
  }, [accent]);

  const value = useMemo(
    () => ({ colorMode, accent, setColorMode, setAccent }),
    [colorMode, accent],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
