"use client";

import { SectionHeading } from "@/components/common/section-heading";
import { SearchInput } from "@/components/common/search-input";
import { FilterSelect } from "@/components/common/filter-select";
import { DataTable } from "@/components/common/data-table";
import { useStateFilter } from "@/hooks";
import {
  useGetCourseOfferings,
  useGetSemesters,
  useGetCourses,
} from "@/services";
import { getErrorMessage } from "@/lib/error";
import type { CourseOfferingSortBy } from "@/types";
import { courseOfferingColumns } from "./course-offering-column";
import { CourseOfferingModal } from "./course-offering-modal";

const SORT_OPTIONS: { label: string; value: CourseOfferingSortBy }[] = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Fee (High to Low)", value: "fee_desc" },
  { label: "Fee (Low to High)", value: "fee_asc" },
  { label: "Capacity (High to Low)", value: "capacity_desc" },
  { label: "Capacity (Low to High)", value: "capacity_asc" },
];

export default function CourseOfferingsList() {
  const filter = useStateFilter();

  const { data: semestersRes } = useGetSemesters({ limit: 100 });
  const { data: coursesRes } = useGetCourses({ limit: 100 });

  const semesters = semestersRes?.data ?? [];
  const courses = coursesRes?.data ?? [];

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

  const semesterOptions = [
    { label: "All Semesters", value: "all" },
    ...semesters.map((s) => ({ label: `${s.name} ${s.year}`, value: s.id })),
  ];

  const courseOptions = [
    { label: "All Courses", value: "all" },
    ...courses.map((c) => ({ label: `${c.code} — ${c.title}`, value: c.id })),
  ];

  return (
    <div className="space-y-6">
      <SectionHeading
        title="Course Offerings"
        description="Manage semester-wise course offerings, sections, faculty assignments, seat capacity, and fees."
        alignment="left"
        as="h3"
      >
        <CourseOfferingModal mode="create" />
      </SectionHeading>

      {/* Filters row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-xs">
          <SearchInput
            filter={filter}
            filterKey="searchTerm"
            debounce={500}
            placeholder="Search course, code, teacher, sec..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Semester Filter */}
          <FilterSelect
            filter={filter}
            filterKey="semesterId"
            placeholder="All Semesters"
            options={semesterOptions}
            className="w-40"
          />

          {/* Course Filter */}
          <FilterSelect
            filter={filter}
            filterKey="courseId"
            placeholder="All Courses"
            options={courseOptions}
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

      <DataTable
        columns={courseOfferingColumns}
        data={offerings}
        meta={meta}
        filter={filter}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        errorMessage={getErrorMessage(
          error,
          "Failed to load course offerings"
        )}
        onRetry={refetch}
      />
    </div>
  );
}
