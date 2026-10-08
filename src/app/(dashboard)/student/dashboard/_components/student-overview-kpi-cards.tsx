"use client";

import * as React from "react";
import { BookOpenCheck, Award, CreditCard, GraduationCap } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { EnrollmentItem, ResultItem } from "@/types";

export function getGradePoint(grade: string): number {
  switch (grade) {
    case "A+":
      return 4.0;
    case "A":
      return 3.75;
    case "A-":
      return 3.5;
    case "B+":
      return 3.25;
    case "B":
      return 3.0;
    case "B-":
      return 2.75;
    case "C+":
      return 2.5;
    case "C":
      return 2.25;
    case "D":
      return 2.0;
    default:
      return 0.0;
  }
}

interface StudentOverviewKpiCardsProps {
  enrollments: EnrollmentItem[];
  results: ResultItem[];
  isLoading?: boolean;
}

export function StudentOverviewKpiCards({
  enrollments,
  results,
  isLoading,
}: StudentOverviewKpiCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="space-y-2 p-4">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-3 w-36" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // 1. Enrolled Courses & Credits
  const confirmedEnrollments = enrollments.filter(
    (e) => e.status === "ENROLLED"
  );
  const totalEnrolledCredits = confirmedEnrollments.reduce(
    (sum, e) => sum + (e.courseOffering?.course?.credits ?? 3),
    0
  );

  // 2. CGPA & Academic Standing
  let totalCreditsAttempted = 0;
  let totalCreditsEarned = 0;
  let totalWeightedPoints = 0;

  for (const r of results) {
    const credits = r.enrollment?.courseOffering?.course?.credits ?? 3;
    const point = getGradePoint(r.grade);

    totalCreditsAttempted += credits;
    totalWeightedPoints += credits * point;

    if (r.grade !== "F") {
      totalCreditsEarned += credits;
    }
  }

  const cgpa =
    totalCreditsAttempted > 0
      ? (totalWeightedPoints / totalCreditsAttempted).toFixed(2)
      : "0.00";

  const numCgpa = parseFloat(cgpa);
  let standingLabel = "Good Standing";
  let standingVariant: "success" | "info" | "warning" | "destructive" = "success";

  if (numCgpa >= 3.75) {
    standingLabel = "Dean's Honor List";
    standingVariant = "success";
  } else if (numCgpa >= 3.0) {
    standingLabel = "Good Standing";
    standingVariant = "info";
  } else if (numCgpa >= 2.0) {
    standingLabel = "Satisfactory";
    standingVariant = "warning";
  } else if (results.length > 0) {
    standingLabel = "Academic Warning";
    standingVariant = "destructive";
  } else {
    standingLabel = "No Records";
    standingVariant = "info";
  }

  // 3. Pending Tuition Dues
  const pendingEnrollments = enrollments.filter(
    (e) => e.status === "PENDING_PAYMENT"
  );
  const pendingFeeAmount = pendingEnrollments.reduce(
    (sum, e) => sum + Number(e.courseOffering?.fee ?? 0),
    0
  );

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Enrolled Courses */}
      <Card>
        <CardContent className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              Enrolled Courses
            </span>
            <div className="flex items-baseline gap-1.5">
              <p className="font-mono text-2xl font-bold text-foreground">
                {confirmedEnrollments.length}
              </p>
              <span className="text-xs text-muted-foreground">Courses</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {totalEnrolledCredits} Total Credit Hours
            </p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <BookOpenCheck className="size-5" />
          </div>
        </CardContent>
      </Card>

      {/* 2. Cumulative CGPA */}
      <Card>
        <CardContent className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              Cumulative CGPA
            </span>
            <div className="flex items-baseline gap-1.5">
              <p className="font-mono text-2xl font-bold text-foreground">
                {cgpa}
              </p>
              <span className="text-xs text-muted-foreground">/ 4.00</span>
            </div>
            <div>
              <Badge variant={standingVariant}>{standingLabel}</Badge>
            </div>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Award className="size-5" />
          </div>
        </CardContent>
      </Card>

      {/* 3. Tuition Fee Dues */}
      <Card>
        <CardContent className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              Tuition Fee Dues
            </span>
            <p className="font-mono text-2xl font-bold text-foreground">
              ৳ {pendingFeeAmount.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">
              {pendingEnrollments.length > 0 ? (
                <span className="text-amber-600 dark:text-amber-400">
                  {pendingEnrollments.length} course fee(s) pending
                </span>
              ) : (
                <span className="text-emerald-600 dark:text-emerald-400">
                  All fees cleared
                </span>
              )}
            </p>
          </div>
          <div
            className={`flex size-10 items-center justify-center rounded-xl ${
              pendingFeeAmount > 0
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            }`}
          >
            <CreditCard className="size-5" />
          </div>
        </CardContent>
      </Card>

      {/* 4. Earned Credits */}
      <Card>
        <CardContent className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              Completed Credits
            </span>
            <div className="flex items-baseline gap-1.5">
              <p className="font-mono text-2xl font-bold text-foreground">
                {totalCreditsEarned}
              </p>
              <span className="text-xs text-muted-foreground">Credits</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {results.length} graded course(s)
            </p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <GraduationCap className="size-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
