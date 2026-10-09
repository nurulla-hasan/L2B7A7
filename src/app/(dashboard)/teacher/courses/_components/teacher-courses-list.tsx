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
import { useGetCourseOfferings, useGetSemesters } from "@/services";
import { getErrorMessage } from "@/lib/error";
import type { CourseOfferingSortBy } from "@/types";
import { teacherCoursesColumns } from "./teacher-courses-column";

const SORT_OPTIONS: { label: string; value: CourseOfferingSortBy }[] = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Capacity (High to Low)", value: "capacity_desc" },
  { label: "Capacity (Low to High)", value: "capacity_asc" },
  { label: "Fee (High to Low)", value: "fee_desc" },
  { label: "Fee (Low to High)", value: "fee_asc" },
];

export function TeacherCoursesList() {
  const filter = useStateFilter();

  // Load semester choices for dropdown filter
  const { data: semestersRes } = useGetSemesters({ limit: 100 });
  const semesters = semestersRes?.data ?? [];

  // Load assigned course offerings
  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetCourseOfferings(filter.filters);

  const offerings = response?.data ?? [];
  const meta = response?.meta;

  return (
    <div className="space-y-6">
      {/* 1. Section Heading */}
      <SectionHeading
        title="My Teaching Courses"
        description="View and manage all course sections assigned to you across academic semesters."
        alignment="left"
        as="h3"
      />

      {/* 2. Search & Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-xs">
          <SearchInput
            filter={filter}
            filterKey="searchTerm"
            debounce={500}
            placeholder="Search by course, code, section..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Semester Filter */}
          <Select
            value={filter.getFilter("semesterId")}
            onValueChange={(val) =>
              filter.updateFilter(
                "semesterId",
                !val || val === "all" ? null : val
              )
            }
          >
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Semester">
                {(val) => {
                  if (!val || val === "all") return "All Semesters";
                  const found = semesters.find((s) => s.id === val);
                  return found ? `${found.name} ${found.year}` : "All Semesters";
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="all">All Semesters</SelectItem>
              {semesters.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name} {s.year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort Selector */}
          <Select
            value={filter.getFilter("sortBy")}
            onValueChange={(val) =>
              filter.updateFilter("sortBy", !val || val === "newest" ? null : val)
            }
          >
            <SelectTrigger className="w-full sm:w-44">
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

      {/* 4. TanStack DataTable */}
      <DataTable
        columns={teacherCoursesColumns}
        data={offerings}
        meta={meta}
        filter={filter}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        errorMessage={getErrorMessage(
          error,
          "Failed to load assigned teaching courses."
        )}
        onRetry={refetch}
      />
    </div>
  );
}

export default TeacherCoursesList;
