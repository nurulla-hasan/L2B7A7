"use client";

import * as React from "react";

import { SectionHeading } from "@/components/common/section-heading";
import { useGetMe, useGetMyResults } from "@/services";
import { StudentAcademicCard } from "./student-academic-card";
import { StudentEditProfileForm } from "./student-edit-profile-form";
import { StudentChangePasswordForm } from "./student-change-password-form";
import { StudentAcademicStatsCard } from "./student-academic-stats-card";

export function StudentProfileOverview() {
  const { data: meResponse, isLoading: isMeLoading } = useGetMe();
  const { data: resultsResponse, isLoading: isResultsLoading } =
    useGetMyResults();

  const user = meResponse?.data?.user;
  const results = resultsResponse?.data ?? [];

  return (
    <div className="space-y-6">
      <SectionHeading
        title="My Profile"
        description="Manage your student account details, academic credentials, and security preferences."
        alignment="left"
        as="h3"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Academic Credentials & Stats */}
        <div className="space-y-6 lg:col-span-1">
          <StudentAcademicCard user={user} isLoading={isMeLoading} />
          <StudentAcademicStatsCard
            results={results}
            isLoading={isResultsLoading}
          />
        </div>

        {/* Right Column: Edit Profile & Change Password Forms */}
        <div className="space-y-6 lg:col-span-2">
          <StudentEditProfileForm key={user?.id ?? "empty"} user={user} />
          <StudentChangePasswordForm />
        </div>
      </div>
    </div>
  );
}

export default StudentProfileOverview;
