import type { Metadata } from "next";
import AuditList from "./_components/audit-list";

export const metadata: Metadata = {
  title: "Audit Logs & Security Trail | UniPortal Admin",
  description:
    "Review immutable system audit logs, track administrative operations, grade updates, and financial activity.",
  keywords: [
    "Audit Logs",
    "Security Trail",
    "System Activity",
    "Administrative Events",
    "Admin Portal",
  ],
};

export default function AuditLogsPage() {
  return <AuditList />;
}
