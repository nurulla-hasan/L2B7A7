import type { Metadata } from "next";
import { Suspense } from "react";
import { TeacherStudentsList } from "./_components/teacher-students-list";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Enrolled Students | Faculty Portal",
  description: "Monitor and review students officially enrolled in your assigned teaching sections.",
};

export default function TeacherStudentsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <Skeleton className="h-10 w-72" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      }
    >
      <TeacherStudentsList />
    </Suspense>
  );
}
