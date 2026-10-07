import * as React from "react";
import RoleGuard from "@/components/auth/role-guard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RoleGuard roles={["ADMIN"]}>{children}</RoleGuard>;
}
