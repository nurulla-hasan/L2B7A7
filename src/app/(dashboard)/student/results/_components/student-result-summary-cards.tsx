"use client";

import * as React from "react";
import { GraduationCap, Award, BookCheck, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

interface StudentResultSummaryCardsProps {
  results: ResultItem[];
}

export function StudentResultSummaryCards({
  results,
}: StudentResultSummaryCardsProps) {
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

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* CGPA */}
      <Card>
        <CardContent className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              Cumulative GPA
            </span>
            <div className="flex items-baseline gap-1.5">
              <p className="font-mono text-2xl font-bold text-foreground">
                {cgpa}
              </p>
              <span className="text-xs text-muted-foreground">/ 4.00</span>
            </div>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Award className="size-5" />
          </div>
        </CardContent>
      </Card>

      {/* Earned Credits */}
      <Card>
        <CardContent className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              Earned Credits
            </span>
            <div className="flex items-baseline gap-1.5">
              <p className="font-mono text-2xl font-bold text-foreground">
                {totalCreditsEarned}
              </p>
              <span className="text-xs text-muted-foreground">
                / {totalCreditsAttempted} attempted
              </span>
            </div>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <GraduationCap className="size-5" />
          </div>
        </CardContent>
      </Card>

      {/* Graded Courses */}
      <Card>
        <CardContent className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              Courses Graded
            </span>
            <p className="font-mono text-2xl font-bold text-foreground">
              {results.length}
            </p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <BookCheck className="size-5" />
          </div>
        </CardContent>
      </Card>

      {/* Academic Standing */}
      <Card>
        <CardContent className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              Academic Standing
            </span>
            <div>
              <Badge variant={standingVariant}>{standingLabel}</Badge>
            </div>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <ShieldCheck className="size-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
