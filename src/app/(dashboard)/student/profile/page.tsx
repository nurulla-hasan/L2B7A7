import type { Metadata } from "next";
import { StudentProfileOverview } from "./_components/student-profile-overview";

export const metadata: Metadata = {
  title: "My Profile | UniPortal",
  description:
    "Manage your student academic credentials, contact information, and security preferences.",
};

export default function StudentProfilePage() {
  return <StudentProfileOverview />;
}
