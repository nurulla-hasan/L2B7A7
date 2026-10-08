"use client";

import Link from "next/link";
import { BookOpen, PlusCircle, AlertCircle, RotateCcw } from "lucide-react";

import { SectionHeading } from "@/components/common/section-heading";
import CustomPagination from "@/components/common/custom-pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useStateFilter } from "@/hooks";
import { useGetMyEnrollments } from "@/services";
import { getErrorMessage } from "@/lib/error";
import { CourseEnrollmentCard } from "./course-enrollment-card";

const STATUS_OPTIONS: { label: string; value: string }[] = [
  { label: "All Statuses", value: "all" },
  { label: "Enrolled", value: "ENROLLED" },
  { label: "Pending Payment", value: "PENDING_PAYMENT" },
  { label: "Dropped", value: "DROPPED" },
];

export function MyCoursesList() {
  const filter = useStateFilter();

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetMyEnrollments(filter.filters);

  const enrollments = response?.data ?? [];
  const meta = response?.meta;

  const hasActiveFilters = filter.getActiveCount() > 0;

  return (
    <div className="space-y-6">
      <SectionHeading
        title="My Enrolled Courses"
        description="Track your course sections, class schedules, instructors, and tuition fee statuses."
        alignment="left"
        as="h3"
      >
        <div className="flex items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <Select
            value={filter.getFilter("status")}
            onValueChange={(val) =>
              filter.updateFilter("status", !val || val === "all" ? null : val)
            }
          >
            <SelectTrigger className="w-full sm:w-38">
              <SelectValue placeholder="Status">
                {(val) =>
                  STATUS_OPTIONS.find((opt) => opt.value === val)?.label ||
                  "All Statuses"
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="end">
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button render={<Link href="/student/registration" />}>
            <PlusCircle />
            Register Courses
          </Button>
        </div>
      </SectionHeading>

      {/* Content Area */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="space-y-4 py-5">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-20 w-full" />
                <div className="flex justify-between pt-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-3">
              <AlertCircle className="size-6" />
            </div>
            <h3 className="text-base font-semibold text-foreground">
              Failed to Load Enrolled Courses
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              {getErrorMessage(error)}
            </p>
            <div className="pt-4">
              <Button variant="outline" onClick={() => refetch()}>
                <RotateCcw />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : enrollments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
              <BookOpen className="size-6" />
            </div>
            <h3 className="text-base font-semibold text-foreground">
              No Enrolled Courses Found
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              {hasActiveFilters
                ? "No courses match your active filter criteria. Try resetting filters."
                : "You have not registered for any courses in this semester yet."}
            </p>
            <div className="flex items-center justify-center gap-3 pt-5">
              {hasActiveFilters ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => filter.clearAll()}
                >
                  <RotateCcw />
                  Reset Filters
                </Button>
              ) : (
                <Button
                  render={<Link href="/student/registration" />}
                  size="sm"
                >
                  <PlusCircle />
                  Browse Available Courses
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {enrollments.map((enrollment) => (
              <CourseEnrollmentCard
                key={enrollment.id}
                enrollment={enrollment}
              />
            ))}
          </div>

          {/* CustomPagination as requested by user */}
          {meta && meta.totalPages > 1 && (
            <div className="pt-2">
              <CustomPagination
                currentPage={meta.page}
                totalPages={meta.totalPages}
                updatePage={(page) =>
                  filter.updateFilter("page", page, {
                    resetPage: false,
                  })
                }
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MyCoursesList;
