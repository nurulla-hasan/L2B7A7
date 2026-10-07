import type { Metadata } from "next";
import EnrollmentList from "./_components/enrollment-list";

export const metadata: Metadata = {
  title: "Enrollment Management | UniPortal Admin",
  description:
    "Monitor student course registrations, verify tuition payment status, and manage active enrollments with the UniPortal admin portal.",
  keywords: [
    "Enrollment Management",
    "Course Registration",
    "Payment Verification",
    "Student Roster",
    "Academic Sessions",
    "Admin Portal",
  ],
};

export default function EnrollmentsPage() {
  return <EnrollmentList />;
}
