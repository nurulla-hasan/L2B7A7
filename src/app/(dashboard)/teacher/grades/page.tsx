import type { Metadata } from "next";
import { TeacherGradesList } from "./_components/teacher-grades-list";

export const metadata: Metadata = {
  title: "Grade Submissions | Faculty Portal",
  description:
    "Evaluate student performance, enter examination marks, and publish grades.",
};

export default function TeacherGradesPage() {
  return <TeacherGradesList />;
}
