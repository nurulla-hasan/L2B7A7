"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";

import { SectionHeading } from "@/components/common/section-heading";
import { SearchInput } from "@/components/common/search-input";
import { DataTable } from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
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
          <Select
            value={filter.getFilter("semesterId")}
            onValueChange={(val) =>
              filter.updateFilter(
                "semesterId",
                !val || val === "all" ? null : val
              )
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Semester">
                {(val) => {
                  if (val === "all" || !val) return "All Semesters";
                  const s = semesters.find((item) => item.id === val);
                  return s ? `${s.name} ${s.year}` : "All Semesters";
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="all">
                All Semesters
              </SelectItem>
              {semesters.map((sem) => (
                <SelectItem key={sem.id} value={sem.id}>
                  {sem.name} {sem.year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Course Filter */}
          <Select
            value={filter.getFilter("courseId")}
            onValueChange={(val) =>
              filter.updateFilter(
                "courseId",
                !val || val === "all" ? null : val
              )
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Course">
                {(val) => {
                  if (val === "all" || !val) return "All Courses";
                  const c = courses.find((item) => item.id === val);
                  return c ? c.code : "All Courses";
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="all">
                All Courses
              </SelectItem>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.code} — {course.title}
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
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Sort by">
                {(val) =>
                  SORT_OPTIONS.find((opt) => opt.value === val)?.label ||
                  "Newest First"
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
