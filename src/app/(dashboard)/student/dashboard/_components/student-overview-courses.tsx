"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen, ArrowRight, CheckCircle2, Clock, Sparkles } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { EnrollmentItem } from "@/types";

interface StudentOverviewCoursesProps {
  enrollments: EnrollmentItem[];
  isLoading?: boolean;
}

export function StudentOverviewCourses({
  enrollments,
  isLoading,
}: StudentOverviewCoursesProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="space-y-3 p-4">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-36" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Show active enrollments (excluding dropped)
  const activeEnrollments = enrollments.filter(
    (e) => e.status !== "DROPPED"
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground">
            Current Registered Courses
          </h3>
          <p className="text-xs text-muted-foreground">
            Active class sections, credit allocations, and faculty assignments
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          render={<Link href="/student/my-courses" />}
        >
          View All Courses
          <ArrowRight />
        </Button>
      </div>

      {activeEnrollments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-3 p-8 text-center">
            <div className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              <BookOpen className="size-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-foreground">
                No active course enrollments
              </h4>
              <p className="text-xs text-muted-foreground">
                You have not registered for any courses in this semester yet.
              </p>
            </div>
            <Button
              size="sm"
              render={<Link href="/student/registration" />}
            >
              <Sparkles />
              Register Courses
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {activeEnrollments.slice(0, 4).map((item) => {
            const offering = item.courseOffering;
            const course = offering.course;
            const semester = offering.semester;
            const teacher = offering.teacher;
            const isEnrolled = item.status === "ENROLLED";

            return (
              <Card
                key={item.id}
                className="transition-colors hover:border-primary/40"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{course.code}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {course.credits} Credits
                      </span>
                    </div>
                    {isEnrolled ? (
                      <Badge variant="success">
                        <CheckCircle2 className="size-3" />
                        Enrolled
                      </Badge>
                    ) : (
                      <Badge variant="warning">
                        <Clock className="size-3" />
                        Pending Fee
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-base font-semibold leading-snug text-foreground">
                    {course.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div className="rounded-lg border border-border bg-background p-2.5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Section:</span>
                      <span className="font-medium text-foreground">
                        Section {offering.section}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Semester:</span>
                      <span className="text-foreground">
                        {semester.name} {semester.year}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Instructor:</span>
                      <span className="font-medium text-foreground">
                        {teacher.name}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
