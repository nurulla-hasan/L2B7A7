"use client";

import * as React from "react";
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
import { useGetAllEnrollments, useGetSemesters } from "@/services";
import { getErrorMessage } from "@/lib/error";
import type { EnrollmentSortBy, EnrollmentStatus } from "@/types";
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
  const filter = useStateFilter<string>({
    paginationKey: "page",
    initialValues: {
      page: 1,
      limit: 10,
      sortBy: "newest",
    },
  });

  const { data: semestersRes } = useGetSemesters({ limit: 100 });
  const semesters = semestersRes?.data ?? [];

  const queryParams = React.useMemo(() => {
    const raw = filter.filters;
    return {
      page: raw.page ? Number(raw.page) : 1,
      limit: raw.limit ? Number(raw.limit) : 10,
      searchTerm: raw.searchTerm || undefined,
      semesterId: raw.semesterId || undefined,
      status: (raw.status as EnrollmentStatus) || undefined,
      sortBy: (raw.sortBy as EnrollmentSortBy) || "newest",
    };
  }, [filter.filters]);

  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetAllEnrollments(queryParams);

  const enrollments = response?.data ?? [];
  const meta = response?.meta;

  const currentSemesterValue = filter.getFilter("semesterId") || "all";
  const currentStatusValue = filter.getFilter("status") || "all";
  const currentSortValue =
    (filter.getFilter("sortBy") as EnrollmentSortBy) || "newest";

  const handleSemesterChange = (value: string | null) => {
    filter.updateFilter("semesterId", !value || value === "all" ? null : value);
  };

  const handleStatusChange = (value: string | null) => {
    filter.updateFilter("status", !value || value === "all" ? null : value);
  };

  const handleSortChange = (value: string | null) => {
    if (value) {
      filter.updateFilter("sortBy", value);
    }
  };

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
          <Select value={currentStatusValue} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-40 cursor-pointer">
              <SelectValue placeholder="Status">
                {(val) =>
                  STATUS_OPTIONS.find((opt) => opt.value === val)?.label ||
                  "All Statuses"
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="end">
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  className="cursor-pointer"
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Semester Filter */}
          <Select
            value={currentSemesterValue}
            onValueChange={handleSemesterChange}
          >
            <SelectTrigger className="w-40 cursor-pointer">
              <SelectValue placeholder="Semester">
                {(val) => {
                  if (val === "all" || !val) return "All Semesters";
                  const s = semesters.find((item) => item.id === val);
                  return s ? `${s.name} ${s.year}` : "Semester";
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="all" className="cursor-pointer">
                All Semesters
              </SelectItem>
              {semesters.map((sem) => (
                <SelectItem
                  key={sem.id}
                  value={sem.id}
                  className="cursor-pointer"
                >
                  {sem.name} {sem.year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort By Filter */}
          <Select value={currentSortValue} onValueChange={handleSortChange}>
            <SelectTrigger className="min-w-44 cursor-pointer">
              <SelectValue placeholder="Sort by">
                {(val) =>
                  SORT_OPTIONS.find((opt) => opt.value === val)?.label ||
                  "Newest First"
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="end">
              {SORT_OPTIONS.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  className="cursor-pointer"
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
