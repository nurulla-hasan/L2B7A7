"use client";

import * as React from "react";
import { SectionHeading } from "@/components/common/section-heading";
import { SearchInput } from "@/components/common/search-input";
import { FilterSelect } from "@/components/common/filter-select";
import { DataTable } from "@/components/common/data-table";
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
          <FilterSelect
            filter={filter}
            filterKey="semesterId"
            placeholder="All Semesters"
            options={[
              { label: "All Semesters", value: "all" },
              ...semesters.map((s) => ({ label: `${s.name} ${s.year}`, value: s.id })),
            ]}
            className="w-full sm:w-44"
          />

          {/* Sort Selector */}
          <FilterSelect
            filter={filter}
            filterKey="sortBy"
            placeholder="Sort by"
            options={SORT_OPTIONS}
            className="w-full sm:w-44"
          />
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
