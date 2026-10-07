import * as React from "react";
import { Badge } from "@/components/ui/badge";

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

export function calculateGradeFromMarks(marks: number): {
  grade: string;
  gradePoint: number;
} {
  if (marks >= 80) return { grade: "A+", gradePoint: 4.0 };
  if (marks >= 75) return { grade: "A", gradePoint: 3.75 };
  if (marks >= 70) return { grade: "A-", gradePoint: 3.5 };
  if (marks >= 65) return { grade: "B+", gradePoint: 3.25 };
  if (marks >= 60) return { grade: "B", gradePoint: 3.0 };
  if (marks >= 55) return { grade: "B-", gradePoint: 2.75 };
  if (marks >= 50) return { grade: "C+", gradePoint: 2.5 };
  if (marks >= 45) return { grade: "C", gradePoint: 2.25 };
  if (marks >= 40) return { grade: "D", gradePoint: 2.0 };
  return { grade: "F", gradePoint: 0.0 };
}

interface ResultGradeBadgeProps {
  grade: string;
  showPoint?: boolean;
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function ResultGradeBadge({
  grade,
  showPoint = true,
  size = "sm",
  className,
}: ResultGradeBadgeProps) {
  const point = getGradePoint(grade);
  const label = showPoint ? `${grade} (${point.toFixed(2)})` : grade;

  if (grade.startsWith("A")) {
    return (
      <Badge variant="default" size={size} className={className}>
        {label}
      </Badge>
    );
  }

  if (grade.startsWith("B")) {
    return (
      <Badge variant="secondary" size={size} className={className}>
        {label}
      </Badge>
    );
  }

  if (grade.startsWith("C") || grade === "D") {
    return (
      <Badge variant="outline" size={size} className={className}>
        {label}
      </Badge>
    );
  }

  return (
    <Badge variant="destructive" size={size} className={className}>
      {label}
    </Badge>
  );
}

export default ResultGradeBadge;
