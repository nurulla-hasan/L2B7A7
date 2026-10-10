import type { Metadata } from "next";
import Link from "next/link";
import {
  GraduationCap,
  Award,
  CheckCircle2,
  Compass,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About Us | Apex University History & Mission",
  description:
    "Learn about Apex University's founding legacy, academic mission, accreditation credentials, and governance leadership.",
};

const LEADERSHIP = [
  {
    name: "Prof. Dr. M. R. Rahman",
    role: "Vice Chancellor",
    bio: "Former Fellow of Cambridge University, leading institutional modernization and research funding.",
  },
  {
    name: "Prof. Dr. Tahmina Chowdhury",
    role: "Pro-Vice Chancellor (Academic)",
    bio: "Specializing in curriculum development, international accreditations, and inter-university research.",
  },
  {
    name: "Prof. Dr. Kazi Shafiul Alam",
    role: "Dean, School of Engineering",
    bio: "Senior IEEE Fellow overseeing computing laboratories, AI development, and industry fellowships.",
  },
  {
    name: "Dr. Farzana Yasmin",
    role: "Dean, School of Business",
    bio: "Harvard Business School alumni directing corporate partnerships and executive development programs.",
  },
];

const ACCREDITATIONS = [
  { name: "University Grants Commission (UGC)", type: "Government Approval & Statutory Recognition" },
  { name: "Institution of Engineers Bangladesh (IEB)", type: "Engineering Accreditation Board" },
  { name: "ACBSP Global Business Accreditation", type: "International Business Program Certification" },
  { name: "Washington Accord Signatory Alignment", type: "Global Engineering Mobility Standard" },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-16 sm:space-y-24 pb-20">
      {/* 1. Header Section */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
          <GraduationCap className="size-3.5" />
          <span>Founded in 2004 • Celebrating 22 Years of Distinction</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-foreground">
          About Apex University
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          Committed to academic leadership, intellectual discovery, and social transformation. We prepare scholars to thrive in an increasingly complex and interconnected world.
        </p>
      </section>

      {/* 2. Mission & Vision Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border/80 shadow-xs">
          <CardHeader className="space-y-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Compass className="size-5" />
            </div>
            <CardTitle className="text-xl font-bold text-foreground">
              Our Academic Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground leading-relaxed">
            To provide accessible, high-caliber higher education rooted in scientific exploration, ethical responsibility, and student-centered learning. We foster critical inquiry and real-world problem-solving across engineering, commerce, and humanistic disciplines.
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-xs">
          <CardHeader className="space-y-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Award className="size-5" />
            </div>
            <CardTitle className="text-xl font-bold text-foreground">
              Our Global Vision
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground leading-relaxed">
            To be recognized as a premier center of higher learning in South Asia, distinguished for groundbreaking research output, state-of-the-art technological infrastructure, and graduates who pioneer innovation across international industries.
          </CardContent>
        </Card>
      </section>

      {/* 3. Accreditations & Recognitions */}
      <section className="space-y-6">
        <div className="border-b border-border/60 pb-3">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Accreditations & Global Standards
          </h2>
          <p className="text-xs text-muted-foreground">
            Our degree programs are verified and endorsed by premier domestic and international bodies.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ACCREDITATIONS.map((acc) => (
            <div
              key={acc.name}
              className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-xs"
            >
              <CheckCircle2 className="size-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm text-foreground">{acc.name}</p>
                <p className="text-muted-foreground mt-0.5">{acc.type}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. University Leadership */}
      <section className="space-y-6">
        <div className="border-b border-border/60 pb-3">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Executive Leadership & Deans
          </h2>
          <p className="text-xs text-muted-foreground">
            Distinguished scholars driving institutional governance and pedagogical excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {LEADERSHIP.map((lead) => (
            <Card key={lead.name} className="flex flex-col justify-between">
              <CardHeader className="space-y-1.5 pb-3">
                <CardTitle className="text-base font-bold text-foreground">
                  {lead.name}
                </CardTitle>
                <p className="text-2xs font-semibold text-primary uppercase tracking-wider">
                  {lead.role}
                </p>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground leading-relaxed">
                {lead.bio}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 5. Bottom Navigation Banner */}
      <section className="rounded-2xl border border-border bg-muted/40 p-8 text-center space-y-4">
        <h3 className="text-xl font-bold text-foreground">
          Ready to Explore Our Degree Programs?
        </h3>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          Discover our 48+ accredited degree offerings and faculty departments.
        </p>
        <div className="flex justify-center gap-3">
          <Button render={<Link href="/academics" />}>
            Browse Degree Programs
            <ArrowRight className="size-4" />
          </Button>
          <Button variant="outline" render={<Link href="/contact" />}>
            Contact University
          </Button>
        </div>
      </section>
    </div>
  );
}
