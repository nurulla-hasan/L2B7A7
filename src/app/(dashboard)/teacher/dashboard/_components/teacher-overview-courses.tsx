"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Calendar, Users } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import type { CourseOfferingItem, EnrollmentItem } from "@/types";

interface TeacherOverviewCoursesProps {
  offerings: CourseOfferingItem[];
  enrollments: EnrollmentItem[];
  isLoading?: boolean;
}

export function TeacherOverviewCourses({
  offerings,
  enrollments,
  isLoading,
}: TeacherOverviewCoursesProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Current Course Offerings
          </h2>
          <p className="text-xs text-muted-foreground">
            Active courses and sections you are currently instructing
          </p>
        </div>
        <Button
          variant="outline"
          render={<Link href="/teacher/courses" />}
        >
          <BookOpen />
          Manage All Courses
        </Button>
      </div>

      {offerings.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center space-y-2">
            <BookOpen className="size-8 mx-auto text-muted-foreground/60" />
            <h4 className="text-sm font-semibold text-foreground">
              No Courses Assigned Yet
            </h4>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              You are currently not assigned to instruct any course sections for the current academic term.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {offerings.map((offering) => {
            const course = offering.course;
            const semester = offering.semester;

            // Calculate enrolled count for this offering
            const sectionEnrollments = enrollments.filter(
              (e) => e.courseOfferingId === offering.id && e.status === "ENROLLED"
            );
            const enrolledCount = sectionEnrollments.length;
            const capacity = offering.capacity || 40;
            const fillPercent = Math.min(
              100,
              Math.round((enrolledCount / capacity) * 100)
            );

            return (
              <Card
                key={offering.id}
                className="flex flex-col justify-between hover:border-primary/50 transition-colors"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <Badge variant="outline" className="font-mono text-2xs font-semibold">
                        {course?.code}
                      </Badge>
                      <Badge variant="secondary" className="text-2xs font-mono">
                        Sec {offering.section}
                      </Badge>
                    </div>
                    {semester && (
                      <span className="text-2xs text-muted-foreground font-medium">
                        {semester.name} {semester.year}
                      </span>
                    )}
                  </div>

                  <CardTitle className="text-base font-semibold leading-snug mt-2 line-clamp-1">
                    {course?.title}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {course?.credits} Credit Hours
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3.5 text-xs">
                  {/* Enrollment capacity bar */}
                  <div className="space-y-1.5 rounded-lg border border-border bg-muted/30 p-2.5">
                    <div className="flex items-center justify-between text-2xs">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Users className="size-3" />
                        Class Capacity
                      </span>
                      <span className="font-mono font-medium text-foreground">
                        {enrolledCount} / {capacity} Enrolled ({fillPercent}%)
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-300"
                        style={{ width: `${fillPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Academic Schedule & Tuition */}
                  <div className="space-y-1 text-muted-foreground">
                    <div className="flex items-center gap-1.5 text-2xs">
                      <Calendar className="size-3 text-muted-foreground shrink-0" />
                      <span className="truncate">
                        {semester?.startDate
                          ? `${formatDate(semester.startDate)} - ${formatDate(semester.endDate)}`
                          : "Active Semester Term"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-2xs">
                      <span className="font-mono text-foreground font-medium">
                        ৳ {Number(offering.fee || 0).toLocaleString()}
                      </span>
                      <span>Per Student Tuition</span>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                    <Link
                      href={`/teacher/students?courseOfferingId=${offering.id}`}
                      className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                    >
                      View Roster <ArrowRight className="size-3" />
                    </Link>

                    <Link
                      href={`/teacher/grades?courseOfferingId=${offering.id}`}
                      className="text-xs font-medium text-muted-foreground hover:text-foreground"
                    >
                      Grade Sheet
                    </Link>
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

export default TeacherOverviewCourses;
