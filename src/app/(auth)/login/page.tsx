"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { GraduationCap, ArrowRight, ShieldCheck, UserCheck, BookOpen } from "lucide-react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/common/form-input";
import { useLogin } from "@/services";
import { getDashboardPathByRole } from "@/constants/routes";
import { successToast, errorToast } from "@/lib/toast";
import { loginSchema } from "@/validations";
import { getErrorMessage } from "@/lib/error";

export default function LoginPage() {
  const router = useRouter();
  const { mutate: login, isPending } = useLogin();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: loginSchema,
    },
    onSubmit: ({ value }) => {
      login(value, {
        onSuccess: (res) => {
          successToast("Welcome Back");

          const dashboardPath = getDashboardPathByRole(res.data?.user?.role);
          router.replace(dashboardPath);
        },
        onError: (err) => {
          errorToast(getErrorMessage(err, "Login Failed"));
        },
      });
    },
  });

  const handleQuickFill = (email: string, password: string) => {
    form.setFieldValue("email", email);
    form.setFieldValue("password", password);
  };

  return (
    <Card>
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

          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={isPending}
            loadingText="Signing in..."
          >
            Sign In to Portal
            <ArrowRight />
          </Button>
        </form>

        {/* Quick Portal Access (Test Credentials Auto-fill) */}
        <div className="mt-6 pt-5 border-t">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center mb-3">
            Quick Portal Access
          </p>
          <div className="grid grid-cols-3 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                handleQuickFill("admin@example.com", "11111111");
              }}
            >
              <ShieldCheck />
              <span>Admin</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                handleQuickFill("teacher@example.com", "11111111");
              }}
            >
              <BookOpen />
              <span>Teacher</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                handleQuickFill("student@example.com", "11111111");
              }}
            >
              <UserCheck />
              <span>Student</span>
            </Button>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 text-center text-xs">
        <div>
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary hover:underline font-medium">
            Create an Account
          </Link>
        </div>
        <div>
          Forgot your password?{" "}
          <Link href="/forgot-password" className="text-muted-foreground hover:text-foreground hover:underline">
            Reset Password
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
