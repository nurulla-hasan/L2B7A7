import type { Metadata } from "next";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Building,
  GraduationCap,
  MessageSquare,
  Bus,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContactForm } from "@/components/public/contact-form";

export const metadata: Metadata = {
  title: "Contact Us & Campus Offices | Apex University",
  description:
    "Get in touch with Apex University admissions counselors, academic registrar desks, accounts department, and explore campus locations in Dhaka.",
};

const DIRECT_CONTACTS = [
  {
    icon: Phone,
    title: "Telephone Hotlines",
    details: ["+880 2 9876540 - 45 (PBX)", "+880 1700 000000 (Admissions)", "+880 1800 111222 (Emergency)"],
    badge: "Voice Support",
  },
  {
    icon: Mail,
    title: "Official Email Desks",
    details: ["admissions@apex.edu.bd", "registrar@apex.edu.bd", "support@apex.edu.bd"],
    badge: "Direct Inbox",
  },
  {
    icon: Clock,
    title: "Consultation Hours",
    details: ["Sunday – Thursday: 9:00 AM – 5:00 PM", "Saturday: 10:00 AM – 3:00 PM (Admissions Only)", "Friday: Closed (Statutory Holiday)"],
    badge: "Visiting Hours",
  },
  {
    icon: MapPin,
    title: "Principal Location",
    details: ["Plot 15, Block B, Main Avenue", "Aftabnagar, Rampura", "Dhaka-1212, Bangladesh"],
    badge: "Main Campus",
  },
];

const CAMPUSES = [
  {
    name: "Main Permanent Campus",
    address: "Plot 15, Block B, Aftabnagar, Rampura, Dhaka-1212",
    features: "Central Library, Engineering Laboratories, Auditorium, Sports Complex, Vice Chancellor's Secretariat.",
    type: "Undergraduate & Postgraduate",
  },
  {
    name: "City Information Center & Business Annex",
    address: "House 42, Road 27, Dhanmondi R/A, Dhaka-1209",
    features: "Admissions Consultation, Executive MBA Classrooms, Career Placement Cell, Alumni Lounge.",
    type: "Admissions & Executive Studies",
  },
];

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-16 sm:space-y-24 pb-20">
      {/* 1. Page Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
          <MessageSquare className="size-3.5" />
          <span>Connect With University Administration</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-foreground">
          Contact & Campus Inquiries
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Have questions about degree offerings, application deadlines, credit transfers, or student services? Our admissions and academic advisors are here to assist.
        </p>
      </section>

      {/* 2. Direct Channels */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {DIRECT_CONTACTS.map((contact, idx) => {
          const Icon = contact.icon;
          return (
            <Card key={idx} className="border border-border/60 bg-card/60 shadow-xs">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <Badge variant="outline" className="text-2xs font-mono">
                    {contact.badge}
                  </Badge>
                </div>
                <CardTitle className="text-base font-semibold">{contact.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-xs text-muted-foreground">
                {contact.details.map((line, lIdx) => (
                  <p key={lIdx} className="leading-relaxed">
                    {line}
                  </p>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* 3. Form & Campus Locations Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Contact Form (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <ContactForm />
        </div>

        {/* Right: Campuses & Transit (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Building className="size-5 text-primary" />
              University Campuses
            </h2>

            {CAMPUSES.map((campus, idx) => (
              <Card key={idx} className="border border-border/60 bg-card/60 shadow-xs">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-base font-bold">{campus.name}</CardTitle>
                    <Badge variant="secondary" className="text-2xs font-mono">
                      {campus.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <p className="flex items-start gap-1.5 text-foreground font-medium">
                    <MapPin className="size-3.5 text-primary shrink-0 mt-0.5" />
                    {campus.address}
                  </p>
                  <p className="text-muted-foreground leading-relaxed pl-5">
                    {campus.features}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Transit and Directions Guide */}
          <Card className="border border-border/60 bg-muted/30 shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <Bus className="size-4 text-primary" />
                Transit & Campus Access
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2 leading-relaxed">
              <p>
                <strong>Metro Transit:</strong> Nearest MRT line stations connect via Dhaka Metro Rampura link with continuous campus shuttle services every 15 minutes.
              </p>
              <p>
                <strong>Student Parking:</strong> Secure basement multi-story vehicle parking is accessible for enrolled students, faculty, and verified campus guests.
              </p>
            </CardContent>
          </Card>

          {/* Campus Tour Invite */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <GraduationCap className="size-4" />
              <span>Book a Campus Guided Tour</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Interested prospective students and guardians may schedule a guided laboratory and campus walkthrough every Saturday by calling the admissions desk.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
