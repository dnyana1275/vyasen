import { createFileRoute } from "@tanstack/react-router";
import {
  Check,
  Moon,
  Palette,
  School,
  ShieldCheck,
  Sun,
  UsersRound,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { schoolRoles, type SchoolRole } from "@school-sms/contracts";
import {
  useTheme,
  type AccentColor,
  type ColorMode,
} from "@/providers/theme-provider";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsPage,
});

const tabs = [
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "school", label: "School profile", icon: School },
  { id: "roles", label: "Roles & access", icon: UsersRound },
  { id: "security", label: "Security", icon: ShieldCheck },
] as const;

const accents: { id: AccentColor; label: string; color: string }[] = [
  { id: "indigo", label: "Indigo", color: "#818cf8" },
  { id: "ocean", label: "Ocean", color: "#38bdf8" },
  { id: "rose", label: "Rose", color: "#fb7185" },
  { id: "emerald", label: "Emerald", color: "#34d399" },
];

const roleNames: Record<SchoolRole, string> = {
  admin: "Administrator",
  principal: "Principal",
  teacher: "Teacher",
  student: "Student",
};

function SettingsPage() {
  const [activeTab, setActiveTab] =
    useState<(typeof tabs)[number]["id"]>("appearance");
  const { colorMode, setColorMode, accent, setAccent } = useTheme();

  return (
    <div className="mx-auto max-w-5xl">
      <div>
        <p className="text-sm text-muted-foreground">Workspace preferences</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Make your school workspace feel right for your community.
        </p>
      </div>

      <div className="mt-8 border-b border-border">
        <div
          role="tablist"
          aria-label="Settings sections"
          className="flex gap-1 overflow-x-auto"
        >
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              id={`settings-tab-${id}`}
              aria-controls={`settings-panel-${id}`}
              aria-selected={activeTab === id}
              onClick={() => setActiveTab(id)}
              className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium transition-colors ${
                activeTab === id
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "appearance" && (
        <section
          role="tabpanel"
          id="settings-panel-appearance"
          aria-labelledby="settings-tab-appearance"
          className="space-y-6 py-7"
        >
          <div>
            <h2 className="text-lg font-semibold">Appearance</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose a display mode and accent color for your workspace.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
            <h3 className="text-sm font-semibold">Display mode</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(
                [
                  {
                    id: "light",
                    label: "Light",
                    icon: Sun,
                    note: "A bright, clear workspace.",
                  },
                  {
                    id: "dark",
                    label: "Dark",
                    icon: Moon,
                    note: "A softer experience in low light.",
                  },
                ] as {
                  id: ColorMode;
                  label: string;
                  icon: typeof Sun;
                  note: string;
                }[]
              ).map(({ id, label, icon: Icon, note }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setColorMode(id)}
                  aria-pressed={colorMode === id}
                  className={`flex items-center gap-4 rounded-xl border p-4 text-left transition-colors ${
                    colorMode === id
                      ? "border-accent bg-accent/10"
                      : "border-border bg-background hover:border-accent/50"
                  }`}
                >
                  <span className="grid size-10 place-items-center rounded-xl bg-surface text-accent">
                    <Icon size={18} />
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-semibold">{label}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {note}
                    </span>
                  </span>
                  {colorMode === id && (
                    <Check size={17} className="text-accent" />
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
            <h3 className="text-sm font-semibold">Accent color</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Personalize highlights and active controls.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {accents.map(({ id, label, color }) => (
                <button
                  key={id}
                  type="button"
                  aria-label={`${label} accent`}
                  aria-pressed={accent === id}
                  onClick={() => setAccent(id)}
                  className={`grid size-11 place-items-center rounded-full border-2 transition-transform hover:scale-105 ${
                    accent === id ? "border-foreground" : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                >
                  {accent === id && (
                    <Check size={17} className="text-slate-950" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {activeTab === "school" && (
        <section
          role="tabpanel"
          id="settings-panel-school"
          aria-labelledby="settings-tab-school"
          className="py-7"
        >
          <SettingsPanel
            title="School profile"
            description="Basic details shown across your school workspace."
            icon={School}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <ReadOnlyField label="School name" value="Greenwood Academy" />
              <ReadOnlyField
                label="Workspace address"
                value="greenwood.school.example"
              />
              <ReadOnlyField label="School year" value="2026–2027" />
              <ReadOnlyField label="Time zone" value="Asia/Kolkata" />
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              School profile editing will be available after account setup.
            </p>
          </SettingsPanel>
        </section>
      )}

      {activeTab === "roles" && (
        <section
          role="tabpanel"
          id="settings-panel-roles"
          aria-labelledby="settings-tab-roles"
          className="py-7"
        >
          <SettingsPanel
            title="Roles & access"
            description="A preview of the school roles this workspace will support."
            icon={UsersRound}
          >
            <div className="divide-y divide-border">
              {schoolRoles.map((role) => (
                <div
                  key={role}
                  className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                >
                  <div>
                    <p className="text-sm font-medium">{roleNames[role]}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {role === "admin"
                        ? "Manages school-wide settings and membership."
                        : `A dedicated workspace experience for ${roleNames[role].toLowerCase()}s.`}
                    </p>
                  </div>
                  <span className="rounded-full border border-border px-2.5 py-1 text-[10px] text-muted-foreground">
                    Planned
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-5 rounded-xl bg-background p-3 text-xs leading-relaxed text-muted-foreground">
              Role-specific access and tenant isolation are not implemented in
              this frontend-only scaffold.
            </p>
          </SettingsPanel>
        </section>
      )}

      {activeTab === "security" && (
        <section
          role="tabpanel"
          id="settings-panel-security"
          aria-labelledby="settings-tab-security"
          className="py-7"
        >
          <SettingsPanel
            title="Security"
            description="Security controls will be connected when authentication and backend services are added."
            icon={ShieldCheck}
          >
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-sm font-medium">School data isolation</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Tenant-scoped access is a backend responsibility and is not
                enforced by this static UI.
              </p>
            </div>
            <Button variant="outline" className="mt-4" disabled>
              Manage security
            </Button>
          </SettingsPanel>
        </section>
      )}
    </div>
  );
}

function SettingsPanel({
  children,
  description,
  icon: Icon,
  title,
}: {
  children: React.ReactNode;
  description: string;
  icon: typeof School;
  title: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent">
          <Icon size={18} />
        </span>
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className="mt-2 block rounded-xl border border-border bg-background px-3 py-2.5 text-sm">
        {value}
      </span>
    </label>
  );
}
