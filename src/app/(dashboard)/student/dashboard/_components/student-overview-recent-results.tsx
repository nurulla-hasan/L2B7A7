"use client";

import * as React from "react";
import Link from "next/link";
import { Award, ArrowRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import type { ResultItem } from "@/types";
import { getGradePoint } from "./student-overview-kpi-cards";

interface StudentOverviewRecentResultsProps {
  results: ResultItem[];
  isLoading?: boolean;
}

function StudentGradeBadge({ grade }: { grade: string }) {
  const point = getGradePoint(grade);
  let variant: "success" | "info" | "warning" | "destructive" | "outline" =
    "outline";

  if (["A+", "A", "A-"].includes(grade)) {
    variant = "success";
  } else if (["B+", "B", "B-"].includes(grade)) {
    variant = "info";
  } else if (["C+", "C", "D"].includes(grade)) {
    variant = "warning";
  } else if (grade === "F") {
    variant = "destructive";
  }

  return (
    <Badge variant={variant}>
      {grade} ({point.toFixed(2)})
    </Badge>
  );
}

export function StudentOverviewRecentResults({
  results,
  isLoading,
}: StudentOverviewRecentResultsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-semibold text-foreground">
            Recent Examination Grades
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Latest course marks and grade evaluations
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          render={<Link href="/student/results" />}
        >
          View All Results
          <ArrowRight />
        </Button>
      </CardHeader>

      <CardContent>
        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
            <div className="flex size-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              <Award className="size-5" />
            </div>
            <p className="text-xs text-muted-foreground">
              No examination grades published yet for this term.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {results.slice(0, 4).map((r) => {
              const course = r.enrollment?.courseOffering?.course;

              return (
                <div
                  key={r.id}
                  className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{course?.code ?? "—"}</Badge>
                      <span className="text-sm font-medium text-foreground line-clamp-1">
                        {course?.title ?? "Course"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Marks:{" "}
                      <span className="font-mono font-semibold text-foreground">
                        {r.marks} / 100
                      </span>
                      {r.publishedAt ? ` • ${formatDate(r.publishedAt)}` : ""}
                    </p>
                  </div>

                  <StudentGradeBadge grade={r.grade} />
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
