"use client";

import * as React from "react";

import { SectionHeading } from "@/components/common/section-heading";
import { useGetMe } from "@/services";
import { AdminIdentityCard } from "./admin-identity-card";
import { AdminSystemOverviewCard } from "./admin-system-overview-card";
import { AdminEditProfileForm } from "./admin-edit-profile-form";
import { AdminChangePasswordForm } from "./admin-change-password-form";

export function AdminProfileOverview() {
  const { data: meResponse, isLoading: isMeLoading } = useGetMe();

  const user = meResponse?.data?.user;

  return (
    <div className="space-y-6">
      <SectionHeading
        title="Administrator Profile & Settings"
        description="Manage your system administrator profile information, operational credentials, and security preferences."
        alignment="left"
        as="h3"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Admin Identity & System Operations Overview */}
        <div className="space-y-6 lg:col-span-1">
          <AdminIdentityCard user={user} isLoading={isMeLoading} />
          <AdminSystemOverviewCard isLoading={isMeLoading} />
        </div>

        {/* Right Column: Personal Information & Password Security Forms */}
        <div className="space-y-6 lg:col-span-2">
          <AdminEditProfileForm key={user?.id ?? "empty"} user={user} />
          <AdminChangePasswordForm />
        </div>
      </div>
    </div>
  );
}

export default AdminProfileOverview;
