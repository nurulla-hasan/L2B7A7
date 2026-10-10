import type { Metadata } from "next";
import Link from "next/link";
import {
  CreditCard,
  Calendar,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Percent,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Tuition Fees & Scholarships | Apex University",
  description:
    "Explore transparent tuition fee structures, credit-hour rates, semester payment plans, and generous merit-based scholarship waivers.",
};

const UNDERGRADUATE_FEES = [
  {
    program: "B.Sc. in Computer Science & Engineering (CSE)",
    faculty: "Engineering & Computing",
    perCredit: "৳ 5,500",
    totalCredits: "144 Credits",
    estTotal: "৳ 792,000",
    semDuration: "8 Semesters (4 Years)",
  },
  {
    program: "B.Sc. in Electrical & Electronic Engineering (EEE)",
    faculty: "Engineering & Computing",
    perCredit: "৳ 5,200",
    totalCredits: "148 Credits",
    estTotal: "৳ 769,600",
    semDuration: "8 Semesters (4 Years)",
  },
  {
    program: "Bachelor of Business Administration (BBA)",
    faculty: "School of Business",
    perCredit: "৳ 4,800",
    totalCredits: "130 Credits",
    estTotal: "৳ 624,000",
    semDuration: "8 Semesters (4 Years)",
  },
  {
    program: "Bachelor of Laws (LL.B Hons.)",
    faculty: "School of Law",
    perCredit: "৳ 4,500",
    totalCredits: "130 Credits",
    estTotal: "৳ 585,000",
    semDuration: "8 Semesters (4 Years)",
  },
  {
    program: "Bachelor of Pharmacy (B.Pharm Hons.)",
    faculty: "School of Pharmacy",
    perCredit: "৳ 5,800",
    totalCredits: "160 Credits",
    estTotal: "৳ 928,000",
    semDuration: "8 Semesters (4 Years)",
  },
];

const SCHOLARSHIPS = [
  {
    title: "President's Merit Waiver",
    amount: "100% Tuition Waiver",
    criteria: "GPA 5.0 (without 4th subject) in both SSC & HSC examinations, or top 3 rank in university entrance assessment.",
    badge: "Full Ride",
  },
  {
    title: "Dean's Honor Roll",
    amount: "50% - 75% Waiver",
    criteria: "Maintained semester CGPA of 3.85 or above with a minimum credit load of 15 credits per term.",
    badge: "Academic Excellence",
  },
  {
    title: "Female STEM Fellowship",
    amount: "30% - 50% Waiver",
    criteria: "Eligible female candidates admitted to Computing and Engineering departments with strong entrance test standing.",
    badge: "Diversity & Inclusion",
  },
  {
    title: "Need-Based Financial Grant",
    amount: "Up to 50% Waiver",
    criteria: "Assessed by the university Financial Aid Board based on verified family income and recommendation letters.",
    badge: "Financial Aid",
  },
];

const FAQS = [
  {
    question: "Can I pay the tuition fees in installments?",
    answer:
      "Yes. Tuition fees can be paid in three equal installments each semester: 40% at course registration, 30% prior to midterm examinations, and the remaining 30% prior to final examinations.",
  },
  {
    question: "What online payment methods are supported?",
    answer:
      "Apex University supports secure real-time digital payments via bKash, Nagad, Rocket, Visa, Mastercard, and American Express through our automated portal payment gateway.",
  },
  {
    question: "Are admission and semester development fees included in the per-credit rate?",
    answer:
      "No. There is a one-time non-refundable admission fee of BDT 25,000 at enrollment, and a semester activity/lab amenity fee of BDT 6,000 billed each active semester.",
  },
  {
    question: "How can I maintain my scholarship in subsequent semesters?",
    answer:
      "To retain a merit waiver, students must complete at least 12 credit hours per semester without any disciplinary warnings and maintain the minimum CGPA designated for their award tier (typically CGPA 3.75+).",
  },
];

export default function TuitionPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-16 sm:space-y-24 pb-20">
      {/* 1. Page Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
          <CreditCard className="size-3.5" />
          <span>Affordable & Transparent Higher Education</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-foreground">
          Tuition Fees & Financial Aid
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Investing in your higher education should be clear and accessible. Discover our program cost schedules, installment options, and merit-based waiver opportunities.
        </p>
      </section>

      {/* 2. Key Highlights Banner */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-border/60 bg-card/60 shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-2">
              <Calendar className="size-5" />
            </div>
            <CardTitle className="text-base">Flexible 3-Part Installments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Pay in manageable installments per semester to ease financial planning with zero interest.
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border/60 bg-card/60 shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-2">
              <Percent className="size-5" />
            </div>
            <CardTitle className="text-base">Up to 100% Scholarships</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              More than 40% of enrolled undergraduate students receive academic waivers or need-based aid.
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border/60 bg-card/60 shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-2">
              <Wallet className="size-5" />
            </div>
            <CardTitle className="text-base">Instant Online Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Direct settlement through student portal via bKash, Nagad, Visa, or Mastercard with instant receipt generation.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* 3. Tuition Fee Table */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Undergraduate Program Fee Schedule</h2>
            <p className="text-sm text-muted-foreground">Standard 2026-2027 academic session tuition rates</p>
          </div>
          <Badge variant="outline" className="w-fit text-xs px-3 py-1">
            Subject to annual academic review
          </Badge>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-xs">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Academic Program</th>
                <th className="px-6 py-4">Faculty</th>
                <th className="px-6 py-4">Per Credit</th>
                <th className="px-6 py-4">Total Credits</th>
                <th className="px-6 py-4">Est. Tuition Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {UNDERGRADUATE_FEES.map((item, idx) => (
                <tr key={idx} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-semibold text-foreground">
                    {item.program}
                    <span className="block text-xs font-normal text-muted-foreground">{item.semDuration}</span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{item.faculty}</td>
                  <td className="px-6 py-4 font-mono font-medium text-foreground">{item.perCredit}</td>
                  <td className="px-6 py-4 text-muted-foreground">{item.totalCredits}</td>
                  <td className="px-6 py-4 font-mono font-bold text-primary">{item.estTotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-lg border border-border/80 bg-muted/30 p-4 text-xs text-muted-foreground flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-primary shrink-0" />
            <span>Admission Fee: <strong>৳ 25,000</strong> (one-time) • Semester Amenities Fee: <strong>৳ 6,000</strong> (per term)</span>
          </div>
          <span>Clinical & Laboratory consumables for Pharmacy may incur nominal specialized session fees.</span>
        </div>
      </section>

      {/* 4. Scholarships & Financial Waivers */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Scholarships & Merit Waivers
          </h2>
          <p className="text-sm text-muted-foreground">
            Rewarding intellectual distinction and supporting talented scholars from all backgrounds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SCHOLARSHIPS.map((scholarship, idx) => (
            <Card key={idx} className="border border-border/60 bg-card/60 shadow-xs flex flex-col justify-between">
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="secondary" className="font-mono text-2xs">
                    {scholarship.badge}
                  </Badge>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {scholarship.amount}
                  </span>
                </div>
                <CardTitle className="text-lg mt-2">{scholarship.title}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground leading-relaxed mt-2">
                  {scholarship.criteria}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="size-4 text-primary" />
                  <span>Renewable upon meeting academic criteria each semester</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 5. FAQs */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-muted-foreground">
            Common questions regarding billing cycles, payment options, and waivers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FAQS.map((faq, idx) => (
            <Card key={idx} className="border border-border/60 bg-card/60 shadow-xs">
              <CardHeader className="pb-2">
                <div className="flex items-start gap-3">
                  <HelpCircle className="size-5 text-primary shrink-0 mt-0.5" />
                  <CardTitle className="text-base font-semibold">{faq.question}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pl-12">
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 6. Call to Action Banner */}
      <section className="relative overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 p-8 sm:p-12 text-center">
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Ready to Begin Your Higher Studies?
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Start your online admission application or contact our Admissions & Financial Aid office for tailored counseling.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Button render={<Link href="/register" />}>
              Apply for Admission
              <ArrowRight />
            </Button>
            <Button variant="outline" render={<Link href="/contact" />}>
              Contact Aid Office
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
