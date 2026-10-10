"use client";

import { Send } from "lucide-react";

import { SectionHeading } from "@/components/common/section-heading";
import { SearchInput } from "@/components/common/search-input";
import { DataTable } from "@/components/common/data-table";
import { ConfirmationModal } from "@/components/common/confirmation-modal";
import { FilterSelect } from "@/components/common/filter-select";
import { Button } from "@/components/ui/button";
import { useStateFilter } from "@/hooks";
import {
  useGetAllResults,
  useGetCourseOfferings,
  usePublishResults,
} from "@/services";
import { successToast, errorToast } from "@/lib/toast";
import { getErrorMessage } from "@/lib/error";
import { teacherGradesColumns } from "./teacher-grades-column";
import { TeacherSubmitMarksModal } from "./teacher-submit-marks-modal";

const STATUS_OPTIONS: { label: string; value: string }[] = [
  { label: "All Statuses", value: "all" },
  { label: "Published Only", value: "true" },
  { label: "Draft (Unpublished)", value: "false" },
];

export function TeacherGradesList() {
  const filter = useStateFilter();

  // 1. Fetch teacher assigned course offerings for filter dropdown
  const { data: offeringsRes } = useGetCourseOfferings({ limit: 100 });
  const offerings = offeringsRes?.data ?? [];

  // 2. Fetch results with server-side pagination, search & filters
  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetAllResults(filter.filters);

  const { mutate: publishMutation, isPending: isPublishing } = usePublishResults();

  const results = response?.data ?? [];
  const meta = response?.meta;
  const draftCount = meta?.draftCount ?? 0;

  const handleBulkPublish = () => {
    if (draftCount === 0) return;

    publishMutation(
      { publishAll: true },
      {
        onSuccess: (res) => {
          successToast(
            "Results published",
            res?.message || `${draftCount} draft result(s) have been successfully published.`
          );
        },
        onError: (err) => {
          errorToast(getErrorMessage(err, "Failed to publish results"));
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Section Heading with Actions */}
      <SectionHeading
        title="Grade Submissions"
        description="Audit student examination marks, evaluate performance, and release academic grades."
        alignment="left"
        as="h3"
      >
        <div className="flex items-center gap-2">
          <TeacherSubmitMarksModal />

          {draftCount > 0 && (
            <ConfirmationModal
              title="Publish All Draft Grades?"
              description={`You are about to publish ${draftCount} draft result(s). Students will immediately see their evaluation in their portal.`}
              confirmText="Publish All Drafts"
              variant="default"
              isLoading={isPublishing}
              onConfirm={handleBulkPublish}
              actionTrigger={
                <Button
                  variant="default"
                  loading={isPublishing}
                  loadingText="Publishing..."
                >
                  <Send />
                  Publish All Drafts ({draftCount})
                </Button>
              }
            />
          )}
        </div>
      </SectionHeading>

      {/* 2. Filters Row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-xs">
          <SearchInput
            filter={filter}
            filterKey="searchTerm"
            debounce={500}
            placeholder="Search student, course, ID..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Course Section Filter */}
          <FilterSelect
            filter={filter}
            filterKey="courseOfferingId"
            placeholder="All Course Sections"
            options={[
              { label: "All Course Sections", value: "all" },
              ...offerings.map((opt) => ({
                label: `${opt.course.code} (Sec ${opt.section}) • ${opt.course.title}`,
                value: opt.id,
              })),
            ]}
            className="w-full sm:w-64"
          />

          {/* Status Filter */}
          <FilterSelect
            filter={filter}
            filterKey="published"
            placeholder="Status"
            options={STATUS_OPTIONS}
            className="w-full sm:w-44"
          />
        </div>
      </div>

      {/* 3. TanStack DataTable */}
      <DataTable
        columns={teacherGradesColumns}
        data={results}
        meta={meta}
        filter={filter}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        errorMessage={getErrorMessage(
          error,
          "Failed to load examination results."
        )}
        onRetry={refetch}
      />
    </div>
  );
}

export default TeacherGradesList;
