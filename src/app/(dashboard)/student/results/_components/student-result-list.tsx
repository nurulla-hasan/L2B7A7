"use client";

import * as React from "react";

import { SectionHeading } from "@/components/common/section-heading";
import { DataTable } from "@/components/common/data-table";
import { useGetMyResults } from "@/services";
import { getErrorMessage } from "@/lib/error";
import { studentResultColumns } from "./student-result-column";
import { StudentResultSummaryCards } from "./student-result-summary-cards";

export function StudentResultList() {
  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetMyResults();

  const results = response?.data ?? [];

  return (
    <div className="space-y-6">
      <SectionHeading
        title="Academic Grades & Results"
        description="Review your published semester course grades, grade point averages (GPA), and academic performance."
        alignment="left"
        as="h3"
      />

      {/* Academic Performance KPI Summary */}
      {!isLoading && <StudentResultSummaryCards results={results} />}

      {/* Results DataTable */}
      <DataTable
        columns={studentResultColumns}
        data={results}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        errorMessage={getErrorMessage(
          error,
          "Failed to load published examination results"
        )}
        onRetry={refetch}
      />
    </div>
  );
}

export default StudentResultList;
