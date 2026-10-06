import {
  Award,
  BookOpen,
  BookOpenCheck,
  CalendarRange,
  ClipboardList,
  CreditCard,
  FileSpreadsheet,
  GraduationCap,
  LayoutDashboard,
  ShieldAlert,
  User,
  UserCheck,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavigationItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export const adminNavigation: NavigationItem[] = [
  {
    title: "Overview",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Users Management",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Semesters",
    href: "/admin/semesters",
    icon: CalendarRange,
  },
  {
    title: "Courses",
    href: "/admin/courses",
    icon: BookOpen,
  },
  {
    title: "Course Offerings",
    href: "/admin/course-offerings",
    icon: GraduationCap,
  },
  {
    title: "Enrollments",
    href: "/admin/enrollments",
    icon: UserCheck,
  },
  {
    title: "Payments & Fees",
    href: "/admin/payments",
    icon: CreditCard,
  },
  {
    title: "Exam Results",
    href: "/admin/results",
    icon: Award,
  },
  {
    title: "Audit Logs",
    href: "/admin/audit-logs",
    icon: ShieldAlert,
  },
];

export const teacherNavigation: NavigationItem[] = [
  {
    title: "Overview",
    href: "/teacher/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Courses",
    href: "/teacher/courses",
    icon: BookOpen,
  },
  {
    title: "Enrolled Students",
    href: "/teacher/students",
    icon: Users,
  },
  {
    title: "Grade Submissions",
    href: "/teacher/grades",
    icon: FileSpreadsheet,
  },
  {
    title: "My Profile",
    href: "/teacher/profile",
    icon: User,
  },
];

export const studentNavigation: NavigationItem[] = [
  {
    title: "Overview",
    href: "/student/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Course Registration",
    href: "/student/registration",
    icon: ClipboardList,
  },
  {
    title: "My Enrolled Courses",
    href: "/student/my-courses",
    icon: BookOpenCheck,
  },
  {
    title: "Grades & Results",
    href: "/student/results",
    icon: Award,
  },
  {
    title: "Fee Payments",
    href: "/student/payments",
    icon: CreditCard,
  },
  {
    title: "My Profile",
    href: "/student/profile",
    icon: User,
  },
];
