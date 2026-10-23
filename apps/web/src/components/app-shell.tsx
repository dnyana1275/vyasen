import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  BookOpenCheck,
  ChevronLeft,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Settings,
  UsersRound,
} from "lucide-react";
import type { SchoolRole } from "@school-sms/contracts";

import { ProfileMenu } from "@/components/profile-menu";
import { SchoolSwitcher } from "@/components/school-switcher";
import { Button } from "@/components/ui/button";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navigation = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Students", icon: GraduationCap, comingSoon: true },
  { label: "Teachers", icon: UsersRound, comingSoon: true },
  { label: "Classes", icon: BookOpenCheck, comingSoon: true },
  { label: "Settings", to: "/settings", icon: Settings },
] as const;

function SidebarContents({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return (
    <>
      <SidebarHeader
        className={`flex h-16 items-center gap-3 px-3 ${collapsed ? "justify-center" : ""}`}
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-accent text-accent-foreground shadow-lg shadow-accent/20">
          <GraduationCap size={22} />
        </span>
        {!collapsed && (
          <span>
            <span className="block text-sm font-bold tracking-tight">
              School SMS
            </span>
            <span className="block text-xs text-muted-foreground">
              School workspace
            </span>
          </span>
        )}
      </SidebarHeader>

      <SidebarContent>
        {!collapsed && <SidebarGroupLabel>Workspace</SidebarGroupLabel>}
        <nav aria-label="Main navigation">
          <SidebarMenu>
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = "to" in item && pathname === item.to;
              const collapsedClass = collapsed ? "justify-center px-0" : "";
              const content = (
                <>
                  <Icon size={18} />
                  {!collapsed && <span>{item.label}</span>}
                  {!collapsed && "comingSoon" in item && item.comingSoon && (
                    <span className="ml-auto rounded-full bg-surface px-2 py-0.5 text-[10px] text-muted-foreground">
                      Soon
                    </span>
                  )}
                </>
              );

              if ("to" in item) {
                return (
                  <SidebarMenuItem key={item.label}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton
                          asChild
                          active={isActive}
                          className={collapsedClass}
                        >
                          <Link to={item.to} onClick={onNavigate}>
                            {content}
                          </Link>
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      {collapsed && (
                        <TooltipContent side="right">
                          {item.label}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </SidebarMenuItem>
                );
              }

              return (
                <SidebarMenuItem key={item.label}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton
                        type="button"
                        disabled
                        aria-label={`${item.label}, coming soon`}
                        className={`${collapsedClass} cursor-not-allowed opacity-60`}
                      >
                        {content}
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    {collapsed && (
                      <TooltipContent side="right">
                        {item.label} · Coming soon
                      </TooltipContent>
                    )}
                  </Tooltip>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </nav>
      </SidebarContent>
      {!collapsed && (
        <SidebarFooter className="rounded-2xl border border-border bg-surface p-3">
          <p className="text-xs font-semibold">Built for your school</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            A shared workspace for every member of your community.
          </p>
        </SidebarFooter>
      )}
    </>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [role, setRole] = useState<SchoolRole>("admin");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TooltipProvider delayDuration={300}>
        <Sidebar
          className={`fixed inset-y-0 left-0 z-30 hidden border-r-0 bg-background/95 px-3 pb-4 transition-[width] duration-200 lg:flex ${
            collapsed ? "w-20" : "w-64"
          }`}
        >
          <SidebarContents collapsed={collapsed} />
          <Button
            variant="ghost"
            size="icon"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="absolute -right-3 top-5 size-7 rounded-full border border-border bg-surface shadow-md"
            onClick={() => setCollapsed((value) => !value)}
          >
            {collapsed ? <Menu size={15} /> : <ChevronLeft size={15} />}
          </Button>
        </Sidebar>

        <div className={collapsed ? "lg:pl-20" : "lg:pl-64"}>
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-xl sm:px-6">
            <div className="flex min-w-0 items-center gap-2">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    aria-label="Open navigation"
                  >
                    <Menu size={19} />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetTitle className="sr-only">School navigation</SheetTitle>
                  <SheetDescription className="sr-only">
                    Navigate the school workspace.
                  </SheetDescription>
                  <Sidebar className="h-full border-0 bg-transparent p-0 pr-2 shadow-none">
                    <SidebarContents
                      collapsed={false}
                      onNavigate={() => setMobileOpen(false)}
                    />
                  </Sidebar>
                </SheetContent>
              </Sheet>
              <SchoolSwitcher />
            </div>
            <div className="flex shrink-0 items-center gap-1 sm:gap-3">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Notifications"
                className="relative hidden sm:inline-flex"
              >
                <Bell size={18} />
                <span className="absolute right-2 top-2 size-2 rounded-full bg-accent" />
              </Button>
              <ProfileMenu role={role} onRoleChange={setRole} />
            </div>
          </header>
          <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-[1440px] px-4 py-7 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </TooltipProvider>
    </div>
  );
}
