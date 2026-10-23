import { createFileRoute } from "@tanstack/react-router";

import { AppearanceSettings } from "@/components/settings/appearance-settings";

export const Route = createFileRoute("/_authenticated/settings/appearance")({
  component: AppearanceSettings,
});
