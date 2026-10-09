"use client";

import * as React from "react";
import Link from "next/link";
import {
  Award,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  FileSpreadsheet,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRelativeTime, getInitials } from "@/lib/utils";
import type { EnrollmentItem, ResultItem } from "@/types";

interface TeacherOverviewRecentActivityProps {
  results: ResultItem[];
  enrollments: EnrollmentItem[];
  isLoading?: boolean;
}

export function TeacherOverviewRecentActivity({
  results,
  enrollments,
  isLoading,
}: TeacherOverviewRecentActivityProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Skeleton className="h-72 w-full rounded-xl" />
        <Skeleton className="h-72 w-full rounded-xl" />
      </div>
    );
  }

  // 1. Unpublished Draft Results
  const draftResults = results.filter((r) => !r.published);
  const recentEnrollments = enrollments.slice(0, 5);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Left Column: Grade Evaluations & Pending Submissions */}
      <Card className="flex flex-col justify-between">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold text-foreground">
                Grade Submissions & Evaluations
              </CardTitle>
              <CardDescription className="text-xs">
                Assessments and evaluations awaiting publication to student portal
              </CardDescription>
            </div>
            <Award className="size-5 text-primary" />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {draftResults.length > 0 ? (
            <div className="space-y-3">
              {/* Draft Status Banner */}
              <div className="flex items-center justify-between rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-xs">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                  <Clock className="size-4 shrink-0" />
                  <span className="font-medium">
                    {draftResults.length} draft evaluation{draftResults.length === 1 ? "" : "s"} saved
                  </span>
                </div>
                <Badge variant="pending">Draft State</Badge>
              </div>

              {/* Drafts List Preview */}
              <div className="space-y-2 rounded-lg border border-border bg-background p-3 text-xs">
                <span className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Unpublished Evaluations
                </span>
                <div className="space-y-2 pt-1">
                  {draftResults.slice(0, 4).map((res) => {
                    const student = res.enrollment?.student;
                    const course = res.enrollment?.courseOffering?.course;
                    const section = res.enrollment?.courseOffering?.section;

                    return (
                      <div
                        key={res.id}
                        className="flex items-center justify-between py-1.5 border-b border-border/40 last:border-0"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="font-medium text-foreground truncate">
                            {student?.name || "Student"}
                          </p>
                          <p className="text-2xs text-muted-foreground font-mono">
                            {course?.code} (Sec {section}) • Marks: {res.marks}
                          </p>
                        </div>
                        <Badge variant="outline" className="font-mono text-2xs shrink-0">
                          {res.grade}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Button
                className="w-full"
                render={<Link href="/teacher/grades" />}
              >
                <FileSpreadsheet />
                Review & Publish All Grades
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center space-y-2 rounded-lg border border-border bg-muted/20">
              <CheckCircle2 className="size-8 text-emerald-500" />
              <h4 className="text-sm font-semibold text-foreground">
                All Evaluations Up to Date
              </h4>
              <p className="text-xs text-muted-foreground max-w-xs">
                There are no pending draft marks awaiting release. All submitted student grades are live.
              </p>
              <div className="pt-2">
                <Button
                  variant="outline"
                  render={<Link href="/teacher/grades" />}
                >
                  Go to Grade Submissions
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Right Column: Recent Student Enrollments */}
      <Card className="flex flex-col justify-between">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold text-foreground">
                Recent Student Enrollments
              </CardTitle>
              <CardDescription className="text-xs">
                Students officially registered in your active course sections
              </CardDescription>
            </div>
            <Users className="size-5 text-primary" />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {recentEnrollments.length > 0 ? (
            <div className="space-y-2">
              <div className="divide-y divide-border/50 rounded-lg border border-border bg-background">
                {recentEnrollments.map((enr) => {
                  const student = enr.student;
                  const profile = student?.studentProfile;
                  const course = enr.courseOffering?.course;
                  const section = enr.courseOffering?.section;

                  return (
                    <div
                      key={enr.id}
                      className="flex items-center justify-between p-2.5 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <Avatar className="size-7 rounded-full border border-border shrink-0">
                          {student?.imageUrl && (
                            <AvatarImage src={student.imageUrl} alt={student.name} />
                          )}
                          <AvatarFallback className="text-2xs font-semibold text-primary">
                            {getInitials(student?.name || "Student")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">
                            {student?.name}
                          </p>
                          <p className="text-2xs text-muted-foreground truncate font-mono">
                            {profile?.studentId || student?.email}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0 space-y-0.5">
                        <Badge variant="outline" className="font-mono text-2xs">
                          {course?.code} (Sec {section})
                        </Badge>
                        <p className="text-2xs text-muted-foreground">
                          {formatRelativeTime(enr.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-1">
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  render={<Link href="/teacher/students" />}
                >
                  <span>View All Enrolled Students</span>
                  <ArrowRight />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center space-y-2 rounded-lg border border-dashed border-border">
              <Users className="size-8 text-muted-foreground/50" />
              <h4 className="text-sm font-semibold text-foreground">
                No Enrolled Students Yet
              </h4>
              <p className="text-xs text-muted-foreground">
                Student registrations will appear here as soon as students enroll in your classes.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default TeacherOverviewRecentActivity;
