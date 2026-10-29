import {
  LayoutDashboard,
  UsersRound,
  GraduationCap,
  BookOpen,
  ClipboardCheck,
  Wallet,
  BarChart3,
  Settings2,
  Workflow,
  CalendarDays,
  type LucideIcon,
} from "lucide-react";

export type ModuleDefinition = {
  slug: string;
  label: string;
  description: string;
  icon: LucideIcon;
  group: "Workspace" | "School management" | "Platform";
};

export const modules: ModuleDefinition[] = [
  {
    slug: "dashboard",
    label: "Overview",
    description: "Your school at a glance",
    icon: LayoutDashboard,
    group: "Workspace",
  },
  {
    slug: "students",
    label: "Students",
    description: "Admissions, student profiles and guardian relationships",
    icon: UsersRound,
    group: "School management",
  },
  {
    slug: "teachers",
    label: "Teachers",
    description: "Teaching staff, profiles and assignments",
    icon: GraduationCap,
    group: "School management",
  },
  {
    slug: "academics",
    label: "Academics",
    description: "Classes, sessions, subjects and examinations",
    icon: BookOpen,
    group: "School management",
  },
  {
    slug: "attendance",
    label: "Attendance",
    description: "Student and staff attendance registers",
    icon: ClipboardCheck,
    group: "School management",
  },
  {
    slug: "fees",
    label: "Fees & finance",
    description: "Fee structures, invoices, receipts and accounting",
    icon: Wallet,
    group: "School management",
  },
  {
    slug: "calendar",
    label: "Calendar",
    description: "School events, holidays and schedules",
    icon: CalendarDays,
    group: "School management",
  },
  {
    slug: "reports",
    label: "Reports",
    description: "School performance and financial reporting",
    icon: BarChart3,
    group: "School management",
  },
  {
    slug: "automations",
    label: "Automations",
    description: "n8n workflows, message templates and delivery logs",
    icon: Workflow,
    group: "Platform",
  },
  {
    slug: "settings",
    label: "Settings",
    description: "Workspace appearance and integration readiness",
    icon: Settings2,
    group: "Platform",
  },
];
