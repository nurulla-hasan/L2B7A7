"use client";

import { SectionHeading } from "@/components/common/section-heading";
import { SearchInput } from "@/components/common/search-input";
import { FilterSelect } from "@/components/common/filter-select";
import { DataTable } from "@/components/common/data-table";
import { useStateFilter } from "@/hooks";
import { useGetCourses } from "@/services";
import { getErrorMessage } from "@/lib/error";
import type { CourseSortBy } from "@/types";
import { courseColumns } from "./course-column";
import { CourseModal } from "./course-modal";

const CREDIT_OPTIONS = [
  { label: "All Credits", value: "all" },
  { label: "0.5 Credits", value: "0.5" },
  { label: "1 Credit", value: "1" },
  { label: "1.5 Credits", value: "1.5" },
  { label: "2 Credits", value: "2" },
  { label: "3 Credits", value: "3" },
  { label: "4 Credits", value: "4" },
  { label: "6 Credits", value: "6" },
];

const SORT_OPTIONS: { label: string; value: CourseSortBy }[] = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Credits (High to Low)", value: "credits_desc" },
  { label: "Credits (Low to High)", value: "credits_asc" },
  { label: "Title (A-Z)", value: "title_asc" },
  { label: "Title (Z-A)", value: "title_desc" },
  { label: "Code (A-Z)", value: "code_asc" },
  { label: "Code (Z-A)", value: "code_desc" },
];

export default function CoursesList() {
  const filter = useStateFilter();

  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetCourses(filter.filters);

  const courses = response?.data ?? [];
  const meta = response?.meta;

  return (
    <div className="space-y-6">
      <SectionHeading
        title="Courses Management"
        description="Create, organize and manage university academic courses, credit hours, and syllabi."
        alignment="left"
        as="h3"
      >
        <CourseModal mode="create" />
      </SectionHeading>

      {/* Filters row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-xs">
          <SearchInput
            filter={filter}
            filterKey="searchTerm"
            debounce={500}
            placeholder="Search course title or code..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Credits Filter */}
          <FilterSelect
            filter={filter}
            filterKey="credits"
            placeholder="All Credits"
            options={CREDIT_OPTIONS}
            className="w-36"
          />

          {/* Sort By Filter */}
          <FilterSelect
            filter={filter}
            filterKey="sortBy"
            placeholder="Sort by"
            options={SORT_OPTIONS}
            className="min-w-48"
          />
        </div>
      </div>

      <DataTable
        columns={courseColumns}
        data={courses}
        meta={meta}
        filter={filter}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        errorMessage={getErrorMessage(error, "Failed to load courses")}
        onRetry={refetch}
      />
    </div>
  );
}
