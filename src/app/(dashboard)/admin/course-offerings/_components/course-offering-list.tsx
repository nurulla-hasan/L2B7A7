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
  const filter = useStateFilter<string>({
    paginationKey: "page",
    initialValues: {
      page: 1,
      limit: 10,
      sortBy: "newest",
    },
  });

  const { data: semestersRes } = useGetSemesters({ limit: 100 });
  const { data: coursesRes } = useGetCourses({ limit: 100 });

  const semesters = semestersRes?.data ?? [];
  const courses = coursesRes?.data ?? [];

  const queryParams = React.useMemo(() => {
    const raw = filter.filters;
    return {
      page: raw.page ? Number(raw.page) : 1,
      limit: raw.limit ? Number(raw.limit) : 10,
      searchTerm: raw.searchTerm || undefined,
      semesterId: raw.semesterId || undefined,
      courseId: raw.courseId || undefined,
      sortBy: (raw.sortBy as CourseOfferingSortBy) || "newest",
    };
  }, [filter.filters]);

  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetCourseOfferings(queryParams);

  const offerings = response?.data ?? [];
  const meta = response?.meta;

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
          <Select
            value={filter.getFilter("semesterId") || "all"}
            onValueChange={(val) =>
              filter.updateFilter(
                "semesterId",
                !val || val === "all" ? null : val
              )
            }
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

          {/* Course Filter */}
          <Select
            value={filter.getFilter("courseId") || "all"}
            onValueChange={(val) =>
              filter.updateFilter(
                "courseId",
                !val || val === "all" ? null : val
              )
            }
          >
            <SelectTrigger className="w-40 cursor-pointer">
              <SelectValue placeholder="Course">
                {(val) => {
                  if (val === "all" || !val) return "All Courses";
                  const c = courses.find((item) => item.id === val);
                  return c ? c.code : "Course";
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="all" className="cursor-pointer">
                All Courses
              </SelectItem>
              {courses.map((course) => (
                <SelectItem
                  key={course.id}
                  value={course.id}
                  className="cursor-pointer"
                >
                  {course.code} — {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort By Filter */}
          <Select
            value={
              (filter.getFilter("sortBy") as CourseOfferingSortBy) || "newest"
            }
            onValueChange={(val) => {
              if (val) filter.updateFilter("sortBy", val);
            }}
          >
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
