"use client";

import * as React from "react";
import Link from "next/link";
import { Users, ShieldCheck, BookOpen, ArrowUpRight, Activity } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetUserDashboardStats } from "@/services";

interface AdminSystemOverviewCardProps {
  isLoading?: boolean;
}

export function AdminSystemOverviewCard({
  isLoading: isParentLoading,
}: AdminSystemOverviewCardProps) {
  const { data: statsResponse, isLoading: isStatsLoading } =
    useGetUserDashboardStats();

  const stats = statsResponse?.data;
  const isLoading = isParentLoading || isStatsLoading;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="space-y-4 p-6">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-56" />
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalUsers = stats?.users.total ?? 0;
  const totalEnrollments = stats?.enrollments.total ?? 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-foreground">
              Platform Administration
            </CardTitle>
            <CardDescription className="text-xs">
              Live university system metrics and administrative management.
            </CardDescription>
          </div>
          <Activity className="size-5 text-primary" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Scale Summary Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border bg-muted/40 p-3 space-y-1">
            <span className="text-2xs text-muted-foreground">System Users</span>
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-xl font-bold text-foreground">
                {totalUsers}
              </span>
              <span className="text-2xs text-muted-foreground">Accounts</span>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-muted/40 p-3 space-y-1">
            <span className="text-2xs text-muted-foreground">Total Enrollments</span>
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-xl font-bold text-foreground">
                {totalEnrollments}
              </span>
              <span className="text-2xs text-muted-foreground">Registrations</span>
            </div>
          </div>
        </div>

        {/* Administration Short-cuts */}
        <div className="flex flex-col gap-2 pt-1">
          <Button
            variant="outline"
            render={<Link href="/admin/users" />}
            className="w-full justify-between"
          >
            <span className="flex items-center gap-2">
              <Users />
              User Management
            </span>
            <ArrowUpRight />
          </Button>

          <Button
            variant="outline"
            render={<Link href="/admin/audit-logs" />}
            className="w-full justify-between"
          >
            <span className="flex items-center gap-2">
              <ShieldCheck />
              Security Audit Logs
            </span>
            <ArrowUpRight />
          </Button>

          <Button
            variant="outline"
            render={<Link href="/admin/course-offerings" />}
            className="w-full justify-between"
          >
            <span className="flex items-center gap-2">
              <BookOpen />
              Course Offerings
            </span>
            <ArrowUpRight />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default AdminSystemOverviewCard;
