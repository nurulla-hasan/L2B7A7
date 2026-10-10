import type { Metadata } from "next";
import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  Award,
  Users,
  Building2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Laptop,
  CreditCard,
  FileCheck2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Apex University | World-Class Academic Excellence & Research",
  description:
    "An internationally accredited university delivering future-ready education, cutting-edge research laboratories, and seamless digital campus management.",
};

const STATS = [
  { value: "14,500+", label: "Enrolled Students", detail: "Across all academic terms", icon: Users },
  { value: "450+", label: "Distinguished Faculty", detail: "PhD researchers & industry experts", icon: Award },
  { value: "98.2%", label: "Career Placement", detail: "Employed within 6 months", icon: CheckCircle2 },
  { value: "48+", label: "Accredited Programs", detail: "Undergraduate & Graduate degrees", icon: BookOpen },
];

const FACULTIES = [
  {
    code: "CSE / IT",
    title: "School of Engineering & Computing",
    description: "Industry-aligned software engineering, artificial intelligence, computer architecture, and cybersecurity programs.",
    degrees: "B.Sc in CSE, B.Sc in EEE, M.Sc in Data Science",
    icon: Laptop,
  },
  {
    code: "BBA / MBA",
    title: "School of Business & Economics",
    description: "Equipping visionary corporate entrepreneurs, financial analysts, and marketing leaders with global business acumen.",
    degrees: "BBA, MBA, Executive MBA, B.Sc in Economics",
    icon: Building2,
  },
  {
    code: "ARTS / LAW",
    title: "School of Humanities & Social Sciences",
    description: "Fostering critical debate, public policy, legal advocacy, and international diplomacy.",
    degrees: "LL.B (Honours), B.A in English, Masters in Governance",
    icon: GraduationCap,
  },
];

const DIGITAL_FEATURES = [
  {
    title: "Real-Time Course Registration",
    description: "Student portal with live seat counters, conflict validation, and instantaneous faculty section allocation.",
    icon: BookOpen,
  },
  {
    title: "Automated Tuition Payments",
    description: "Safe digital tuition clearance with instant bKash checkout and automated financial ledger sync.",
    icon: CreditCard,
  },
  {
    title: "Transparent Grading & GPA",
    description: "Faculty grade evaluation with transparent draft reviews and instant student grade reports.",
    icon: FileCheck2,
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col space-y-16 sm:space-y-24 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 lg:pt-24 border-b border-border/40 pb-16 lg:pb-24">
        {/* Subtle background glow */}
        <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
          <div className="size-96 rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5" />
            <span>Admissions Open for Fall 2026 Academic Term</span>
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-foreground leading-[1.15]">
            Empowering Minds. Shaping Tomorrow&apos;s Leaders.
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            Welcome to Apex University. Experience world-class faculty instruction, state-of-the-art research laboratories, and an intelligent digital campus designed for student success.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button size="lg" render={<Link href="/register" />}>
              Apply Online Today
              <ArrowRight className="size-4" />
            </Button>
            <Button variant="outline" size="lg" render={<Link href="/academics" />}>
              Explore Academic Programs
            </Button>
            <Button variant="ghost" size="lg" render={<Link href="/login" />}>
              Sign In to Portal
            </Button>
          </div>

          <div className="pt-6 flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-emerald-500" />
              UGC Approved & Accredited
            </span>
            <span>•</span>
            <span>100% Digital Campus Portal</span>
            <span>•</span>
            <span>Global Academic Exchange</span>
          </div>
        </div>
      </section>

      {/* 2. Key University Metrics */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => (
            <Card key={stat.label} className="border-border/60 shadow-xs">
              <CardContent className="flex items-center justify-between p-6">
                <div className="space-y-1">
                  <p className="font-mono text-3xl font-extrabold text-foreground tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {stat.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stat.detail}
                  </p>
                </div>
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <stat.icon className="size-6" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 3. Academic Programs & Faculties */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/60 pb-4">
          <div className="space-y-1">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
              Curriculum & Disciplines
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Distinguished Academic Schools
            </h2>
            <p className="text-sm text-muted-foreground">
              Comprehensive undergraduate and postgraduate degrees tailored for industry demand.
            </p>
          </div>
          <Button variant="outline" render={<Link href="/academics" />}>
            All 48+ Programs
            <ArrowRight className="size-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {FACULTIES.map((fac) => (
            <Card key={fac.title} className="flex flex-col justify-between hover:border-primary/50 transition-colors">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <fac.icon className="size-5" />
                  </div>
                  <Badge variant="outline" className="font-mono text-2xs font-semibold">
                    {fac.code}
                  </Badge>
                </div>
                <CardTitle className="text-lg font-bold text-foreground">
                  {fac.title}
                </CardTitle>
                <CardDescription className="text-xs leading-relaxed">
                  {fac.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="rounded-lg border border-border bg-muted/40 p-3 text-xs space-y-1">
                  <span className="text-2xs font-semibold uppercase text-muted-foreground">
                    Degrees Offered
                  </span>
                  <p className="font-medium text-foreground">
                    {fac.degrees}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 4. Digital Campus Capabilities */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="rounded-2xl border border-border bg-muted/30 p-8 sm:p-12 space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
              Smart University Ecosystem
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Integrated Campus Management
            </h2>
            <p className="text-sm text-muted-foreground">
              Our custom university management portal empowers students, professors, and academic administrators with real-time academic workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {DIGITAL_FEATURES.map((feat) => (
              <div key={feat.title} className="rounded-xl border border-border bg-background p-5 space-y-2.5">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <feat.icon className="size-5" />
                </div>
                <h3 className="font-bold text-sm text-foreground">
                  {feat.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Call To Action Banner */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 sm:p-12 text-center space-y-6">
          <GraduationCap className="size-12 mx-auto text-primary" />
          <div className="max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Begin Your Academic Journey Today
            </h2>
            <p className="text-sm text-muted-foreground">
              Join thousands of aspiring scholars. Apply for undergraduate and graduate admissions or consult our admissions counselors.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" render={<Link href="/register" />}>
              Submit Application
              <ArrowRight className="size-4" />
            </Button>
            <Button variant="outline" size="lg" render={<Link href="/tuition" />}>
              Tuition & Scholarships
            </Button>
            <Button variant="outline" size="lg" render={<Link href="/contact" />}>
              Contact Admissions
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
