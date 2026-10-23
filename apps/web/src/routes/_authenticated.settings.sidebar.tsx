import { createFileRoute } from "@tanstack/react-router";

import { SidebarSettings } from "@/components/settings/sidebar-settings";

export const Route = createFileRoute("/_authenticated/settings/sidebar")({
  component: SidebarSettings,
});
