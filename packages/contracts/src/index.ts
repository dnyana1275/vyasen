import { z } from "zod";

export const schoolRoles = [
  "admin",
  "principal",
  "teacher",
  "student",
  "hr",
] as const;

export const schoolRoleSchema = z.enum(schoolRoles);

export type SchoolRole = z.infer<typeof schoolRoleSchema>;

export {
  appearancePreferenceSchema,
  colorThemeIds,
  colorThemeSchema,
  defaultUiPreferences,
  sidebarPreferenceSchema,
  uiPreferencesSchema,
} from "./preferences";
export type {
  AppearancePreferences,
  SidebarPreferences,
  UiPreferences,
} from "./preferences";
