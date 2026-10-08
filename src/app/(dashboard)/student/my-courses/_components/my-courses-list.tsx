"use client";

import Link from "next/link";
import { PlusCircle } from "lucide-react";

import { SectionHeading } from "@/components/common/section-heading";
import { DataTable } from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStateFilter } from "@/hooks";
import { useGetMyEnrollments } from "@/services";
import { getErrorMessage } from "@/lib/error";
import type { EnrollmentStatus } from "@/types";
import { myCoursesColumns } from "./my-courses-column";

const STATUS_OPTIONS: { label: string; value: EnrollmentStatus | "all" }[] = [
  { label: "All Statuses", value: "all" },
  { label: "Enrolled", value: "ENROLLED" },
  { label: "Pending Payment", value: "PENDING_PAYMENT" },
  { label: "Dropped", value: "DROPPED" },
];

export function MyCoursesList() {
  const filter = useStateFilter();

  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetMyEnrollments(filter.filters);

  const enrollments = response?.data ?? [];
  const meta = response?.meta;

  return (
    <div className="space-y-6">
      <SectionHeading
        title="My Enrolled Courses"
        description="Track your course sections, class schedules, instructors, and tuition fee statuses."
        alignment="left"
        as="h3"
      >
        <div className="flex items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <Select
            value={filter.getFilter("status")}
            onValueChange={(val) =>
              filter.updateFilter("status", !val || val === "all" ? null : val)
            }
          >
            <SelectTrigger className="w-full sm:w-38">
              <SelectValue placeholder="Status">
                {(val) =>
                  STATUS_OPTIONS.find((opt) => opt.value === val)?.label ||
                  "All Statuses"
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="end">
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button render={<Link href="/student/registration" />}>
            <PlusCircle />
            Register Courses
          </Button>
        </div>
      </SectionHeading>

      <DataTable
        columns={myCoursesColumns}
        data={enrollments}
        meta={meta}
        filter={filter}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        errorMessage={getErrorMessage(
          error,
          "Failed to load enrolled courses"
        )}
        onRetry={refetch}
      />
    </div>
  );
}

export default MyCoursesList;

