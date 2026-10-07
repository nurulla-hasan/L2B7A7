import type { Metadata } from "next";
import SemestersList from "./_components/semester-list";

export const metadata: Metadata = {
  title: "Semesters Management | UniPortal Admin",
  description:
    "Manage university academic terms, calendar schedules, session start and end dates efficiently with the UniPortal admin portal.",
  keywords: [
    "Semesters",
    "Academic Terms",
    "University Schedule",
    "Session Dates",
    "Admin Portal",
  ],
};

export default function SemestersManagementPage() {
  return <SemestersList />;
}
