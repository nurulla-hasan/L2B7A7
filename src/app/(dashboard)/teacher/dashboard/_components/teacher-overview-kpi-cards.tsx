"use client";

import * as React from "react";
import { BookOpen, Users, Clock, Award, CheckCircle2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { CourseOfferingItem, EnrollmentItem, ResultItem } from "@/types";

interface TeacherOverviewKpiCardsProps {
  offerings: CourseOfferingItem[];
  enrollments: EnrollmentItem[];
  results: ResultItem[];
  draftCount?: number;
  isLoading?: boolean;
}

export function TeacherOverviewKpiCards({
  offerings,
  enrollments,
  results,
  draftCount: propDraftCount,
  isLoading,
}: TeacherOverviewKpiCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-3 w-36" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // 1. Total Teaching Sections & Unique Courses
  const uniqueCourseIds = new Set(offerings.map((o) => o.courseId));

  // 2. Total Credit Hours
  const totalCredits = offerings.reduce(
    (sum, o) => sum + (o.course?.credits ?? 0),
    0
  );

  // 3. Draft Evaluations
  const calculatedDrafts =
    propDraftCount !== undefined
      ? propDraftCount
      : results.filter((r) => !r.published).length;

  // 4. Enrolled Students
  const totalStudents = enrollments.length;
  const avgPerSection =
    offerings.length > 0 ? (totalStudents / offerings.length).toFixed(0) : "0";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Assigned Sections */}
      <Card>
        <CardContent className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              Assigned Sections
            </span>
            <div className="flex items-baseline gap-1.5">
              <p className="font-mono text-2xl font-bold text-foreground">
                {offerings.length}
              </p>
              <span className="text-xs text-muted-foreground">Sections</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {uniqueCourseIds.size} Unique Course{uniqueCourseIds.size === 1 ? "" : "s"}
            </p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <BookOpen className="size-5" />
          </div>
        </CardContent>
      </Card>

      {/* 2. Total Enrolled Students */}
      <Card>
        <CardContent className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              Total Students
            </span>
            <div className="flex items-baseline gap-1.5">
              <p className="font-mono text-2xl font-bold text-foreground">
                {totalStudents}
              </p>
              <span className="text-xs text-muted-foreground">Enrolled</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Avg. {avgPerSection} students / section
            </p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Users className="size-5" />
          </div>
        </CardContent>
      </Card>

      {/* 3. Teaching Credit Hours */}
      <Card>
        <CardContent className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              Teaching Load
            </span>
            <div className="flex items-baseline gap-1.5">
              <p className="font-mono text-2xl font-bold text-foreground">
                {totalCredits}
              </p>
              <span className="text-xs text-muted-foreground">Credits</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Active semester curriculum
            </p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <Award className="size-5" />
          </div>
        </CardContent>
      </Card>

      {/* 4. Grade Evaluations Status */}
      <Card>
        <CardContent className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              Grade Evaluations
            </span>
            <div className="flex items-baseline gap-1.5">
              <p className="font-mono text-2xl font-bold text-foreground">
                {calculatedDrafts}
              </p>
              <span className="text-xs text-muted-foreground">Drafts</span>
            </div>
            <div>
              {calculatedDrafts > 0 ? (
                <Badge variant="pending" className="gap-1 text-2xs">
                  <Clock className="size-3" /> Needs Publishing
                </Badge>
              ) : (
                <Badge variant="success" className="gap-1 text-2xs">
                  <CheckCircle2 className="size-3" /> All Published
                </Badge>
              )}
            </div>
          </div>
          <div
            className={`flex size-10 items-center justify-center rounded-xl ${
              calculatedDrafts > 0
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {calculatedDrafts > 0 ? (
              <Clock className="size-5" />
            ) : (
              <CheckCircle2 className="size-5" />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default TeacherOverviewKpiCards;
