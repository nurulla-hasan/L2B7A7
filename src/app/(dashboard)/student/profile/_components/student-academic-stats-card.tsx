"use client";

import * as React from "react";
import { Award, GraduationCap, BookCheck } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ResultItem } from "@/types";

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

interface StudentAcademicStatsCardProps {
  results: ResultItem[];
  isLoading?: boolean;
}

export function StudentAcademicStatsCard({
  results,
  isLoading,
}: StudentAcademicStatsCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="space-y-3 p-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-20" />
        </CardContent>
      </Card>
    );
  }

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold text-foreground">
          Academic Progress
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
          <div className="space-y-0.5">
            <span className="text-xs text-muted-foreground">Cumulative CGPA</span>
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-xl font-bold text-foreground">
                {cgpa}
              </span>
              <span className="text-xs text-muted-foreground">/ 4.00</span>
            </div>
          </div>
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Award className="size-4" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
          <div className="space-y-0.5">
            <span className="text-xs text-muted-foreground">Earned Credits</span>
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-xl font-bold text-foreground">
                {totalCreditsEarned}
              </span>
              <span className="text-xs text-muted-foreground">
                / {totalCreditsAttempted}
              </span>
            </div>
          </div>
          <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <GraduationCap className="size-4" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
          <div className="space-y-0.5">
            <span className="text-xs text-muted-foreground">Graded Courses</span>
            <p className="font-mono text-xl font-bold text-foreground">
              {results.length}
            </p>
          </div>
          <div className="flex size-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <BookCheck className="size-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
