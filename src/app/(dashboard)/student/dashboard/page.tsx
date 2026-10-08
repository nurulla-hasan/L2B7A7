"use client";

import * as React from "react";

import {
  useGetMe,
  useGetMyEnrollments,
  useGetMyResults,
  useGetMyPayments,
} from "@/services";
import { StudentOverviewHeader } from "./_components/student-overview-header";
import { StudentOverviewKpiCards } from "./_components/student-overview-kpi-cards";
import { StudentOverviewPendingAlert } from "./_components/student-overview-pending-alert";
import { StudentOverviewCourses } from "./_components/student-overview-courses";
import { StudentOverviewRecentResults } from "./_components/student-overview-recent-results";
import { StudentOverviewRecentPayments } from "./_components/student-overview-recent-payments";

export default function StudentDashboardPage() {
  const { data: meResponse, isLoading: isMeLoading } = useGetMe();
  const { data: enrollmentsResponse, isLoading: isEnrollmentsLoading } =
    useGetMyEnrollments({ limit: 100 });
  const { data: resultsResponse, isLoading: isResultsLoading } =
    useGetMyResults();
  const { data: paymentsResponse, isLoading: isPaymentsLoading } =
    useGetMyPayments({ limit: 10 });

  const user = meResponse?.data?.user;
  const enrollments = enrollmentsResponse?.data ?? [];
  const results = resultsResponse?.data ?? [];
  const payments = paymentsResponse?.data ?? [];

  const pendingEnrollments = enrollments.filter(
    (e) => e.status === "PENDING_PAYMENT"
  );

  return (
    <div className="space-y-6">
      {/* 1. Header with Student Profile & Quick Actions */}
      <StudentOverviewHeader user={user} isLoading={isMeLoading} />

      {/* 2. Key Academic Performance Metrics (KPI Cards) */}
      <StudentOverviewKpiCards
        enrollments={enrollments}
        results={results}
        isLoading={isEnrollmentsLoading || isResultsLoading}
      />

      {/* 3. Conditional Alert for Outstanding Tuition Balance */}
      <StudentOverviewPendingAlert pendingEnrollments={pendingEnrollments} />

      {/* 4. Current Registered Courses */}
      <StudentOverviewCourses
        enrollments={enrollments}
        isLoading={isEnrollmentsLoading}
      />

      {/* 5. Bottom Two-Column Grid: Recent Grades & Payment Transactions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <StudentOverviewRecentResults
          results={results}
          isLoading={isResultsLoading}
        />
        <StudentOverviewRecentPayments
          payments={payments}
          isLoading={isPaymentsLoading}
        />
      </div>
    </div>
  );
}
