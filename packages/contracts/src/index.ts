import { z } from "zod";

export const schoolRoles = [
  "admin",
  "principal",
  "teacher",
  "student",
] as const;

export const schoolRoleSchema = z.enum(schoolRoles);

export type SchoolRole = z.infer<typeof schoolRoleSchema>;
