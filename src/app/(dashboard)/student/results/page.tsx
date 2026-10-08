import type { Metadata } from "next";
import { StudentResultList } from "./_components/student-result-list";

export const metadata: Metadata = {
  title: "Academic Grades & Results | UniPortal",
  description:
    "Review your official published examination marks, letter grades, GPA, and academic transcript.",
};

export default function StudentResultsPage() {
  return <StudentResultList />;
}
