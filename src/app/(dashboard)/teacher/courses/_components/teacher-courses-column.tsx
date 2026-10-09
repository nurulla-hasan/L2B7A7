"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { FileSpreadsheet } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CourseOfferingItem } from "@/types";
import { TeacherCourseDetailsModal } from "./teacher-course-details-modal";
import { TeacherRosterModal } from "./teacher-roster-modal";

export const teacherCoursesColumns: ColumnDef<CourseOfferingItem>[] = [
  {
    accessorKey: "course",
    header: "Course",
    cell: ({ row }) => {
      const course = row.original.course;
      return (
        <div className="space-y-1 py-1 max-w-72">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono">
              {course.code}
            </Badge>
            <Badge variant="secondary" size="sm">
              {course.credits} Credits
            </Badge>
          </div>
          <p className="font-medium text-foreground line-clamp-1 text-xs">
            {course.title}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "section",
    header: "Section",
    cell: ({ row }) => (
      <Badge variant="outline" size="sm" className="font-mono">
        Section {row.original.section}
      </Badge>
    ),
  },
  {
    accessorKey: "semester",
    header: "Semester",
    cell: ({ row }) => {
      const semester = row.original.semester;
      return (
        <div className="text-xs font-medium text-foreground">
          {semester.name} {semester.year}
        </div>
      );
    },
  },
  {
    accessorKey: "capacity",
    header: "Enrollment / Capacity",
    cell: ({ row }) => {
      const enrolled = row.original._count?.enrollments ?? 0;
      const capacity = row.original.capacity || 1;
      const percent = Math.min(100, Math.round((enrolled / capacity) * 100));
      const isFull = enrolled >= capacity;

      return (
        <div className="space-y-1.5 w-36 text-xs">
          <div className="flex items-center justify-between font-mono">
            <span className="font-semibold text-foreground">
              {enrolled} / {capacity}
            </span>
            <Badge
              variant={isFull ? "destructive" : "secondary"}
              size="sm"
            >
              {isFull ? "Full" : `${percent}%`}
            </Badge>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className={`h-full rounded-full transition-all ${
                isFull ? "bg-destructive" : "bg-primary"
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "fee",
    header: "Tuition Fee",
    cell: ({ row }) => (
      <span className="font-mono text-xs font-medium text-foreground">
        ৳{Number(row.original.fee).toLocaleString()}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => <span className="text-right block">Actions</span>,
    cell: ({ row }) => {
      const offering = row.original;

      return (
        <div className="flex items-center justify-end gap-1.5">
          {/* 1. Course Details Modal */}
          <TeacherCourseDetailsModal offering={offering} />

          {/* 2. Class Roster Modal */}
          <TeacherRosterModal offering={offering} />

          {/* 3. Enter Grades Page Link */}
          <Button
            render={<Link href={`/teacher/grades?offeringId=${offering.id}`} />}
            title="Enter Grades"
          >
            <FileSpreadsheet />
            Grades
          </Button>
        </div>
      );
    },
  },
];
