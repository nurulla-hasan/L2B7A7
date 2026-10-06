"use client";

import Link from "next/link";
import {
  BookOpen,
  Users,
  FileSpreadsheet,
  Award,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function TeacherDashboardPage() {
  const stats = [
    {
      title: "Assigned Courses",
      value: "3",
      change: "Spring 2026 Term",
      icon: BookOpen,
      description: "9 Credit Hours total",
    },
    {
      title: "Total Students",
      value: "114",
      change: "Across 3 sections",
      icon: Users,
      description: "Avg. 38 students/section",
    },
    {
      title: "Pending Grades",
      value: "1",
      change: "Needs Submission",
      icon: FileSpreadsheet,
      description: "Midterm grading window open",
    },
    {
      title: "Published Results",
      value: "2",
      change: "Approved by Admin",
      icon: Award,
      description: "CSE-101 Sec A, CSE-305 Sec B",
    },
  ];

  const assignedCourses = [
    {
      id: "off-1",
      title: "CSE-101: Introduction to Programming",
      code: "CSE-101",
      section: "Section A",
      credits: 3.0,
      students: 40,
      capacity: 40,
      schedule: "Sun, Tue (10:00 AM - 11:30 AM)",
      room: "Room 402, Academic Bldg 2",
      gradeStatus: "PUBLISHED" as const,
    },
    {
      id: "off-2",
      title: "CSE-202: Data Structures & Algorithms",
      code: "CSE-202",
      section: "Section B",
      credits: 3.0,
      students: 38,
      capacity: 40,
      schedule: "Mon, Wed (01:00 PM - 02:30 PM)",
      room: "Lab 3, CS Department",
      gradeStatus: "PENDING" as const,
    },
    {
      id: "off-3",
      title: "CSE-305: Computer Architecture",
      code: "CSE-305",
      section: "Section A",
      credits: 3.0,
      students: 36,
      capacity: 35,
      schedule: "Sun, Tue (02:00 PM - 03:30 PM)",
      room: "Room 501, Academic Bldg 1",
      gradeStatus: "PUBLISHED" as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Faculty Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back, Prof. Sarah Ahmed. Manage your course rosters and grade evaluations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" render={<Link href="/teacher/grades" />}>
            <FileSpreadsheet className="size-4 mr-1.5" />
            Enter Grades
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-xs hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <stat.icon className="size-4" />
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              <div className="text-[11px] font-medium text-muted-foreground pt-1">
                {stat.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Assigned Courses Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Current Course Offerings (Spring 2026)</h2>
            <p className="text-xs text-muted-foreground">Active classes you are instructing this semester</p>
          </div>
          <Button variant="outline" size="sm" render={<Link href="/teacher/courses" />}>
            All Courses
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {assignedCourses.map((course) => (
            <Card key={course.id} className="shadow-xs flex flex-col justify-between hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="font-mono text-xs">
                    {course.code}
                  </Badge>
                  {course.gradeStatus === "PUBLISHED" ? (
                    <Badge variant="success" className="gap-1 text-[11px]">
                      <CheckCircle2 className="size-3" /> Grades Live
                    </Badge>
                  ) : (
                    <Badge variant="warning" className="gap-1 text-[11px]">
                      <Clock className="size-3" /> Grades Pending
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-base font-semibold leading-snug mt-2">
                  {course.title}
                </CardTitle>
                <CardDescription className="text-xs">
                  {course.section} • {course.credits} Credits
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <span className="text-muted-foreground">Enrollment:</span>
                  <span className="font-semibold text-foreground">
                    {course.students} / {course.capacity} Students
                  </span>
                </div>

                <div className="space-y-1 text-muted-foreground">
                  <div>
                    <strong className="text-foreground font-medium">Time:</strong> {course.schedule}
                  </div>
                  <div>
                    <strong className="text-foreground font-medium">Venue:</strong> {course.room}
                  </div>
                </div>

                <div className="pt-2 border-t flex items-center justify-between">
                  <Link
                    href={`/teacher/students?offeringId=${course.id}`}
                    className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                  >
                    View Roster <ArrowRight className="size-3" />
                  </Link>

                  <Link
                    href={`/teacher/grades?offeringId=${course.id}`}
                    className="text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    Grade Sheet
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Action Banner for pending grades */}
      <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <AlertCircle className="size-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-200">
              Grade Submission Deadline Approaching
            </h4>
            <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
              Midterm assessments for CSE-202 (Section B) are due by Oct 15, 2026.
            </p>
          </div>
        </div>
        <Button size="sm" variant="default" render={<Link href="/teacher/grades" />}>
          Submit CSE-202 Grades
        </Button>
      </div>
    </div>
  );
}
