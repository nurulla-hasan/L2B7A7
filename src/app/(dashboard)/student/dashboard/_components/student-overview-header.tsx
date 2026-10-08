"use client";

import * as React from "react";
import Link from "next/link";
import { PlusCircle, CreditCard, Award } from "lucide-react";

import { SectionHeading } from "@/components/common/section-heading";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { AuthUser } from "@/types";

interface StudentOverviewHeaderProps {
  user?: AuthUser;
  isLoading?: boolean;
}

export function StudentOverviewHeader({
  user,
  isLoading,
}: StudentOverviewHeaderProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
    );
  }

  const profile = user?.studentProfile;
  const description = `${profile?.studentId ? `ID: ${profile.studentId} • ` : ""}${profile?.department || "Academic Department"}${profile?.batch ? ` • Batch ${profile.batch}` : ""}`;

  return (
    <SectionHeading
      title={`Welcome back, ${user?.name ?? "Student"}! 👋`}
      description={description}
      alignment="left"
      as="h3"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Button render={<Link href="/student/registration" />}>
          <PlusCircle />
          Register Courses
        </Button>
        <Button variant="outline" render={<Link href="/student/payments" />}>
          <CreditCard />
          Fee Payments
        </Button>
        <Button variant="outline" render={<Link href="/student/results" />}>
          <Award />
          Grades & Results
        </Button>
      </div>
    </SectionHeading>
  );
}
