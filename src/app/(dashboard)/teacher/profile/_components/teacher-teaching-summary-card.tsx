"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen, Award, ArrowUpRight, GraduationCap } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCourseOfferings } from "@/services";

interface TeacherTeachingSummaryCardProps {
  isLoading?: boolean;
}

export function TeacherTeachingSummaryCard({
  isLoading: isParentLoading,
}: TeacherTeachingSummaryCardProps) {
  const { data: offeringsResponse, isLoading: isOfferingsLoading } =
    useGetCourseOfferings({ limit: 100 });

  const offerings = offeringsResponse?.data ?? [];
  const isLoading = isParentLoading || isOfferingsLoading;

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

  const totalCredits = offerings.reduce(
    (acc, item) => acc + (item.course?.credits ?? 0),
    0
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-foreground">
              Teaching Overview
            </CardTitle>
            <CardDescription className="text-xs">
              Current semester assigned academic courses and grading.
            </CardDescription>
          </div>
          <GraduationCap className="size-5 text-primary" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Academic Load Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border bg-muted/40 p-3 space-y-1">
            <span className="text-2xs text-muted-foreground">Assigned Sections</span>
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-xl font-bold text-foreground">
                {offerings.length}
              </span>
              <span className="text-2xs text-muted-foreground">Sections</span>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-muted/40 p-3 space-y-1">
            <span className="text-2xs text-muted-foreground">Credit Hours</span>
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-xl font-bold text-foreground">
                {totalCredits}
              </span>
              <span className="text-2xs text-muted-foreground">Credits</span>
            </div>
          </div>
        </div>

        {/* Assigned Courses List Preview */}
        {offerings.length > 0 ? (
          <div className="space-y-2 rounded-lg border border-border bg-background p-3 text-xs">
            <span className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground">
              Current Teaching Schedule
            </span>
            <div className="space-y-1.5 pt-1">
              {offerings.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-1 border-b border-border/40 last:border-0"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-medium text-foreground truncate">
                      {item.course?.title}
                    </p>
                    <p className="text-2xs text-muted-foreground font-mono">
                      Sec {item.section} • {item.semester?.name} {item.semester?.year}
                    </p>
                  </div>
                  <Badge variant="outline" className="font-mono text-2xs shrink-0">
                    {item.course?.code}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
            No active course sections assigned for this semester yet.
          </div>
        )}

        {/* Quick Portal Navigation Links */}
        <div className="flex flex-col gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            render={<Link href="/teacher/courses" />}
            className="w-full justify-between"
          >
            <span className="flex items-center gap-1.5">
              <BookOpen className="size-3.5" />
              Manage Course Sections
            </span>
            <ArrowUpRight className="size-3.5" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            render={<Link href="/teacher/grades" />}
            className="w-full justify-between"
          >
            <span className="flex items-center gap-1.5">
              <Award className="size-3.5" />
              Grade Submissions Portal
            </span>
            <ArrowUpRight className="size-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default TeacherTeachingSummaryCard;
