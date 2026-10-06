"use client";

import Link from "next/link";
import {
  BookOpenCheck,
  Award,
  CreditCard,
  CalendarRange,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function StudentDashboardPage() {
  const stats = [
    {
      title: "Current Semester",
      value: "Spring 2026",
      change: "Week 7 of 14",
      icon: CalendarRange,
      description: "Term ends May 30, 2026",
    },
    {
      title: "Enrolled Courses",
      value: "4 Courses",
      change: "12 Credit Hours",
      icon: BookOpenCheck,
      description: "Full-Time Academic Status",
    },
    {
      title: "Cumulative CGPA",
      value: "3.84",
      change: "Top 5% of Batch",
      icon: Award,
      description: "Out of 4.00 scale",
    },
    {
      title: "Tuition Balance",
      value: "৳ 15,000",
      change: "Due in 5 days",
      icon: CreditCard,
      description: "Spring Term Installment",
    },
  ];

  const enrolledCourses = [
    {
      id: "enr-1",
      code: "CSE-101",
      title: "Introduction to Programming",
      instructor: "Dr. Golap Hasan",
      credits: 3.0,
      section: "Section A",
      schedule: "Sun, Tue (10:00 AM - 11:30 AM)",
      room: "Room 402",
      status: "ENROLLED" as const,
      grade: "A (4.00)",
      isGradePublished: true,
    },
    {
      id: "enr-2",
      code: "CSE-202",
      title: "Data Structures & Algorithms",
      instructor: "Prof. Sarah Ahmed",
      credits: 3.0,
      section: "Section B",
      schedule: "Mon, Wed (01:00 PM - 02:30 PM)",
      room: "Lab 3",
      status: "ENROLLED" as const,
      grade: "Evaluation in progress",
      isGradePublished: false,
    },
    {
      id: "enr-3",
      code: "MAT-101",
      title: "Calculus & Linear Algebra",
      instructor: "Dr. K. M. Rahman",
      credits: 3.0,
      section: "Section A",
      schedule: "Sun, Tue (08:30 AM - 10:00 AM)",
      room: "Room 301",
      status: "ENROLLED" as const,
      grade: "A- (3.70)",
      isGradePublished: true,
    },
    {
      id: "enr-4",
      code: "PHY-102",
      title: "General Physics I",
      instructor: "Dr. Farhana Islam",
      credits: 3.0,
      section: "Section C",
      schedule: "Mon, Wed (10:00 AM - 11:30 AM)",
      room: "Science Bldg Lab 1",
      status: "PENDING_PAYMENT" as const,
      grade: "Pending Fee Clearance",
      isGradePublished: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Student Portal</h1>
            <Badge variant="success" className="text-xs">
              Active Student
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Tanvir Rahman • ID: STU-2026-0042 • Dept. of Computer Science & Engineering
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" render={<Link href="/student/registration" />}>
            <Sparkles className="size-4 mr-1.5 text-primary" />
            Add Courses
          </Button>
          <Button size="sm" render={<Link href="/student/payments" />}>
            <CreditCard className="size-4 mr-1.5" />
            Pay Fees
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
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <stat.icon className="size-4" />
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              <div className="text-[11px] font-medium text-foreground/80 pt-1">
                {stat.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment Alert Banner */}
      <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <AlertTriangle className="size-5 shrink-0" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">
              Semester Tuition Payment Notice
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Outstanding tuition balance of <strong>৳ 15,000</strong> for PHY-102. Pay seamlessly via bKash or SSLCOMMERZ gateway.
            </p>
          </div>
        </div>
        <Button size="sm" render={<Link href="/student/payments" />} className="shrink-0">
          Pay with bKash / Card
        </Button>
      </div>

      {/* Enrolled Courses Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Registered Classes (Spring 2026)</h2>
            <p className="text-xs text-muted-foreground">Weekly course timetable, professors, and published grades</p>
          </div>
          <Button variant="ghost" size="sm" render={<Link href="/student/my-courses" />}>
            View Full Timetable <ArrowRight className="size-3.5 ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {enrolledCourses.map((c) => (
            <Card key={c.id} className="shadow-xs hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-xs font-semibold">
                      {c.code}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{c.credits} Credits</span>
                  </div>
                  {c.status === "ENROLLED" ? (
                    <Badge variant="success" className="gap-1 text-[11px]">
                      <CheckCircle2 className="size-3" /> Enrolled
                    </Badge>
                  ) : (
                    <Badge variant="warning" className="gap-1 text-[11px]">
                      <Clock className="size-3" /> Unpaid Fee
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-base font-semibold leading-snug mt-2">
                  {c.title}
                </CardTitle>
                <CardDescription className="text-xs">
                  Instructor: <strong className="text-foreground">{c.instructor}</strong> • {c.section}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-2 text-xs pt-0">
                <div className="p-2.5 rounded-lg bg-muted/40 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Class Schedule:</span>
                    <span className="font-medium text-foreground">{c.schedule}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Lecture Venue:</span>
                    <span className="font-medium text-foreground">{c.room}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-muted-foreground">Term Grade:</span>
                  <span
                    className={`font-semibold ${
                      c.isGradePublished ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
                    }`}
                  >
                    {c.grade}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
