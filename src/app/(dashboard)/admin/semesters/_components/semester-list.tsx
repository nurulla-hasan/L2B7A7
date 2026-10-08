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
          <Select
            value={filter.getFilter("year")}
            onValueChange={(val) =>
              filter.updateFilter(
                "year",
                !val || val === "all" ? null : Number(val)
              )
            }
          >
            <SelectTrigger className="w-32.5 cursor-pointer">
              <SelectValue placeholder="Year">
                {(val) => (val === "all" || !val ? "All Years" : val)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="end">
              {YEAR_OPTIONS.map((yr) => (
                <SelectItem key={yr} value={yr} className="cursor-pointer">
                  {yr === "all" ? "All Years" : yr}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort By Filter */}
          <Select
            value={filter.getFilter("sortBy")}
            onValueChange={(val) => {
              if (val) filter.updateFilter("sortBy", val);
            }}
          >
            <SelectTrigger className="min-w-46 cursor-pointer">
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
