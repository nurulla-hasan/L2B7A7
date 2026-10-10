"use client";

import { SectionHeading } from "@/components/common/section-heading";
import { SearchInput } from "@/components/common/search-input";
import { FilterSelect } from "@/components/common/filter-select";
import { DataTable } from "@/components/common/data-table";
import { useStateFilter } from "@/hooks";
import { useGetAllAuditLogs } from "@/services";
import { getErrorMessage } from "@/lib/error";
import { auditColumns } from "./audit-column";

const ACTION_OPTIONS: { label: string; value: string }[] = [
  { label: "All Actions", value: "all" },
  { label: "Create Semester", value: "CREATE_SEMESTER" },
  { label: "Create Course", value: "CREATE_COURSE" },
  { label: "Create Offering", value: "CREATE_COURSE_OFFERING" },
  { label: "Enroll Course", value: "ENROLL_COURSE" },
  { label: "Drop Course", value: "DROP_COURSE" },
  { label: "Payment Success", value: "PAYMENT_SUCCESS" },
  { label: "Submit Marks", value: "SUBMIT_RESULT" },
  { label: "Publish Result", value: "PUBLISH_RESULT" },
  { label: "Update User Status", value: "UPDATE_USER_STATUS" },
];

const RESOURCE_OPTIONS: { label: string; value: string }[] = [
  { label: "All Resources", value: "all" },
  { label: "Semester", value: "Semester" },
  { label: "Course", value: "Course" },
  { label: "CourseOffering", value: "CourseOffering" },
  { label: "Enrollment", value: "Enrollment" },
  { label: "Payment", value: "Payment" },
  { label: "Result", value: "Result" },
  { label: "User", value: "User" },
];

export default function AuditList() {
  const filter = useStateFilter();

  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetAllAuditLogs(filter.filters);

  const logs = response?.data ?? [];
  const meta = response?.meta;

  return (
    <div className="space-y-6">
      <SectionHeading
        title="Audit Logs & Activity Trail"
        description="Immutable administrative and security events tracking university operations."
        alignment="left"
        as="h3"
      />

      {/* Filters row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-xs">
          <SearchInput
            filter={filter}
            filterKey="searchTerm"
            debounce={500}
            placeholder="Search operator, email, resource..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Action Filter */}
          <FilterSelect
            filter={filter}
            filterKey="action"
            placeholder="All Actions"
            options={ACTION_OPTIONS}
            className="w-44"
          />

          {/* Resource Filter */}
          <FilterSelect
            filter={filter}
            filterKey="resource"
            placeholder="All Resources"
            options={RESOURCE_OPTIONS}
            className="w-40"
          />
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={auditColumns}
        data={logs}
        meta={meta}
        filter={filter}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        errorMessage={getErrorMessage(error, "Failed to load audit logs")}
        onRetry={refetch}
      />
    </div>
  );
}
