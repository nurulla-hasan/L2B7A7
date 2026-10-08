import type { Metadata } from "next";
import CourseRegistrationList from "./_components/course-registration-list";

export const metadata: Metadata = {
  title: "Course Registration | Student Portal",
  description:
    "Browse available course offerings for the current academic session and register online.",
};

export default function StudentRegistrationPage() {
  return <CourseRegistrationList />;
}
