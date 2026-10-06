"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { GraduationCap, ArrowRight, ShieldCheck, UserCheck, BookOpen } from "lucide-react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/common/form-input";
import { apiClient } from "@/lib/api-client";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true);
      try {
        const res = await apiClient<{ success: boolean; data: { user: { role: string } } }>(
          "/auth/login",
          {
            method: "POST",
            body: value,
          }
        );

        toast.success("Welcome back! Sign in successful.");
        const role = res.data?.user?.role?.toUpperCase();
        if (role === "TEACHER") {
          router.replace("/teacher/dashboard");
        } else if (role === "STUDENT") {
          router.replace("/student/dashboard");
        } else {
          router.replace("/admin/dashboard");
        }
      } catch (err: unknown) {
        const error = err as { data?: { message?: string }; message?: string };
        toast.error(error?.data?.message || error?.message || "Invalid credentials. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleQuickFill = (email: string, targetPath: string) => {
    form.setFieldValue("email", email);
    form.setFieldValue("password", "Password123!");
    // Allow immediate test preview redirection
    router.push(targetPath);
  };

  return (
    <Card className="border-border/60 shadow-lg shadow-black/5">
      <CardHeader className="text-center space-y-1">
        <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <GraduationCap className="size-6" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">University Portal</CardTitle>
        <CardDescription>
          Sign in to access your dashboard, courses, and records.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <FormInput
            form={form}
            name="email"
            label="Email Address"
            type="email"
            placeholder="your.email@university.edu"
            autoComplete="email"
          />

          <FormInput
            form={form}
            name="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In to Portal"}
            <ArrowRight className="size-4 ml-1" />
          </Button>
        </form>

        {/* Quick Demo Role Jumpers */}
        <div className="mt-6 pt-5 border-t">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center mb-3">
            Quick Portal Access
          </p>
          <div className="grid grid-cols-3 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-auto py-2 flex flex-col gap-1 items-center text-xs"
              onClick={() => handleQuickFill("admin@university.edu", "/admin/dashboard")}
            >
              <ShieldCheck className="size-4 text-primary" />
              <span>Admin</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-auto py-2 flex flex-col gap-1 items-center text-xs"
              onClick={() => handleQuickFill("teacher@university.edu", "/teacher/dashboard")}
            >
              <BookOpen className="size-4 text-primary" />
              <span>Teacher</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-auto py-2 flex flex-col gap-1 items-center text-xs"
              onClick={() => handleQuickFill("student@university.edu", "/student/dashboard")}
            >
              <UserCheck className="size-4 text-primary" />
              <span>Student</span>
            </Button>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 text-center text-xs text-muted-foreground border-t pt-4">
        <div>
          Forgot your password?{" "}
          <Link href="/change-password" className="text-primary hover:underline font-medium">
            Reset Password
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
