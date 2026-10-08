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
  RefreshCw,
  AlertCircle,
  Inbox,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useGetUserDashboardStats,
  useGetAllEnrollments,
  useGetAllAuditLogs,
  useGetSemesters,
} from "@/services";
import { formatRelativeTime } from "@/lib/utils";
import { SectionHeading } from "@/components/common/section-heading";
import { AuditActionBadge } from "../audit-logs/_components/audit-action-badge";
import { AuditDetailsModal } from "../audit-logs/_components/audit-details-modal";
import { getErrorMessage } from "@/lib/error";

export default function AdminDashboardPage() {
  // 1. Primary real-time dashboard KPIs from backend
  const {
    data: statsResponse,
    isLoading: isStatsLoading,
    isFetching: isStatsFetching,
    isError: isStatsError,
    error: statsError,
    refetch: refetchStats,
  } = useGetUserDashboardStats();

  // 2. Active / latest academic semester
  const { data: semestersResponse } = useGetSemesters({
    limit: 1,
    sortBy: "newest",
  });

  // 3. Recent 5 student enrollments
  const {
    data: enrollmentsResponse,
    isLoading: isEnrollmentsLoading,
    isFetching: isEnrollmentsFetching,
    refetch: refetchEnrollments,
  } = useGetAllEnrollments({
    limit: 5,
    sortBy: "newest",
  });

  // 4. Recent 5 audit logs
  const {
    data: auditResponse,
    isLoading: isAuditLoading,
    isFetching: isAuditFetching,
    refetch: refetchAudit,
  } = useGetAllAuditLogs({
    limit: 5,
  });

  const stats = statsResponse?.data;
  const recentEnrollments = enrollmentsResponse?.data ?? [];
  const recentAuditLogs = auditResponse?.data ?? [];
  const latestSemester = semestersResponse?.data?.[0];

  const isRefreshing =
    isStatsFetching || isEnrollmentsFetching || isAuditFetching;

  const handleRefresh = () => {
    refetchStats();
    refetchEnrollments();
    refetchAudit();
  };

  // Settlement percentage rate
  const totalEnrollments = stats?.enrollments.total ?? 0;
  const enrolledCount = stats?.enrollments.enrolled ?? 0;
  const settlementRate =
    totalEnrollments > 0
      ? Math.round((enrolledCount / totalEnrollments) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <SectionHeading
        title="Admin Overview"
        description="Real-time university operations, enrollment status, and financial reconciliation."
        alignment="left"
        as="h3"
      >
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-1.5"
          >
            <RefreshCw
              className={`size-3.5 ${isRefreshing ? "animate-spin text-primary" : ""}`}
            />
            <span>Refresh</span>
          </Button>

          <Button
            variant="outline"
            render={<Link href="/admin/audit-logs" />}
          >
            <ShieldCheck />
            Audit Logs
          </Button>

          <Button render={<Link href="/admin/course-offerings" />}>
            <Plus />
            New Offering
          </Button>
        </div>
      </SectionHeading>

      {/* Error Banner if Stats fail */}
      {isStatsError && (
        <Card className="border-destructive/30 bg-destructive/5 text-destructive p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium">
              <AlertCircle className="size-4 shrink-0" />
              <span>Failed to load live overview statistics: {getErrorMessage(statsError)}</span>
            </div>
            <Button
              variant="outline"
              onClick={() => refetchStats()}
              className="text-xs border-destructive/30"
            >
              Retry
            </Button>
          </div>
        </Card>
      )}

      {/* Primary KPI Grid */}
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
            {isStatsLoading ? (
              <div className="space-y-2 py-1">
                <Skeleton className="h-7 w-20" />
                <Skeleton className="h-4 w-44" />
                <Skeleton className="h-3 w-28" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold tracking-tight text-foreground">
                  {stats?.users.total.toLocaleString() ?? 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats?.users.students ?? 0} Students •{" "}
                  {stats?.users.teachers ?? 0} Faculty •{" "}
                  {stats?.users.admins ?? 0} Admins
                </p>
                <div className="text-[11px] font-medium text-muted-foreground pt-1 flex items-center gap-1">
                  <span>Blocked accounts: {stats?.users.blocked ?? 0}</span>
                </div>
              </>
            )}
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
            {isStatsLoading ? (
              <div className="space-y-2 py-1">
                <Skeleton className="h-7 w-28" />
                <Skeleton className="h-4 w-44" />
                <Skeleton className="h-3 w-28" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold tracking-tight text-foreground">
                  {latestSemester
                    ? `${latestSemester.name} ${latestSemester.year}`
                    : "No Active Term"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats?.academics.courseOfferings ?? 0} Active Offerings •{" "}
                  {stats?.academics.courses ?? 0} Courses
                </p>
                <div className="text-[11px] font-medium text-muted-foreground pt-1">
                  Total Semesters: {stats?.academics.semesters ?? 0}
                </div>
              </>
            )}
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
            {isStatsLoading ? (
              <div className="space-y-2 py-1">
                <Skeleton className="h-7 w-16" />
                <Skeleton className="h-4 w-44" />
                <Skeleton className="h-3 w-28" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold tracking-tight text-foreground">
                  {stats?.enrollments.total ?? 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats?.enrollments.enrolled ?? 0} Confirmed •{" "}
                  {stats?.enrollments.pendingPayment ?? 0} Pending
                </p>
                <div className="text-[11px] font-medium text-muted-foreground pt-1 flex items-center gap-1">
                  <TrendingUp className="size-3 text-emerald-500" />
                  <span>{settlementRate}% settlement rate</span>
                </div>
              </>
            )}
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
            {isStatsLoading ? (
              <div className="space-y-2 py-1">
                <Skeleton className="h-7 w-28" />
                <Skeleton className="h-4 w-44" />
                <Skeleton className="h-3 w-28" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold tracking-tight text-foreground">
                  ৳ {Number(stats?.finance.totalRevenueBDT || 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats?.finance.successfulTransactions ?? 0} Paid Invoices
                </p>
                <div className="text-[11px] font-medium text-muted-foreground pt-1">
                  bKash & SSLCOMMERZ
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Secondary Performance Banner: Exam Results Moderation */}
      <Card>
        <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-background border border-border text-primary shadow-xs">
              <FileCheck2 className="size-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">
                Semester Results Status
              </div>
              {isStatsLoading ? (
                <Skeleton className="h-4 w-60 mt-1" />
              ) : (
                <div className="text-xs text-muted-foreground">
                  {stats?.results.published ?? 0} Published to student portals •{" "}
                  {stats?.results.drafts ?? 0} Pending admin moderation
                </div>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            render={<Link href="/admin/results" />}
          >
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
              <CardTitle className="text-base font-semibold">
                Recent Student Enrollments
              </CardTitle>
              <CardDescription>
                Latest registrations and payment states
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              render={<Link href="/admin/enrollments" />}
            >
              View All <ArrowUpRight/>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {isEnrollmentsLoading ? (
              <div className="p-4 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between gap-4 py-2 border-b border-border/50 last:border-b-0">
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                ))}
              </div>
            ) : recentEnrollments.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                <Inbox className="size-8 mb-2 opacity-50" />
                <p className="text-sm font-medium">No enrollments yet</p>
                <p className="text-xs">Student registrations will appear here in real-time.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Student</TableHead>
                    <TableHead>Course & Section</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentEnrollments.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="font-medium text-foreground">
                          {item.student?.name ?? "Student"}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {item.student?.studentProfile?.studentId || item.student?.email}
                          {item.student?.studentProfile?.department &&
                            ` • ${item.student.studentProfile.department}`}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium text-foreground">
                          {item.courseOffering?.course?.code ?? "Course"} ({item.courseOffering?.section ?? "A"})
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.courseOffering?.course?.title ?? "Course Offering"}
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
                        {formatRelativeTime(item.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Audit Activity Trail (1 col) */}
        <Card className="shadow-xs flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-semibold">
                Audit Activity Trail
              </CardTitle>
              <CardDescription>
                Recent security & academic operations
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              render={<Link href="/admin/audit-logs" />}
            >
              <ArrowUpRight className="size-3.5" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 space-y-3">
            {isAuditLoading ? (
              <div className="space-y-3 py-1">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-1.5 pb-3 border-b border-border/50 last:border-b-0">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                ))}
              </div>
            ) : recentAuditLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                <Inbox className="size-8 mb-2 opacity-50" />
                <p className="text-sm font-medium">No audit logs</p>
                <p className="text-xs">Security operations will appear here.</p>
              </div>
            ) : (
              recentAuditLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex flex-col gap-1 text-sm border-b border-border pb-3 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-center justify-between text-xs">
                    <AuditActionBadge action={log.action} />
                    <span className="text-[11px] text-muted-foreground">
                      {formatRelativeTime(log.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <div className="text-[11px] text-muted-foreground">
                      <span>Operator: {log.user?.name ?? "System"}</span>
                      <span className="mx-1">•</span>
                      <span className="font-mono text-[10px] text-foreground/80">
                        {log.resource}
                      </span>
                    </div>
                    <AuditDetailsModal log={log} />
                  </div>
                </div>
              ))
            )}
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
            <div className="text-sm font-semibold text-foreground">
              User Management
            </div>
            <div className="text-xs text-muted-foreground">
              {stats?.users.students ?? 0} Students, {stats?.users.teachers ?? 0} Faculty
            </div>
          </div>
          <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </Link>

        <Link
          href="/admin/semesters"
          className="p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors flex items-center justify-between group"
        >
          <div>
            <div className="text-sm font-semibold text-foreground">
              Semesters
            </div>
            <div className="text-xs text-muted-foreground">
              {stats?.academics.semesters ?? 0} Terms configured
            </div>
          </div>
          <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </Link>

        <Link
          href="/admin/courses"
          className="p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors flex items-center justify-between group"
        >
          <div>
            <div className="text-sm font-semibold text-foreground">
              Course Catalog
            </div>
            <div className="text-xs text-muted-foreground">
              {stats?.academics.courses ?? 0} Courses in catalog
            </div>
          </div>
          <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </Link>

        <Link
          href="/admin/payments"
          className="p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors flex items-center justify-between group"
        >
          <div>
            <div className="text-sm font-semibold text-foreground">
              Payments & Fees
            </div>
            <div className="text-xs text-muted-foreground">
              {stats?.finance.successfulTransactions ?? 0} Paid transactions
            </div>
          </div>
          <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </Link>
      </div>
    </div>
  );
}
