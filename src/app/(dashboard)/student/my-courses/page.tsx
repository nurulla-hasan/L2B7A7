import type { Metadata } from "next";
import { MyCoursesList } from "./_components/my-courses-list";

export const metadata: Metadata = {
  title: "My Enrolled Courses | UniPortal Student",
  description:
    "View and manage your registered academic courses, sections, instructors, lecture schedules, and tuition fee statuses.",
  keywords: [
    "Student Courses",
    "Course Enrollment",
    "Class Schedule",
    "Academic Portal",
    "University Courses",
  ],
};

export default function StudentMyCoursesPage() {
  return <MyCoursesList />;
}
