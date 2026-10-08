import * as React from "react";
import { GraduationCap, ShieldCheck, Zap, CreditCard } from "lucide-react";
import { Logo } from "@/components/common/logo";
import { ThemeToggle } from "@/components/common/theme-toggle";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2 bg-background">
      {/* Left Column: Visual & University Branding (Responsive and theme-token powered) */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-muted/40 border-r border-border overflow-hidden">
        {/* Subtle Decorative Background Glow using theme tokens */}
        <div className="pointer-events-none absolute -top-40 -left-40 size-96 rounded-full bg-primary/10 blur-3xl opacity-70" />
        <div className="pointer-events-none absolute -bottom-40 -right-40 size-96 rounded-full bg-accent blur-3xl opacity-50" />

        {/* Top: Brand Logo */}
        <div className="relative z-10">
          <Logo size="lg" showText showTextOnMobile />
        </div>

        {/* Center: Hero Branding & Feature Highlights */}
        <div className="relative z-10 max-w-md space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
            <GraduationCap className="size-3.5" />
            University Management System
          </div>

          <h1 className="text-3xl xl:text-4xl font-bold tracking-tight text-foreground leading-tight">
            Academic operations, simplified and automated.
          </h1>

          <p className="text-sm text-muted-foreground leading-relaxed">
            A comprehensive portal connecting university administration, faculty grade evaluations,
            and seamless student enrollment in one unified workspace.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="p-1.5 rounded-lg bg-background border border-border text-primary shadow-xs">
                <ShieldCheck className="size-4" />
              </div>
              <span>Role-based access control for Admins, Faculty, and Students</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="p-1.5 rounded-lg bg-background border border-border text-primary shadow-xs">
                <Zap className="size-4" />
              </div>
              <span>Real-time course offering capacity & seat registration</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="p-1.5 rounded-lg bg-background border border-border text-primary shadow-xs">
                <CreditCard className="size-4" />
              </div>
              <span>Automated tuition fee processing via bKash</span>
            </div>
          </div>
        </div>

        {/* Bottom: Academic Tagline */}
        <div className="relative z-10 text-xs text-muted-foreground flex items-center justify-between border-t border-border pt-6">
          <span>&ldquo;Excellence in education begins with seamless operations.&rdquo;</span>
          <span className="font-mono">v1.0.0</span>
        </div>
      </div>

      {/* Right Column: Centered Auth Child with Floating Theme Switcher */}
      <div className="relative flex min-h-screen flex-1 flex-col items-center justify-center p-6 sm:p-10">
        {/* Floating Theme Toggle in top-right */}
        <div className="absolute top-6 right-6 z-20">
          <ThemeToggle />
        </div>

        {/* Mobile Header Logo (Visible on screens < lg) */}
        <div className="lg:hidden mb-6">
          <Logo size="md" showText showTextOnMobile />
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md animate-in fade-in-50 duration-300">
          {children}
        </div>
      </div>
    </div>
  );
}
