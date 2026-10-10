import type { Metadata } from "next";
import Link from "next/link";
import {
  Laptop,
  Building2,
  Scale,
  FlaskConical,
  Clock,
  BookOpen,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Academic Programs & Faculties | Apex University",
  description:
    "Explore our accredited degree programs across engineering, computer science, business administration, legal studies, and pharmaceutical sciences.",
};

const PROGRAMS = [
  {
    category: "Engineering & Computing",
    icon: Laptop,
    badge: "Faculty of Engineering",
    degrees: [
      {
        title: "B.Sc. in Computer Science & Engineering",
        code: "CSE",
        duration: "4 Years (8 Semesters)",
        credits: "144 Credits",
        summary: "Specializations in Software Engineering, Artificial Intelligence, Cybersecurity, and Cloud Systems.",
      },
      {
        title: "B.Sc. in Electrical & Electronic Engineering",
        code: "EEE",
        duration: "4 Years (8 Semesters)",
        credits: "148 Credits",
        summary: "Curriculum focusing on Embedded Systems, Telecommunications, Robotics, and Renewable Energy.",
      },
      {
        title: "M.Sc. in Artificial Intelligence & Data Science",
        code: "MS-AI",
        duration: "1.5 - 2 Years",
        credits: "36 Credits",
        summary: "Advanced postgraduate training in Machine Learning, Deep Neural Networks, and Big Data Architecture.",
      },
    ],
  },
  {
    category: "Business & Management",
    icon: Building2,
    badge: "Faculty of Business",
    degrees: [
      {
        title: "Bachelor of Business Administration (BBA)",
        code: "BBA",
        duration: "4 Years (8 Semesters)",
        credits: "130 Credits",
        summary: "Majors in Corporate Finance, Strategic Marketing, Supply Chain Management, and Human Resources.",
      },
      {
        title: "Master of Business Administration (MBA)",
        code: "MBA",
        duration: "1 - 2 Years",
        credits: "60 Credits",
        summary: "Rigorous case-study based program designed for emerging executives, managers, and entrepreneurs.",
      },
    ],
  },
  {
    category: "Law & Humanities",
    icon: Scale,
    badge: "Faculty of Law & Arts",
    degrees: [
      {
        title: "Bachelor of Laws (LL.B Honours)",
        code: "LLB",
        duration: "4 Years (8 Semesters)",
        credits: "136 Credits",
        summary: "Constitutional law, corporate jurisprudence, international human rights, and moot court trial advocacy.",
      },
      {
        title: "B.A. in English Language & Literature",
        code: "ENG",
        duration: "4 Years (8 Semesters)",
        credits: "124 Credits",
        summary: "Linguistics, comparative global literature, digital communication, and pedagogical rhetoric.",
      },
    ],
  },
  {
    category: "Life Sciences & Pharmacy",
    icon: FlaskConical,
    badge: "Faculty of Pharmacy",
    degrees: [
      {
        title: "Bachelor of Pharmacy (B.Pharm Professional)",
        code: "PHARM",
        duration: "4 Years (8 Semesters)",
        credits: "160 Credits",
        summary: "Clinical pharmacokinetics, pharmaceutical chemistry, drug regulatory affairs, and bio-manufacturing.",
      },
    ],
  },
];

export default function AcademicsPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-16 pb-20">
      {/* 1. Page Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
          <BookOpen className="size-3.5" />
          <span>Curriculum Approved by UGC & Professional Councils</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-foreground">
          Academic Degrees & Faculties
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          Explore our undergraduate and postgraduate degree curricula designed to blend theoretical rigor with practical laboratory and enterprise internships.
        </p>
      </section>

      {/* 2. Program Divisions */}
      <section className="space-y-12">
        {PROGRAMS.map((section) => (
          <div key={section.category} className="space-y-6">
            <div className="flex items-center gap-3 border-b border-border/60 pb-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <section.icon className="size-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {section.category}
                </h2>
                <span className="text-2xs text-muted-foreground font-medium">
                  {section.badge}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {section.degrees.map((deg) => (
                <Card key={deg.code} className="flex flex-col justify-between hover:border-primary/50 transition-colors">
                  <CardHeader className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="font-mono text-2xs font-semibold">
                        {deg.code}
                      </Badge>
                      <span className="text-2xs text-muted-foreground font-mono flex items-center gap-1">
                        <Clock className="size-3" />
                        {deg.duration}
                      </span>
                    </div>
                    <CardTitle className="text-base font-bold text-foreground leading-snug">
                      {deg.title}
                    </CardTitle>
                    <CardDescription className="text-xs leading-relaxed">
                      {deg.summary}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    <div className="flex items-center justify-between border-t border-border/50 pt-2.5 text-2xs">
                      <span className="text-muted-foreground">Degree Requirement:</span>
                      <span className="font-mono font-bold text-foreground">{deg.credits}</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full" render={<Link href="/register" />}>
                      <span>Apply for Program</span>
                      <ArrowRight className="size-3.5" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* 3. Callout: Tuition & Financial Assistance */}
      <section className="rounded-2xl border border-primary/20 bg-primary/5 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <h3 className="text-xl font-bold text-foreground">
            Looking for Program Tuition Fees & Scholarship Waivers?
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Apex University provides merit-based scholarships up to 100% for high academic achievers, extracurricular standouts, and siblings.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Button render={<Link href="/tuition" />}>
            View Tuition Structure & Waivers
          </Button>
          <Button variant="outline" render={<Link href="/contact" />}>
            Contact Academic Advisor
          </Button>
        </div>
      </section>
    </div>
  );
}
