import {
  BookOpenCheck,
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Settings,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import type { SchoolRole } from "@school-sms/contracts";

export interface NavigationItem {
  label: string;
  icon: LucideIcon;
  to?: "/dashboard" | "/settings/appearance";
  shortcut?: string;
}

export const roleLabels: Record<SchoolRole, string> = {
  admin: "Administrator",
  principal: "Principal",
  teacher: "Teacher",
  student: "Student",
  hr: "HR",
};

const dashboardItem = (label = "Dashboard"): NavigationItem => ({
  label,
  icon: LayoutDashboard,
  to: "/dashboard",
  shortcut: "G D",
});

const settingsItem: NavigationItem = {
  label: "Settings",
  icon: Settings,
  to: "/settings/appearance",
};

export const roleNavigation: Record<SchoolRole, readonly NavigationItem[]> = {
  admin: [
    dashboardItem(),
    { label: "Students", icon: GraduationCap, shortcut: "G S" },
    { label: "Teachers", icon: UsersRound, shortcut: "G T" },
    { label: "Classes", icon: BookOpenCheck, shortcut: "G C" },
    settingsItem,
  ],
  principal: [
    dashboardItem(),
    { label: "Students", icon: GraduationCap, shortcut: "G S" },
    { label: "Teachers", icon: UsersRound, shortcut: "G T" },
    { label: "Classes", icon: BookOpenCheck, shortcut: "G C" },
    { label: "Attendance", icon: ClipboardCheck },
    { label: "Exams", icon: ClipboardList },
    settingsItem,
  ],
  teacher: [
    dashboardItem("Home"),
    { label: "Timetable", icon: CalendarDays, shortcut: "G T" },
    { label: "Lesson plans", icon: FileText },
    { label: "Assignments", icon: ClipboardList },
    { label: "Classes", icon: BookOpenCheck },
    settingsItem,
  ],
  student: [
    dashboardItem("Home"),
    { label: "Classes", icon: BookOpenCheck, shortcut: "G C" },
    { label: "Exams", icon: ClipboardCheck },
    { label: "Assignments", icon: ClipboardList },
    { label: "Timetable", icon: CalendarDays },
    settingsItem,
  ],
  hr: [
    dashboardItem(),
    { label: "Staff directory", icon: UsersRound },
    { label: "Recruitment", icon: ClipboardList },
    { label: "Leave & attendance", icon: CalendarDays },
    settingsItem,
  ],
};
