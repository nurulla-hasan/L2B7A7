"use client";

import * as React from "react";

import { SectionHeading } from "@/components/common/section-heading";
import { useGetMe } from "@/services";
import { TeacherFacultyCard } from "./teacher-faculty-card";
import { TeacherTeachingSummaryCard } from "./teacher-teaching-summary-card";
import { TeacherEditProfileForm } from "./teacher-edit-profile-form";
import { TeacherChangePasswordForm } from "./teacher-change-password-form";

export function TeacherProfileOverview() {
  const { data: meResponse, isLoading: isMeLoading } = useGetMe();

  const user = meResponse?.data?.user;

  return (
    <div className="space-y-6">
      <SectionHeading
        title="Faculty Profile & Settings"
        description="Manage your faculty profile information, academic credentials, and account security preferences."
        alignment="left"
        as="h3"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Faculty Identity & Teaching Overview */}
        <div className="space-y-6 lg:col-span-1">
          <TeacherFacultyCard user={user} isLoading={isMeLoading} />
          <TeacherTeachingSummaryCard isLoading={isMeLoading} />
        </div>

        {/* Right Column: Personal Information & Security Forms */}
        <div className="space-y-6 lg:col-span-2">
          <TeacherEditProfileForm key={user?.id ?? "empty"} user={user} />
          <TeacherChangePasswordForm />
        </div>
      </div>
    </div>
  );
}

export default TeacherProfileOverview;
