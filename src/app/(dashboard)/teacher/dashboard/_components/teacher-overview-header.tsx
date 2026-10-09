"use client";

import * as React from "react";
import Link from "next/link";
import { Award, BookOpen, Users } from "lucide-react";

import { SectionHeading } from "@/components/common/section-heading";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { AuthUser } from "@/types";

interface TeacherOverviewHeaderProps {
  user?: AuthUser;
  isLoading?: boolean;
}

export function TeacherOverviewHeader({
  user,
  isLoading,
}: TeacherOverviewHeaderProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
    );
  }

  const profile = user?.teacherProfile;
  const description = `${profile?.designation || "Faculty Member"} • ${profile?.department || "Academic Department"}`;

  return (
    <SectionHeading
      title={`Welcome back, ${user?.name ?? "Professor"}! 👋`}
      description={description}
      alignment="left"
      as="h3"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Button render={<Link href="/teacher/grades" />}>
          <Award />
          Grade Submissions
        </Button>
        <Button variant="outline" render={<Link href="/teacher/courses" />}>
          <BookOpen />
          My Courses
        </Button>
        <Button variant="outline" render={<Link href="/teacher/students" />}>
          <Users />
          Enrolled Students
        </Button>
      </div>
    </SectionHeading>
  );
}

export default TeacherOverviewHeader;
