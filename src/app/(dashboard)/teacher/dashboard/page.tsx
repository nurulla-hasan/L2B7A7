"use client";

import * as React from "react";
import {
  useGetMe,
  useGetCourseOfferings,
  useGetAllEnrollments,
  useGetAllResults,
} from "@/services";
import { TeacherOverviewHeader } from "./_components/teacher-overview-header";
import { TeacherOverviewKpiCards } from "./_components/teacher-overview-kpi-cards";
import { TeacherOverviewCourses } from "./_components/teacher-overview-courses";
import { TeacherOverviewRecentActivity } from "./_components/teacher-overview-recent-activity";

export default function TeacherDashboardPage() {
  const { data: meResponse, isLoading: isMeLoading } = useGetMe();
  const { data: offeringsResponse, isLoading: isOfferingsLoading } =
    useGetCourseOfferings({ limit: 100 });
  const { data: enrollmentsResponse, isLoading: isEnrollmentsLoading } =
    useGetAllEnrollments({ limit: 100 });
  const { data: resultsResponse, isLoading: isResultsLoading } =
    useGetAllResults({ limit: 100 });

  const user = meResponse?.data?.user;
  const offerings = offeringsResponse?.data ?? [];
  const enrollments = enrollmentsResponse?.data ?? [];
  const results = resultsResponse?.data ?? [];
  const resultsMeta = resultsResponse?.meta;

  const isStatsLoading =
    isOfferingsLoading || isEnrollmentsLoading || isResultsLoading;

  return (
    <div className="space-y-6">
      {/* 1. Header with Personalized Welcome & Quick Actions */}
      <TeacherOverviewHeader user={user} isLoading={isMeLoading} />

      {/* 2. Key Faculty Metrics (Sections, Students, Credits, Draft Evaluations) */}
      <TeacherOverviewKpiCards
        offerings={offerings}
        enrollments={enrollments}
        results={results}
        draftCount={resultsMeta?.draftCount}
        isLoading={isStatsLoading}
      />

      {/* 3. Current Course Offerings & Capacity */}
      <TeacherOverviewCourses
        offerings={offerings}
        enrollments={enrollments}
        isLoading={isOfferingsLoading}
      />

      {/* 4. Bottom Grid: Pending Grade Evaluations & Recent Enrolled Students */}
      <TeacherOverviewRecentActivity
        results={results}
        enrollments={enrollments}
        isLoading={isResultsLoading || isEnrollmentsLoading}
      />
    </div>
  );
}
