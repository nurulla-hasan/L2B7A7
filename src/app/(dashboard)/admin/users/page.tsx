import type { Metadata } from "next";
import UsersList from "./_components/user-list";

export const metadata: Metadata = {
  title: "User Management | UniPortal Admin",
  description:
    "Manage university student registrations, faculty access, roles, and account statuses efficiently with the UniPortal admin dashboard.",
  keywords: [
    "User Management",
    "Admin Portal",
    "Student Accounts",
    "Faculty Directory",
    "University Management System",
  ],
};

export default function UsersManagementPage() {
  return <UsersList />;
}
