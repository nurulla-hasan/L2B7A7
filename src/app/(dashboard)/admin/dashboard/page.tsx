"use client";

import Link from "next/link";
import {
  Users,
  CalendarRange,
  GraduationCap,
  CreditCard,
  ArrowUpRight,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Ban,
  FileCheck2,
  TrendingUp,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminDashboardPage() {
  // Static dataset mirroring backend userService.getDashboardStatsFromDB()
  const dashboardStats = {
    users: {
      total: 1248,
      students: 980,
      teachers: 84,
      admins: 6,
      blocked: 12,
    },
    academics: {
      semesters: 4,
      activeSemester: "Spring 2026",
      courses: 28,
      courseOfferings: 86,
    },
    enrollments: {
      total: 312,
      enrolled: 280,
      pendingPayment: 32,
    },
    finance: {
      totalRevenueBDT: "৳ 4,850,000",
      successfulTransactions: 280,
      gateways: "bKash & SSLCOMMERZ",
    },
    results: {
      total: 240,
      published: 190,
      drafts: 50,
    },
  };

  // Recent enrollments mirroring backend Prisma Enrollment model & relations
  const recentEnrollments = [
    {
      id: "enr-01",
      student: {
        name: "Tanvir Rahman",
        studentId: "STU-2026-0042",
        department: "Computer Science & Engineering",
      },
      offering: {
        courseCode: "CSE-101",
        courseTitle: "Introduction to Programming",
        section: "Section A",
        fee: "৳ 15,000",
      },
      status: "ENROLLED" as const,
      timestamp: "Today, 11:20 AM",
    },
    {
      id: "enr-02",
      student: {
        name: "Nusrat Jahan",
        studentId: "STU-2026-0089",
        department: "Electrical & Electronic Engineering",
      },
      offering: {
        courseCode: "CSE-202",
        courseTitle: "Data Structures & Algorithms",
        section: "Section B",
        fee: "৳ 15,000",
      },
      status: "PENDING_PAYMENT" as const,
      timestamp: "Today, 10:45 AM",
    },
    {
      id: "enr-03",
      student: {
        name: "Arafat Hossain",
        studentId: "STU-2025-0193",
        department: "Computer Science & Engineering",
      },
      offering: {
        courseCode: "EEE-105",
        courseTitle: "Electrical Circuits Analysis",
        section: "Section A",
        fee: "৳ 16,500",
      },
      status: "ENROLLED" as const,
      timestamp: "Yesterday, 04:15 PM",
    },
    {
      id: "enr-04",
      student: {
        name: "Sadia Sultana",
        studentId: "STU-2026-0112",
        department: "Mathematics",
      },
      offering: {
        courseCode: "MAT-101",
        courseTitle: "Calculus & Linear Algebra",
        section: "Section C",
        fee: "৳ 12,000",
      },
      status: "DROPPED" as const,
      timestamp: "Oct 04, 2026",
    },
    {
      id: "enr-05",
      student: {
        name: "Mahmudul Hasan",
        studentId: "STU-2024-0018",
        department: "Computer Science & Engineering",
      },
      offering: {
        courseCode: "CSE-301",
        courseTitle: "Database Management Systems",
        section: "Section A",
        fee: "৳ 15,000",
      },
      status: "ENROLLED" as const,
      timestamp: "Oct 03, 2026",
    },
  ];

  // Recent audit trail mirroring backend Prisma AuditLog model & AuditAction enum
  const recentAuditLogs = [
    {
      id: "log-1",
      action: "PAYMENT_SUCCESS",
      resource: "Payment",
      actor: "Tanvir Rahman",
      detail: "Completed tuition ৳ 15,000 via bKash (Txn: TR-892183)",
      time: "15 mins ago",
    },
    {
      id: "log-2",
      action: "PUBLISH_RESULT",
      resource: "Result",
      actor: "Prof. Sarah Ahmed",
      detail: "Published official grade sheet for CSE-202 (Sec B)",
      time: "2 hours ago",
    },
    {
      id: "log-3",
      action: "CREATE_COURSE_OFFERING",
      resource: "CourseOffering",
      actor: "Dr. Golap Hasan",
      detail: "Created CSE-305 Computer Architecture Section B (Cap: 40)",
      time: "5 hours ago",
    },
    {
      id: "log-4",
      action: "UPDATE_USER_STATUS",
      resource: "User",
      actor: "Admin Security",
      detail: "Activated student account STU-2026-0042 after email verification",
      time: "1 day ago",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Admin Overview
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time university operations, enrollment status, and financial reconciliation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" render={<Link href="/admin/audit-logs" />}>
            <ShieldCheck className="size-4 mr-1.5" />
            Audit Logs
          </Button>
          <Button size="sm" render={<Link href="/admin/course-offerings" />}>
            <Plus className="size-4 mr-1.5" />
            New Offering
          </Button>
        </div>
      </div>

      {/* Primary KPI Grid (Directly mirroring backend dashboard-stats) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <Card className="shadow-xs hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Total University Users
            </CardTitle>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Users className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {dashboardStats.users.total.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {dashboardStats.users.students} Students • {dashboardStats.users.teachers} Faculty • {dashboardStats.users.admins} Admins
            </p>
            <div className="text-[11px] font-medium text-muted-foreground pt-1 flex items-center gap-1">
              <span>Blocked accounts: {dashboardStats.users.blocked}</span>
            </div>
          </CardContent>
        </Card>

        {/* Academic Offerings & Semesters */}
        <Card className="shadow-xs hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Active Semester
            </CardTitle>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <CalendarRange className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {dashboardStats.academics.activeSemester}
            </div>
            <p className="text-xs text-muted-foreground">
              {dashboardStats.academics.courseOfferings} Active Offerings • {dashboardStats.academics.courses} Courses
            </p>
            <div className="text-[11px] font-medium text-muted-foreground pt-1">
              Total Semesters: {dashboardStats.academics.semesters}
            </div>
          </CardContent>
        </Card>

        {/* Enrollments Status */}
        <Card className="shadow-xs hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Course Enrollments
            </CardTitle>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <GraduationCap className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {dashboardStats.enrollments.total}
            </div>
            <p className="text-xs text-muted-foreground">
              {dashboardStats.enrollments.enrolled} Confirmed • {dashboardStats.enrollments.pendingPayment} Pending
            </p>
            <div className="text-[11px] font-medium text-muted-foreground pt-1 flex items-center gap-1">
              <TrendingUp className="size-3 text-primary" />
              <span>90% settlement rate</span>
            </div>
          </CardContent>
        </Card>

        {/* Tuition Revenue */}
        <Card className="shadow-xs hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Tuition Revenue (YTD)
            </CardTitle>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <CreditCard className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {dashboardStats.finance.totalRevenueBDT}
            </div>
            <p className="text-xs text-muted-foreground">
              {dashboardStats.finance.successfulTransactions} Paid Invoices
            </p>
            <div className="text-[11px] font-medium text-muted-foreground pt-1">
              {dashboardStats.finance.gateways}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Performance Banner: Exam Results Moderation */}
      <Card className="shadow-xs border-border bg-muted/30">
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-background border border-border text-primary shadow-xs">
              <FileCheck2 className="size-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">
                Semester Results Status ({dashboardStats.academics.activeSemester})
              </div>
              <div className="text-xs text-muted-foreground">
                {dashboardStats.results.published} Published to student portals • {dashboardStats.results.drafts} Pending admin moderation
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" render={<Link href="/admin/results" />}>
            Moderate Results
          </Button>
        </CardContent>
      </Card>

      {/* Main Grid: Recent Enrollments Table + Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Enrollments Table (2 cols) */}
        <Card className="lg:col-span-2 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-semibold">Recent Student Enrollments</CardTitle>
              <CardDescription>
                Registrations and payment states for {dashboardStats.academics.activeSemester}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" render={<Link href="/admin/enrollments" />}>
              View All <ArrowUpRight className="size-3.5 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Student</TableHead>
                  <TableHead>Offering & Fee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentEnrollments.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="font-medium text-foreground">{item.student.name}</div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {item.student.studentId} • {item.student.department}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium text-foreground">
                        {item.offering.courseCode} ({item.offering.section})
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.offering.fee}
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.status === "ENROLLED" && (
                        <Badge variant="success" className="gap-1 text-[11px]">
                          <CheckCircle2 className="size-3" /> Enrolled
                        </Badge>
                      )}
                      {item.status === "PENDING_PAYMENT" && (
                        <Badge variant="warning" className="gap-1 text-[11px]">
                          <Clock className="size-3" /> Pending Payment
                        </Badge>
                      )}
                      {item.status === "DROPPED" && (
                        <Badge variant="destructive" className="gap-1 text-[11px]">
                          <Ban className="size-3" /> Dropped
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground whitespace-nowrap">
                      {item.timestamp}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Audit Activity Trail (1 col) */}
        <Card className="shadow-xs flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-semibold">Audit Activity Trail</CardTitle>
              <CardDescription>System log of security & academic operations</CardDescription>
            </div>
            <Button variant="ghost" size="sm" render={<Link href="/admin/audit-logs" />}>
              <ArrowUpRight className="size-3.5" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            {recentAuditLogs.map((log) => (
              <div key={log.id} className="flex flex-col gap-1 text-sm border-b border-border pb-3 last:border-b-0 last:pb-0">
                <div className="flex items-center justify-between text-xs">
                  <Badge variant="outline" className="font-mono text-[10px] py-0 px-1.5 font-semibold text-primary">
                    {log.action}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{log.time}</span>
                </div>
                <p className="text-xs text-foreground/90 mt-1">{log.detail}</p>
                <div className="text-[11px] text-muted-foreground flex items-center justify-between pt-0.5">
                  <span>Actor: {log.actor}</span>
                  <span className="font-mono text-[10px]">{log.resource}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Navigation Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          href="/admin/users"
          className="p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors flex items-center justify-between group"
        >
          <div>
            <div className="text-sm font-semibold text-foreground">User Management</div>
            <div className="text-xs text-muted-foreground">980 Students, 84 Faculty</div>
          </div>
          <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </Link>

        <Link
          href="/admin/semesters"
          className="p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors flex items-center justify-between group"
        >
          <div>
            <div className="text-sm font-semibold text-foreground">Semesters</div>
            <div className="text-xs text-muted-foreground">Term timelines & status</div>
          </div>
          <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </Link>

        <Link
          href="/admin/courses"
          className="p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors flex items-center justify-between group"
        >
          <div>
            <div className="text-sm font-semibold text-foreground">Course Catalog</div>
            <div className="text-xs text-muted-foreground">28 Courses, credit syllabus</div>
          </div>
          <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </Link>

        <Link
          href="/admin/payments"
          className="p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors flex items-center justify-between group"
        >
          <div>
            <div className="text-sm font-semibold text-foreground">Payments & Fees</div>
            <div className="text-xs text-muted-foreground">bKash & SSLCOMMERZ records</div>
          </div>
          <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </Link>
      </div>
    </div>
  );
}
