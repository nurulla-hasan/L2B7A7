"use client";

import { SectionHeading } from "@/components/common/section-heading";
import { SearchInput } from "@/components/common/search-input";
import { DataTable } from "@/components/common/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStateFilter } from "@/hooks";
import { useGetAllEnrollments, useGetCourseOfferings } from "@/services";
import { getErrorMessage } from "@/lib/error";
import type { EnrollmentSortBy } from "@/types";
import { teacherStudentsColumns } from "./teacher-students-column";

const STATUS_OPTIONS: { label: string; value: string }[] = [
  { label: "All Statuses", value: "all" },
  { label: "Enrolled", value: "ENROLLED" },
  { label: "Pending Payment", value: "PENDING_PAYMENT" },
  { label: "Dropped", value: "DROPPED" },
];

const SORT_OPTIONS: { label: string; value: EnrollmentSortBy }[] = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Status (A-Z)", value: "status_asc" },
  { label: "Status (Z-A)", value: "status_desc" },
];

export function TeacherStudentsList() {
  const filter = useStateFilter();

  // 1. Fetch teacher assigned course offerings for filter dropdown
  const { data: offeringsRes } = useGetCourseOfferings({ limit: 100 });
  const offerings = offeringsRes?.data ?? [];

  // 2. Fetch enrollments with server-side pagination, search & filters
  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetAllEnrollments(filter.filters);

  const enrollments = response?.data ?? [];
  const meta = response?.meta;

  return (
    <div className="space-y-6">
      {/* 1. Section Heading */}
      <SectionHeading
        title="Enrolled Students"
        description="View and monitor students officially enrolled in your assigned course sections."
        alignment="left"
        as="h3"
      />

      {/* 2. Filters Row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-xs">
          <SearchInput
            filter={filter}
            filterKey="searchTerm"
            debounce={500}
            placeholder="Search student, ID, email..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Course Section Filter */}
          <Select
            value={filter.getFilter("courseOfferingId")}
            onValueChange={(val) =>
              filter.updateFilter(
                "courseOfferingId",
                !val || val === "all" ? null : val
              )
            }
          >
            <SelectTrigger className="w-full sm:w-60">
              <SelectValue placeholder="All Course Sections">
                {(val) => {
                  if (!val || val === "all") return "All Course Sections";
                  const opt = offerings.find((o) => o.id === val);
                  return opt
                    ? `${opt.course.code} (Sec ${opt.section})`
                    : "All Course Sections";
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="all">All Course Sections</SelectItem>
              {offerings.map((opt) => (
                <SelectItem key={opt.id} value={opt.id}>
                  {opt.course.code} (Sec {opt.section}) • {opt.course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select
            value={filter.getFilter("status")}
            onValueChange={(val) =>
              filter.updateFilter(
                "status",
                !val || val === "all" ? null : val
              )
            }
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status">
                {(val) =>
                  STATUS_OPTIONS.find((s) => s.value === val)?.label || "All Statuses"
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

          {/* Sort Selector */}
          <Select
            value={filter.getFilter("sortBy")}
            onValueChange={(val) =>
              filter.updateFilter(
                "sortBy",
                !val || val === "newest" ? null : val
              )
            }
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Sort by">
                {(val) =>
                  SORT_OPTIONS.find((s) => s.value === val)?.label || "Sort by"
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="end">
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 3. TanStack DataTable */}
      <DataTable
        columns={teacherStudentsColumns}
        data={enrollments}
        meta={meta}
        filter={filter}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        errorMessage={getErrorMessage(
          error,
          "Failed to load enrolled students."
        )}
        onRetry={refetch}
      />
    </div>
  );
}

export default TeacherStudentsList;
