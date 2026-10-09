import type { Metadata } from "next";
import { Suspense } from "react";
import { TeacherProfileOverview } from "./_components/teacher-profile-overview";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Faculty Profile & Settings | Faculty Portal",
  description:
    "Manage your faculty profile information, academic credentials, and account security preferences.",
};

export default function TeacherProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <Skeleton className="h-10 w-72" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-1">
              <Skeleton className="h-72 w-full rounded-xl" />
              <Skeleton className="h-60 w-full rounded-xl" />
            </div>
            <div className="space-y-6 lg:col-span-2">
              <Skeleton className="h-80 w-full rounded-xl" />
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>
          </div>
        </div>
      }
    >
      <TeacherProfileOverview />
    </Suspense>
  );
}
