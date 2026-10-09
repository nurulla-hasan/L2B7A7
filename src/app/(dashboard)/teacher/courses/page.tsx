import type { Metadata } from "next";
import { TeacherCoursesList } from "./_components/teacher-courses-list";

export const metadata: Metadata = {
  title: "My Teaching Courses | Faculty Portal",
  description:
    "Review assigned academic courses, enrolled student capacity, section schedules, and grading rosters.",
};

export default function TeacherCoursesPage() {
  return <TeacherCoursesList />;
}
