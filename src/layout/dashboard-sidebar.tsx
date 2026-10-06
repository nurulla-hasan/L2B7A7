"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LogOut } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/common/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  adminNavigation,
  teacherNavigation,
  studentNavigation,
  type NavigationItem,
} from "@/constants/nav-links";

export function DashboardSidebar() {
  const pathname = usePathname();

  // Determine role based on route pathname
  const role: "ADMIN" | "TEACHER" | "STUDENT" = pathname.startsWith("/teacher")
    ? "TEACHER"
    : pathname.startsWith("/student")
    ? "STUDENT"
    : "ADMIN";

  const roleMeta = {
    ADMIN: {
      portalTitle: "Admin Portal",
      badgeVariant: "admin" as const,
      navItems: adminNavigation,
    },
    TEACHER: {
      portalTitle: "Faculty Portal",
      badgeVariant: "manager" as const,
      navItems: teacherNavigation,
    },
    STUDENT: {
      portalTitle: "Student Portal",
      badgeVariant: "success" as const,
      navItems: studentNavigation,
    },
  }[role];

  const isItemActive = (item: NavigationItem) => {
    // If it's a dashboard root like /admin/dashboard
    if (
      item.href === "/admin/dashboard" ||
      item.href === "/teacher/dashboard" ||
      item.href === "/student/dashboard"
    ) {
      return pathname === item.href;
    }
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-16 border-b px-4 flex flex-row items-center justify-between">
        <Logo size="md" showText showTextOnMobile />
        <Badge
          variant={roleMeta.badgeVariant}
          className="group-data-[collapsible=icon]:hidden text-[10px] tracking-wide uppercase font-semibold"
        >
          {role}
        </Badge>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
            {roleMeta.portalTitle}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {roleMeta.navItems.map((item) => {
                const active = isItemActive(item);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      size="md"
                      isActive={active}
                      tooltip={item.title}
                      render={<Link href={item.href} />}
                    >
                      <item.icon className="size-4 shrink-0" />
                      <span className="truncate">{item.title}</span>
                      {item.badge && (
                        <span className="ml-auto text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono group-data-[collapsible=icon]:hidden">
                          {item.badge}
                        </span>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-3">
        <Button
          variant="outline"
          size="sm"
          // onClick={handleLogout}
          className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
        >
          <LogOut className="size-4 shrink-0" />
          <span className="group-data-[collapsible=icon]:hidden">Sign Out</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

export default DashboardSidebar;
