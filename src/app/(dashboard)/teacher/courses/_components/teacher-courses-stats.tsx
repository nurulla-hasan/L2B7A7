"use client";

import { BookOpen, Users, Award, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { CourseOfferingItem } from "@/types";

interface TeacherCoursesStatsProps {
  offerings: CourseOfferingItem[];
  isLoading?: boolean;
}

export function TeacherCoursesStats({
  offerings,
  isLoading,
}: TeacherCoursesStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="space-y-2 p-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-7 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalSections = offerings.length;
  const totalStudents = offerings.reduce(
    (acc, item) => acc + (item._count?.enrollments ?? 0),
    0
  );
  const totalCredits = offerings.reduce(
    (acc, item) => acc + (Number(item.course?.credits) || 0),
    0
  );
  const totalCapacity = offerings.reduce(
    (acc, item) => acc + (Number(item.capacity) || 0),
    0
  );
  const occupancyRate =
    totalCapacity > 0 ? Math.round((totalStudents / totalCapacity) * 100) : 0;

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {/* 1. Assigned Sections */}
      <Card>
        <CardContent className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <BookOpen className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Assigned Sections</p>
            <p className="font-mono text-xl font-bold text-foreground">
              {totalSections}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 2. Total Enrolled Students */}
      <Card>
        <CardContent className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Users className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Enrolled Students</p>
            <p className="font-mono text-xl font-bold text-foreground">
              {totalStudents}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 3. Teaching Credits */}
      <Card>
        <CardContent className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
            <Award className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Total Credits</p>
            <p className="font-mono text-xl font-bold text-foreground">
              {totalCredits.toFixed(1)}{" "}
              <span className="text-xs font-normal text-muted-foreground">Cr</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 4. Class Occupancy Rate */}
      <Card>
        <CardContent className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
            <BarChart3 className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Avg. Occupancy</p>
            <p className="font-mono text-xl font-bold text-foreground">
              {occupancyRate}%
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
