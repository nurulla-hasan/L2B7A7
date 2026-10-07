"use client";

import * as React from "react";
import { GraduationCap, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthLoadingProps {
  label?: string;
  className?: string;
}

export default function AuthLoading({
  label = "Authenticating session...",
  className,
}: AuthLoadingProps) {
  return (
    <div
      className={cn(
        "relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background p-6 select-none",
        className
      )}
    >
      {/* Ambient background glow using theme tokens */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 size-96 rounded-full bg-primary/10 blur-3xl opacity-70" />
      <div className="pointer-events-none absolute -bottom-32 left-1/2 -translate-x-1/2 size-96 rounded-full bg-accent blur-3xl opacity-50" />

      {/* Center Branded Splash Box */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-xs animate-in fade-in zoom-in-95 duration-300">
        {/* Logo Container with Halo Effect */}
        <div className="relative mb-5 flex items-center justify-center">
          {/* Animated Glow Halo */}
          <div className="absolute size-16 rounded-2xl bg-primary/20 animate-ping opacity-50" />
          <div className="absolute size-20 rounded-3xl bg-primary/10 blur-md" />

          {/* Logo Badge */}
          <div className="relative flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 ring-4 ring-primary/10">
            <GraduationCap className="size-7" />
          </div>
        </div>

        {/* Brand Name & Tagline */}
        <div className="space-y-1 mb-6">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            UniPortal
          </h2>
          <p className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
            Academic Management System
          </p>
        </div>

        {/* Modern Pill Badge Loader */}
        <div className="inline-flex items-center gap-2.5 rounded-full border border-border/60 bg-muted/50 px-4 py-1.5 shadow-xs backdrop-blur-xs">
          <Loader2 className="size-3.5 animate-spin text-primary shrink-0" />
          <span className="text-xs font-medium text-foreground/80 tracking-wide">
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}
