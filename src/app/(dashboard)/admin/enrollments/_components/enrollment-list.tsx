"use client";

import { SectionHeading } from "@/components/common/section-heading";
import { SearchInput } from "@/components/common/search-input";
import { FilterSelect } from "@/components/common/filter-select";
import { DataTable } from "@/components/common/data-table";
import { useStateFilter } from "@/hooks";
import { useGetAllEnrollments, useGetSemesters } from "@/services";
import { getErrorMessage } from "@/lib/error";
import type { EnrollmentSortBy } from "@/types";
import { enrollmentColumns } from "./enrollment-column";

const SORT_OPTIONS: { label: string; value: EnrollmentSortBy }[] = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Status (A-Z)", value: "status_asc" },
  { label: "Status (Z-A)", value: "status_desc" },
];

const STATUS_OPTIONS: { label: string; value: string }[] = [
  { label: "All Statuses", value: "all" },
  { label: "Enrolled", value: "ENROLLED" },
  { label: "Pending Payment", value: "PENDING_PAYMENT" },
  { label: "Dropped", value: "DROPPED" },
];

export default function EnrollmentList() {
  const filter = useStateFilter();

  const { data: semestersRes } = useGetSemesters({ limit: 100 });
  const semesters = semestersRes?.data ?? [];

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

  const semesterOptions = [
    { label: "All Semesters", value: "all" },
    ...semesters.map((s) => ({ label: `${s.name} ${s.year}`, value: s.id })),
  ];

  return (
    <div className="space-y-6">
      <SectionHeading
        title="Student Enrollments"
        description="Monitor course registrations, review payment status, and manage student enrollments."
        alignment="left"
        as="h3"
      />

      {/* Filters row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-xs">
          <SearchInput
            filter={filter}
            filterKey="searchTerm"
            debounce={500}
            placeholder="Search student, course, sec..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Filter */}
          <FilterSelect
            filter={filter}
            filterKey="status"
            placeholder="All Statuses"
            options={STATUS_OPTIONS}
            className="w-40"
          />

          {/* Semester Filter */}
          <FilterSelect
            filter={filter}
            filterKey="semesterId"
            placeholder="All Semesters"
            options={semesterOptions}
            className="w-40"
          />

          {/* Sort By Filter */}
          <FilterSelect
            filter={filter}
            filterKey="sortBy"
            placeholder="Sort by"
            options={SORT_OPTIONS}
            className="min-w-44"
          />
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={enrollmentColumns}
        data={enrollments}
        meta={meta}
        filter={filter}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        errorMessage={getErrorMessage(error, "Failed to load enrollments")}
        onRetry={refetch}
      />
    </div>
  );
}
