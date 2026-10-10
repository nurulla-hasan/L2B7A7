"use client";

import { SectionHeading } from "@/components/common/section-heading";
import { SearchInput } from "@/components/common/search-input";
import { FilterSelect } from "@/components/common/filter-select";
import { DataTable } from "@/components/common/data-table";
import { useStateFilter } from "@/hooks";
import { useGetSemesters } from "@/services";
import { getErrorMessage } from "@/lib/error";
import type { SemesterSortBy } from "@/types";
import { semesterColumns } from "./semester-column";
import { SemesterModal } from "./semester-modal";

const YEAR_OPTIONS = ["all", "2027", "2026", "2025", "2024", "2023", "2022"];

const SORT_OPTIONS: { label: string; value: SemesterSortBy }[] = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Year (High to Low)", value: "year_desc" },
  { label: "Year (Low to High)", value: "year_asc" },
];

export default function SemestersList() {
  const filter = useStateFilter();

  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetSemesters(filter.filters);

  const semesters = response?.data ?? [];
  const meta = response?.meta;

  return (
    <div className="space-y-6">
      <SectionHeading
        title="Semesters Management"
        description="Manage academic terms, semester schedules, and session dates."
        alignment="left"
        as="h3"
      >
        <SemesterModal mode="create" />
      </SectionHeading>

      {/* Filters row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-xs">
          <SearchInput
            filter={filter}
            filterKey="searchTerm"
            debounce={500}
            placeholder="Search semester..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Year Filter */}
          <FilterSelect
            filter={filter}
            filterKey="year"
            placeholder="All Years"
            options={YEAR_OPTIONS}
            className="w-32.5"
          />

          {/* Sort By Filter */}
          <FilterSelect
            filter={filter}
            filterKey="sortBy"
            placeholder="Sort by"
            options={SORT_OPTIONS}
            className="min-w-46"
          />
        </div>
      </div>

      <DataTable
        columns={semesterColumns}
        data={semesters}
        meta={meta}
        filter={filter}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        errorMessage={getErrorMessage(error, "Failed to load semesters")}
        onRetry={refetch}
      />
    </div>
  );
}
