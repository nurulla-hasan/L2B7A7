"use client";

import { Loader2 } from "lucide-react";

export default function AuthLoading({ label = "Authenticating session..." }: { label?: string }) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 p-6 text-center">
      <Loader2 className="size-8 animate-spin text-primary" />
      <p className="text-sm font-medium text-muted-foreground animate-pulse">{label}</p>
    </div>
  );
}
