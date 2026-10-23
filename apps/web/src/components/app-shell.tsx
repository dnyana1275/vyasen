import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Menu,
  X,
} from "lucide-react";
import type { SchoolRole } from "@school-sms/contracts";

import { roleLabels, roleNavigation } from "@/components/navigation-config";
import { ElasticScroller } from "@/components/elastic-scroller";
import { ProfileMenu } from "@/components/profile-menu";
import { SchoolSwitcher } from "@/components/school-switcher";
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
  onToggleVisibility,
  role,
}: {
  collapsed: boolean;
  horizontal: boolean;
  onNavigate?: () => void;
  onRoleChange: (role: SchoolRole) => void;
  onToggleVisibility?: () => void;
  role: SchoolRole;
}) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const { preferences } = useTheme();
  const items = roleNavigation[role];

  return (
    <>
      <SidebarHeader
        className={`flex shrink-0 items-center gap-3 px-2 ${
          horizontal
            ? "h-16 flex-row sm:px-4"
            : `h-16 ${collapsed ? "justify-center" : "sm:justify-start"}`
        }`}
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-accent text-accent-foreground shadow-lg shadow-accent/20">
          <GraduationCap size={22} />
        </span>
        <span
          className={
            horizontal
              ? "hidden min-w-0 sm:block"
              : collapsed
                ? "hidden"
                : "hidden min-w-0 sm:block"
          }
        >
          <span className="block text-sm font-bold tracking-tight">
            School SMS
          </span>
          <span className="block text-xs text-muted-foreground">
            School workspace
          </span>
        </span>
        {onToggleVisibility && (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Hide sidebar"
            className={`size-8 text-muted-foreground ${
              horizontal ? "ml-auto" : "absolute right-2 top-4"
            }`}
            onClick={onToggleVisibility}
          >
            <X size={16} />
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
                  ? "max-sm:hidden"
                  : "max-sm:hidden sm:inline";
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
            : "shrink-0 flex-col items-stretch px-1 pb-2 pt-2"
        }`}
      >
        <SchoolSwitcher compact={collapsed} />
        <ProfileMenu
          role={role}
          onRoleChange={onRoleChange}
          compact={collapsed}
        />
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
    if (!preferences.hideSidebar) setSidebarVisible(true);
  }, [preferences.hideSidebar]);

  useEffect(() => {
    if (!preferences.hideSidebar) return;
    function onKeyDown(event: KeyboardEvent) {
      if (
        event.key.toLowerCase() === "b" &&
        (event.ctrlKey || event.metaKey) &&
        !event.altKey
      ) {
        event.preventDefault();
        setSidebarVisible((visible) => !visible);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [preferences.hideSidebar]);

  useEffect(() => {
    if (preferences.sidebarHeaderBehavior !== "hide-on-scroll") {
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
  }, [preferences.sidebarHeaderBehavior]);

  const contentLayout =
    preferences.mainContentLayout === "contained"
      ? "max-w-5xl"
      : preferences.mainContentLayout === "wide"
        ? "max-w-[1440px]"
        : "max-w-none";
  const dockBase =
    position === "left"
      ? `inset-y-0 left-0 ${preferences.sidebarCollapsed ? "w-16" : "w-16 sm:w-64"}`
      : position === "right"
        ? `inset-y-0 right-0 ${preferences.sidebarCollapsed ? "w-16" : "w-16 sm:w-64"}`
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
  const behaviorPosition =
    preferences.sidebarHeaderBehavior === "scroll" ? "absolute" : "fixed";
  const dockClass = `z-40 flex ${behaviorPosition} ${dockBase} border-border bg-background/95 transition-transform duration-200 ${
    horizontal
      ? "flex-row items-center border-r-0 border-b px-2 sm:px-4"
      : `flex-col px-2 sm:px-3 ${
          position === "left" ? "border-r" : "border-r-0 border-l"
        }`
  } ${hiddenTransform} ${
    !preferences.showSidebarOnMobile && !mobileOverride ? "max-sm:hidden" : ""
  } ${!sidebarVisible ? "invisible" : ""}`;
  const contentPosition = !sidebarVisible
    ? ""
    : position === "left"
      ? preferences.sidebarCollapsed
        ? "ml-16"
        : `ml-16 sm:ml-64 ${
            !preferences.showSidebarOnMobile && !mobileOverride
              ? "max-sm:ml-0"
              : ""
          }`
      : position === "right"
        ? preferences.sidebarCollapsed
          ? "mr-16"
          : `mr-16 sm:mr-64 ${
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
              onToggleVisibility={
                preferences.hideSidebar || !preferences.showSidebarOnMobile
                  ? () => {
                      if (preferences.hideSidebar) setSidebarVisible(false);
                      if (!preferences.showSidebarOnMobile)
                        setMobileOverride(false);
                    }
                  : undefined
              }
            />
            {!horizontal && (
              <Button
                variant="ghost"
                size="icon"
                aria-label={
                  preferences.sidebarCollapsed
                    ? "Expand sidebar"
                    : "Collapse sidebar"
                }
                className={`absolute top-4 size-7 rounded-full border border-border bg-surface shadow-md ${
                  position === "right" ? "-left-3" : "-right-3"
                }`}
                onClick={toggleCollapsed}
              >
                {preferences.sidebarCollapsed ? (
                  position === "right" ? (
                    <ChevronLeft size={15} />
                  ) : (
                    <ChevronRight size={15} />
                  )
                ) : position === "right" ? (
                  <ChevronRight size={15} />
                ) : (
                  <ChevronLeft size={15} />
                )}
              </Button>
            )}
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
              onToggleVisibility={
                preferences.hideSidebar || !preferences.showSidebarOnMobile
                  ? () => {
                      if (preferences.hideSidebar) setSidebarVisible(false);
                      if (!preferences.showSidebarOnMobile)
                        setMobileOverride(false);
                    }
                  : undefined
              }
            />
          </Sidebar>
        )}

        {preferences.hideSidebar &&
          (!sidebarVisible ||
            (!preferences.showSidebarOnMobile && !mobileOverride)) && (
            <Button
              variant="secondary"
              size="icon"
              aria-label="Show sidebar"
              className={`fixed z-50 rounded-xl border border-border bg-surface shadow-lg ${
                position === "left"
                  ? "left-0 top-1/2 -translate-y-1/2"
                  : position === "right"
                    ? "right-0 top-1/2 -translate-y-1/2"
                    : position === "top"
                      ? "left-1/2 top-0 -translate-x-1/2"
                      : "bottom-0 left-1/2 -translate-x-1/2"
              }`}
              onClick={() => {
                setSidebarVisible(true);
                setMobileOverride(true);
              }}
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
