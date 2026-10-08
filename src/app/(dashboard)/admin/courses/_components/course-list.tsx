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
import { useGetCourses } from "@/services";
import { getErrorMessage } from "@/lib/error";
import type { CourseSortBy } from "@/types";
import { courseColumns } from "./course-column";
import { CourseModal } from "./course-modal";

const CREDIT_OPTIONS = ["all", "0.5", "1", "1.5", "2", "3", "4", "6"];

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
          <Select
            value={filter.getFilter("credits")}
            onValueChange={(val) =>
              filter.updateFilter(
                "credits",
                !val || val === "all" ? null : Number(val)
              )
            }
          >
            <SelectTrigger className="w-36 cursor-pointer">
              <SelectValue placeholder="Credits">
                {(val) =>
                  val === "all" || !val ? "All Credits" : `${val} Credits`
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="end">
              {CREDIT_OPTIONS.map((cr) => (
                <SelectItem key={cr} value={cr} className="cursor-pointer">
                  {cr === "all" ? "All Credits" : `${cr} Credits`}
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
            <SelectTrigger className="min-w-48 cursor-pointer">
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
