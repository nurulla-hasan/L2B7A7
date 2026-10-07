import type { Metadata } from "next";
import CoursesList from "./_components/course-list";

export const metadata: Metadata = {
  title: "Courses Management | UniPortal Admin",
  description:
    "Create, manage, and configure university courses, syllabus materials, credit hours, and academic curriculums with the UniPortal admin dashboard.",
  keywords: [
    "Courses",
    "Course Management",
    "Academic Curriculum",
    "University Courses",
    "Credit Hours",
    "Admin Portal",
  ],
};

export default function CoursesManagementPage() {
  return <CoursesList />;
}
