import * as React from "react";
import RoleGuard from "@/components/auth/role-guard";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RoleGuard roles={["STUDENT"]}>{children}</RoleGuard>;
}
