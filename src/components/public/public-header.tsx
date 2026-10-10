"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, Menu, X, ArrowRight, LayoutDashboard, LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { useGetMe } from "@/services";
import { getDashboardPathByRole } from "@/constants/routes";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Academics", href: "/academics" },
  { label: "Tuition & Aid", href: "/tuition" },
  { label: "Contact", href: "/contact" },
];

export function PublicHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { data: meResponse } = useGetMe();

  const user = meResponse?.data?.user;
  const dashboardHref = user ? getDashboardPathByRole(user.role) : "/login";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/85 backdrop-blur-md transition-colors">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight text-foreground transition-opacity hover:opacity-90">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <GraduationCap className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold leading-tight">Apex University</span>
            <span className="text-2xs font-medium text-muted-foreground">Portal & Campus System</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-1.5 transition-colors",
                  isActive
                    ? "bg-muted font-semibold text-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA & Controls */}
        <div className="hidden md:flex items-center gap-2.5">
          <ThemeToggle />

          {user ? (
            <Button render={<Link href={dashboardHref} />}>
              <LayoutDashboard className="size-4" />
              Portal Dashboard
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" render={<Link href="/login" />}>
                <LogIn className="size-4" />
                Sign In
              </Button>
              <Button render={<Link href="/register" />}>
                Apply Now
                <ArrowRight className="size-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background px-4 py-4 space-y-3">
          <nav className="flex flex-col space-y-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-muted font-bold text-foreground"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="pt-2 border-t border-border flex flex-col gap-2">
            {user ? (
              <Button
                className="w-full justify-center"
                render={<Link href={dashboardHref} onClick={() => setMobileMenuOpen(false)} />}
              >
                <LayoutDashboard className="size-4 mr-1.5" />
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="w-full justify-center"
                  render={<Link href="/login" onClick={() => setMobileMenuOpen(false)} />}
                >
                  <LogIn className="size-4 mr-1.5" />
                  Portal Sign In
                </Button>
                <Button
                  className="w-full justify-center"
                  render={<Link href="/register" onClick={() => setMobileMenuOpen(false)} />}
                >
                  Apply Online
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default PublicHeader;
