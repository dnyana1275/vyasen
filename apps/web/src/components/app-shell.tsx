import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  GraduationCap,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Settings,
} from "lucide-react";
import type { SchoolRole } from "@school-sms/contracts";

import { roleLabels, roleNavigation } from "@/components/navigation-config";
import { ElasticScroller } from "@/components/elastic-scroller";
import { ProfileMenu } from "@/components/profile-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "@/providers/theme-provider";

type SidebarPosition = "left" | "right" | "top" | "bottom";

function SidebarContents({
  collapsed,
  horizontal,
  onNavigate,
  onRoleChange,
  onToggleCollapsed,
  role,
  position,
}: {
  collapsed: boolean;
  horizontal: boolean;
  onNavigate?: () => void;
  onRoleChange: (role: SchoolRole) => void;
  onToggleCollapsed: () => void;
  role: SchoolRole;
  position: SidebarPosition;
}) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const { preferences } = useTheme();
  const items = roleNavigation[role];

  return (
    <>
      <SidebarHeader
        className={`group relative flex h-16 shrink-0 items-center gap-3 px-2 ${
          horizontal
            ? "flex-row sm:px-4"
            : collapsed
              ? "justify-center"
              : "justify-between"
        }`}
      >
        <span
          className={`flex min-w-0 items-center gap-2 ${
            collapsed
              ? "group-hover:invisible group-focus-within:invisible"
              : ""
          }`}
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-accent text-accent-foreground shadow-lg shadow-accent/20">
            {collapsed && !horizontal ? (
              <span className="text-lg font-bold">S</span>
            ) : (
              <GraduationCap size={22} />
            )}
          </span>
          {(!collapsed || horizontal) && (
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold tracking-tight">
                School SMS
              </span>
              {!horizontal && (
                <span className="block text-xs text-muted-foreground">
                  School workspace
                </span>
              )}
            </span>
          )}
        </span>
        {!horizontal && (
          <Button
            variant="ghost"
            size="icon"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
            className={`size-8 shrink-0 text-muted-foreground ${
              collapsed
                ? "absolute right-2 hidden group-hover:inline-flex group-focus-within:inline-flex"
                : ""
            }`}
            onClick={onToggleCollapsed}
          >
            {position === "right" ? (
              collapsed ? (
                <PanelRightOpen size={17} />
              ) : (
                <PanelRightClose size={17} />
              )
            ) : collapsed ? (
              <PanelLeftOpen size={17} />
            ) : (
              <PanelLeftClose size={17} />
            )}
          </Button>
        )}
      </SidebarHeader>

      <SidebarContent
        className={
          horizontal
            ? "flex min-w-0 flex-1 flex-row items-center overflow-x-auto overflow-y-hidden px-1"
            : "flex min-h-0 flex-1 flex-col overflow-y-auto px-1"
        }
      >
        {!collapsed && !horizontal && (
          <SidebarGroupLabel className="max-sm:hidden">
            Workspace · {roleLabels[role]}
          </SidebarGroupLabel>
        )}
        <nav
          aria-label={`${role} navigation`}
          className={horizontal ? "min-w-0 flex-1" : ""}
        >
          <SidebarMenu
            className={
              horizontal
                ? "flex w-max min-w-full flex-row items-center gap-1.5"
                : "flex-col"
            }
          >
            {items.map((item, index) => {
              const Icon = item.icon;
              const isActive = item.to
                ? pathname === item.to ||
                  (item.to === "/settings/appearance" &&
                    pathname.startsWith("/settings"))
                : false;
              const iconColor =
                preferences.sidebarIconStyle === "multicolor"
                  ? [
                      "#60a5fa",
                      "#c084fc",
                      "#34d399",
                      "#fbbf24",
                      "#fb7185",
                      "#22d3ee",
                      "#a3e635",
                    ][index % 7]
                  : preferences.sidebarIconColor;
              const iconStyle = {
                color: isActive ? undefined : iconColor,
              } satisfies CSSProperties;
              const labelClass = horizontal
                ? "inline"
                : collapsed
                  ? "hidden"
                  : "inline";
              const buttonClass = horizontal
                ? "w-auto shrink-0 px-3"
                : collapsed
                  ? "justify-center px-0"
                  : "max-sm:justify-center max-sm:px-0";
              const shortcut = preferences.showKeyboardShortcuts
                ? item.shortcut
                : undefined;
              const shortcutPrefix =
                preferences.shortcutKeyStyle === "mac" ||
                (preferences.shortcutKeyStyle === "system" &&
                  navigator.platform.toLowerCase().includes("mac"))
                  ? "⌘"
                  : "Ctrl";
              const shortcutLabel = shortcut
                ? `${shortcutPrefix} ${shortcut}`
                : undefined;

              const content = (
                <>
                  <Icon size={18} style={iconStyle} />
                  <span className={labelClass}>{item.label}</span>
                  {shortcutLabel && !horizontal && !collapsed && (
                    <span className="ml-auto hidden rounded-md bg-background/70 px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline">
                      {shortcutLabel}
                    </span>
                  )}
                  {!item.to && !collapsed && !horizontal && (
                    <span className="ml-auto hidden rounded-full bg-surface px-2 py-0.5 text-[10px] text-muted-foreground sm:inline">
                      Soon
                    </span>
                  )}
                </>
              );

              return (
                <SidebarMenuItem
                  key={item.label}
                  className={horizontal ? "w-auto shrink-0" : ""}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {item.to ? (
                        <SidebarMenuButton
                          asChild
                          active={isActive}
                          className={`${buttonClass} ${
                            preferences.elevatedSidebarMenus
                              ? "shadow-sm shadow-black/10"
                              : ""
                          }`}
                        >
                          <Link to={item.to} onClick={onNavigate}>
                            {content}
                          </Link>
                        </SidebarMenuButton>
                      ) : (
                        <SidebarMenuButton
                          type="button"
                          disabled
                          aria-label={`${item.label}, coming soon`}
                          className={`${buttonClass} cursor-not-allowed opacity-70`}
                        >
                          {content}
                        </SidebarMenuButton>
                      )}
                    </TooltipTrigger>
                    {(collapsed || horizontal) && (
                      <TooltipContent
                        side={
                          horizontal
                            ? preferences.sidebarPosition === "bottom"
                              ? "top"
                              : "bottom"
                            : preferences.sidebarPosition === "right"
                              ? "left"
                              : "right"
                        }
                      >
                        {item.label}
                        {shortcutLabel ? ` · ${shortcutLabel}` : ""}
                        {!item.to ? " · Coming soon" : ""}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </nav>
      </SidebarContent>

      <SidebarFooter
        className={`flex gap-2 ${
          horizontal
            ? "ml-auto h-16 shrink-0 flex-row items-center px-2 sm:px-4"
            : "mt-auto shrink-0 flex-col items-stretch px-1 pb-2 pt-2"
        }`}
      >
        <ProfileMenu
          role={role}
          onRoleChange={onRoleChange}
          compact={collapsed || horizontal}
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to="/settings/appearance"
              aria-label="Settings"
              onClick={onNavigate}
              className={`flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                collapsed || horizontal ? "justify-center px-0" : ""
              } ${
                pathname.startsWith("/settings")
                  ? "bg-accent/15 text-accent"
                  : "text-muted-foreground"
              }`}
            >
              <Settings size={18} />
              {!collapsed && !horizontal && (
                <span>Settings</span>
              )}
            </Link>
          </TooltipTrigger>
          {(collapsed || horizontal) && (
            <TooltipContent
              side={
                horizontal
                  ? position === "bottom"
                    ? "top"
                    : "bottom"
                  : position === "right"
                    ? "left"
                    : "right"
              }
            >
              Settings
            </TooltipContent>
          )}
        </Tooltip>
      </SidebarFooter>
    </>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { preferences, updatePreference } = useTheme();
  const [role, setRole] = useState<SchoolRole>("admin");
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [mobileOverride, setMobileOverride] = useState(false);
  const [dockHidden, setDockHidden] = useState(false);
  const horizontal =
    preferences.sidebarPosition === "top" ||
    preferences.sidebarPosition === "bottom";
  const position = preferences.sidebarPosition as SidebarPosition;

  useEffect(() => {
    setSidebarVisible(true);
    setMobileOverride(false);
    setDockHidden(false);
  }, [position]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (
        event.key.toLowerCase() === "b" &&
        (event.ctrlKey || event.metaKey) &&
        !event.altKey
      ) {
        event.preventDefault();
        if (horizontal) {
          setSidebarVisible((visible) => !visible);
        } else {
          updatePreference("sidebarCollapsed", !preferences.sidebarCollapsed);
        }
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    horizontal,
    preferences.sidebarCollapsed,
    updatePreference,
  ]);

  useEffect(() => {
    if (!horizontal) {
      setDockHidden(false);
      return;
    }
    let lastScrollY = window.scrollY;
    function onScroll() {
      const currentY = window.scrollY;
      if (currentY < 80 || currentY < lastScrollY - 4) setDockHidden(false);
      else if (currentY > lastScrollY + 4) setDockHidden(true);
      lastScrollY = currentY;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [horizontal]);

  const contentLayout =
    preferences.mainContentLayout === "contained"
      ? "max-w-5xl"
      : preferences.mainContentLayout === "wide"
        ? "max-w-[1440px]"
        : "max-w-none";
  const dockBase =
    position === "left"
      ? `inset-y-0 left-0 ${preferences.sidebarCollapsed ? "w-16" : "w-64"}`
      : position === "right"
        ? `inset-y-0 right-0 ${preferences.sidebarCollapsed ? "w-16" : "w-64"}`
        : position === "top"
          ? "inset-x-0 top-0 h-16 flex-row"
          : "inset-x-0 bottom-0 h-16 flex-row";
  const hiddenTransform = dockHidden
    ? position === "left"
      ? "-translate-x-full"
      : position === "right"
        ? "translate-x-full"
        : position === "top"
          ? "-translate-y-full"
          : "translate-y-full"
    : "";
  const dockClass = `z-40 flex fixed ${dockBase} border-border bg-background/95 transition-transform duration-200 ${
    horizontal
      ? "flex-row items-center border-r-0 border-b px-2 sm:px-4"
      : `flex-col px-2 sm:px-3 ${
          position === "left" ? "border-r" : "border-r-0 border-l"
        }`
  } ${hiddenTransform} ${
    !preferences.showSidebarOnMobile && !mobileOverride ? "max-sm:hidden" : ""
  } ${!sidebarVisible ? "invisible" : ""}`;
  const contentPosition = horizontal && !sidebarVisible
    ? ""
    : position === "left"
      ? preferences.sidebarCollapsed
        ? "ml-16"
        : `ml-64 max-sm:ml-0 ${
            !preferences.showSidebarOnMobile && !mobileOverride
              ? "max-sm:ml-0"
              : ""
          }`
      : position === "right"
        ? preferences.sidebarCollapsed
          ? "mr-16"
          : `mr-64 max-sm:mr-0 ${
              !preferences.showSidebarOnMobile && !mobileOverride
                ? "max-sm:mr-0"
                : ""
            }`
        : position === "top"
          ? `pt-16 ${
              !preferences.showSidebarOnMobile && !mobileOverride
                ? "max-sm:pt-0"
                : ""
            }`
          : `pb-16 ${
              !preferences.showSidebarOnMobile && !mobileOverride
                ? "max-sm:pb-0"
                : ""
            }`;

  function toggleCollapsed() {
    updatePreference("sidebarCollapsed", !preferences.sidebarCollapsed);
  }

  return (
    <div
      className={`min-h-screen bg-background text-foreground ${
        position === "bottom" ? "flex flex-col" : ""
      }`}
      data-sidebar-position={position}
    >
      <TooltipProvider delayDuration={300}>
        {position !== "bottom" && (
          <Sidebar
            aria-label="School workspace navigation"
            aria-hidden={!sidebarVisible || dockHidden}
            inert={!sidebarVisible || dockHidden}
            className={dockClass}
          >
            <SidebarContents
              collapsed={!horizontal && preferences.sidebarCollapsed}
              horizontal={horizontal}
              role={role}
              onRoleChange={setRole}
              onNavigate={() => setMobileOverride(false)}
              onToggleCollapsed={toggleCollapsed}
              position={position}
            />
          </Sidebar>
        )}

        <div
          className={`${contentPosition} ${position === "bottom" ? "order-1" : ""}`}
        >
          <main
            className={`mx-auto min-h-screen ${contentLayout} px-4 py-7 sm:px-6 lg:px-8`}
          >
            {children}
          </main>
        </div>

        {position === "bottom" && (
          <Sidebar
            aria-label="School workspace navigation"
            aria-hidden={!sidebarVisible || dockHidden}
            inert={!sidebarVisible || dockHidden}
            className={`${dockClass} order-2`}
          >
            <SidebarContents
              collapsed={false}
              horizontal
              role={role}
              onRoleChange={setRole}
              onNavigate={() => setMobileOverride(false)}
              onToggleCollapsed={toggleCollapsed}
              position={position}
            />
          </Sidebar>
        )}

        {horizontal && !sidebarVisible && (
          <Button
            variant="secondary"
            size="icon"
            aria-label="Show sidebar"
            className={`fixed z-50 rounded-xl border border-border bg-surface shadow-lg ${
              position === "top"
                ? "left-1/2 top-0 -translate-x-1/2"
                : "bottom-0 left-1/2 -translate-x-1/2"
            }`}
            onClick={() => setSidebarVisible(true)}
          >
            <Menu size={17} />
          </Button>
        )}

        {!preferences.showSidebarOnMobile && sidebarVisible && (
          <Button
            variant="secondary"
            size="icon"
            aria-label="Open navigation"
            className={`fixed z-50 size-10 border border-border bg-surface shadow-lg sm:hidden ${
              position === "left"
                ? "left-0 top-1/2 -translate-y-1/2"
                : position === "right"
                  ? "right-0 top-1/2 -translate-y-1/2"
                  : position === "top"
                    ? "left-1/2 top-0 -translate-x-1/2"
                    : "bottom-0 left-1/2 -translate-x-1/2"
            }`}
            onClick={() => setMobileOverride((open) => !open)}
          >
            <Menu size={17} />
          </Button>
        )}
        <ElasticScroller />
      </TooltipProvider>
    </div>
  );
}
