import Link from "next/link";
import { GraduationCap, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center bg-background">
      <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <GraduationCap className="size-8" />
      </div>

      <span className="font-mono text-sm font-semibold uppercase tracking-wider text-primary">
        Error 404
      </span>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
        Page Not Found
      </h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        The academic record, portal page, or resource you are looking for does not exist or may have been relocated.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button render={<Link href="/" />}>
          <Home />
          Back to Home
        </Button>
        <Button variant="outline" render={<Link href="/login" />}>
          <ArrowLeft />
          Portal Sign In
        </Button>
      </div>
    </div>
  );
}
