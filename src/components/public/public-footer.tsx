import Link from "next/link";
import { GraduationCap, Mail, Phone, MapPin, ShieldCheck, Heart } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-muted/20 text-muted-foreground">
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Info (Span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <Link href="/" className="flex items-center gap-2.5 font-bold text-foreground">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <GraduationCap className="size-5" />
              </div>
              <span className="text-lg font-extrabold tracking-tight">Apex University</span>
            </Link>
            <p className="text-xs leading-relaxed max-w-sm">
              Empowering global leaders through academic rigor, cutting-edge scientific research, and an innovative digital campus ecosystem.
            </p>
            <div className="flex items-center gap-2 text-2xs text-muted-foreground pt-1">
              <ShieldCheck className="size-4 text-emerald-500 shrink-0" />
              <span>Nationally Accredited & UGC Certified Institution</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  About University
                </Link>
              </li>
              <li>
                <Link href="/academics" className="hover:text-foreground transition-colors">
                  Faculties & Programs
                </Link>
              </li>
              <li>
                <Link href="/tuition" className="hover:text-foreground transition-colors">
                  Tuition & Financial Aid
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors">
                  Campus Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Academic Faculties */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Academic Divisions
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/academics" className="hover:text-foreground transition-colors">
                  Engineering & Technology
                </Link>
              </li>
              <li>
                <Link href="/academics" className="hover:text-foreground transition-colors">
                  Business & Management
                </Link>
              </li>
              <li>
                <Link href="/academics" className="hover:text-foreground transition-colors">
                  Computer Science & IT
                </Link>
              </li>
              <li>
                <Link href="/academics" className="hover:text-foreground transition-colors">
                  Arts & Social Sciences
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Campus Headquarters
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="size-3.5 mt-0.5 shrink-0 text-primary" />
                <span>Plot 14, Block B, University Avenue, Dhaka 1229</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-3.5 shrink-0 text-primary" />
                <span className="font-mono">+880 2 888 1234</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-3.5 shrink-0 text-primary" />
                <span>admissions@apex.edu.bd</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-border/60 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
          <p>© {new Date().getFullYear()} Apex University System. All rights reserved.</p>
          <div className="flex items-center gap-4 text-2xs">
            <Link href="/login" className="hover:text-foreground transition-colors">
              Faculty / Student Portal
            </Link>
            <span>•</span>
            <Link href="/tuition" className="hover:text-foreground transition-colors">
              Payment Policy
            </Link>
            <span>•</span>
            <span className="flex items-center gap-1">
              Built with <Heart className="size-3 text-rose-500 fill-rose-500" /> for Excellence
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default PublicFooter;
