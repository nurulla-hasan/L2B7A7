import type { Metadata } from "next";
import CourseOfferingsList from "./_components/course-offering-list";

export const metadata: Metadata = {
  title: "Course Offerings Management | UniPortal Admin",
  description:
    "Manage semester course offerings, schedule sections, assign faculty teachers, seat capacities, and tuition fees with the UniPortal admin portal.",
  keywords: [
    "Course Offerings",
    "Section Management",
    "Faculty Assignment",
    "Seat Capacity",
    "Tuition Fee",
    "Admin Portal",
  ],
};

export default function CourseOfferingsPage() {
  return <CourseOfferingsList />;
}
