"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { UserRound, LogOut, ArrowRightLeft } from "lucide-react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";

export function DashboardHeader() {
  const pathname = usePathname();

  // Dynamically determine current role context from pathname
  const role: "ADMIN" | "TEACHER" | "STUDENT" = pathname.startsWith("/teacher")
    ? "TEACHER"
    : pathname.startsWith("/student")
    ? "STUDENT"
    : "ADMIN";

  const roleConfig = {
    ADMIN: {
      name: "Dr. Golap Hasan",
      email: "admin@university.edu",
      label: "Administrator",
      badgeVariant: "admin" as const,
      profileHref: "/admin/profile",
    },
    TEACHER: {
      name: "Prof. Sarah Ahmed",
      email: "sarah.ahmed@university.edu",
      label: "Faculty Member",
      badgeVariant: "manager" as const,
      profileHref: "/teacher/profile",
    },
    STUDENT: {
      name: "Tanvir Rahman",
      email: "tanvir.2026@student.edu",
      label: "Student",
      badgeVariant: "success" as const,
      profileHref: "/student/profile",
    },
  }[role];

  const handleLogout = async () => {
    try {
      await apiClient("/auth/logout", { method: "POST" });
    } catch {
      // Ignore network errors on logout
    } finally {
      window.location.replace("/login");
    }
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-background/95 backdrop-blur-sm px-4 sm:px-6">
      <SidebarTrigger className="shrink-0" />

      {/* Role Indicator & Title */}
      <div className="flex items-center gap-2">
        <Badge variant={roleConfig.badgeVariant} className="hidden sm:inline-flex">
          {roleConfig.label}
        </Badge>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Quick Role Switcher for preview during development */}
        <div className="hidden md:flex items-center gap-1 text-xs border rounded-lg p-1 bg-muted/40">
          <ArrowRightLeft className="size-3 text-muted-foreground ml-1 mr-0.5" />
          <Link
            href="/admin/dashboard"
            className={`px-2 py-0.5 rounded font-medium transition-colors ${
              role === "ADMIN"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Admin
          </Link>
          <Link
            href="/teacher/dashboard"
            className={`px-2 py-0.5 rounded font-medium transition-colors ${
              role === "TEACHER"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Teacher
          </Link>
          <Link
            href="/student/dashboard"
            className={`px-2 py-0.5 rounded font-medium transition-colors ${
              role === "STUDENT"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Student
          </Link>
        </div>

        <ThemeToggle />

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full outline-hidden focus-visible:ring-3 focus-visible:ring-ring/50 cursor-pointer">
            <Avatar size="default">
              <AvatarImage src="/assets/fallback-avatar.png" alt={roleConfig.name} />
              <AvatarFallback>{getInitials(roleConfig.name)}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-semibold text-foreground leading-tight">
                    {roleConfig.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {roleConfig.email}
                  </p>
                  <div className="mt-1">
                    <Badge variant={roleConfig.badgeVariant} className="text-[10px] px-1.5 py-0">
                      {roleConfig.label}
                    </Badge>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem
                render={<Link href={roleConfig.profileHref} />}
                className="flex items-center gap-2 cursor-pointer"
              >
                <UserRound className="size-4" />
                Profile
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
            >
              <LogOut className="size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default DashboardHeader;
