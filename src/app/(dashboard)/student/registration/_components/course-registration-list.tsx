"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";

import { SectionHeading } from "@/components/common/section-heading";
import { SearchInput } from "@/components/common/search-input";
import { DataTable } from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { FilterSelect } from "@/components/common/filter-select";
import { useStateFilter } from "@/hooks";
import {
  useGetCourseOfferings,
  useGetSemesters,
  useGetCourses,
} from "@/services";
import { getErrorMessage } from "@/lib/error";
import type { CourseOfferingSortBy } from "@/types";
import { registrationColumns } from "./registration-column";

const SORT_OPTIONS: { label: string; value: CourseOfferingSortBy }[] = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Fee (High to Low)", value: "fee_desc" },
  { label: "Fee (Low to High)", value: "fee_asc" },
  { label: "Capacity (High to Low)", value: "capacity_desc" },
  { label: "Capacity (Low to High)", value: "capacity_asc" },
];

export default function CourseRegistrationList() {
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

  return (
    <div className="space-y-6">
      <SectionHeading
        title="Course Registration"
        description="Browse available course sections for the current academic session and register online."
        alignment="left"
        as="h3"
      >
        <Button render={<Link href="/student/my-courses" />}>
          <BookOpen />
          My Enrolled Courses
        </Button>
      </SectionHeading>

      {/* Filter Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-xs">
          <SearchInput
            filter={filter}
            filterKey="searchTerm"
            debounce={500}
            placeholder="Search code, title, teacher..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Semester Filter */}
          <FilterSelect
            filter={filter}
            filterKey="semesterId"
            placeholder="Semester"
            options={[
              { label: "All Semesters", value: "all" },
              ...semesters.map((sem) => ({
                label: `${sem.name} ${sem.year}`,
                value: sem.id,
              })),
            ]}
            className="w-40"
          />

          {/* Course Filter */}
          <FilterSelect
            filter={filter}
            filterKey="courseId"
            placeholder="Course"
            options={[
              { label: "All Courses", value: "all" },
              ...courses.map((course) => ({
                label: `${course.code} — ${course.title}`,
                value: course.id,
              })),
            ]}
            className="w-40"
          />

          {/* Sort By Filter */}
          <FilterSelect
            filter={filter}
            filterKey="sortBy"
            placeholder="Sort by"
            options={SORT_OPTIONS}
            className="w-44"
          />
        </div>
      </div>

      {/* Course Offerings Table */}
      <DataTable
        columns={registrationColumns}
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
