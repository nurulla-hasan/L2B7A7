import { GraduationCap } from "lucide-react";

export default function RootLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <div className="relative flex items-center justify-center">
        {/* Pulsing Outer Glow */}
        <div className="absolute size-20 animate-ping rounded-full bg-primary/10" />
        <div className="flex size-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-sm">
          <GraduationCap className="size-8 animate-pulse" />
        </div>
      </div>
      <p className="mt-4 font-mono text-xs uppercase tracking-wider text-muted-foreground animate-pulse">
        Loading University Portal...
      </p>
    </div>
  );
}
