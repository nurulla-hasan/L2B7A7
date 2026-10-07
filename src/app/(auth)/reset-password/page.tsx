"use client";

import * as React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { KeyRound, ArrowRight, ShieldAlert } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/common/form-input";
import { useResetPassword } from "@/services";
import { successToast, errorToast } from "@/lib/toast";
import { getErrorMessage } from "@/lib/error";
import { resetPasswordFormSchema } from "@/validations";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = (searchParams.get("email") || "").trim();
  const otp = (searchParams.get("otp") || "").trim();

  const { mutate: resetPassword, isPending } = useResetPassword();

  const form = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    validators: {
      onChange: resetPasswordFormSchema,
    },
    onSubmit: ({ value }) => {
      if (!email || !otp) {
        errorToast("Missing recovery details. Please verify your OTP first.");
        return;
      }

      resetPassword(
        {
          email,
          otp,
          password: value.password,
        },
        {
          onSuccess: () => {
            successToast(
              "Password Reset Successfully!",
              "Your password has been updated. Please sign in with your new credentials."
            );
            router.replace(`/login?email=${encodeURIComponent(email)}`);
          },
          onError: (err) => {
            errorToast(getErrorMessage(err, "Password reset failed"));
          },
        }
      );
    },
  });

  if (!email || !otp || otp.length !== 6) {
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <ShieldAlert className="size-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Invalid Recovery Session
          </CardTitle>
          <CardDescription>
            A valid email address and 6-digit verification code are required to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button
            type="button"
            className="w-full"
            size="lg"
            onClick={() => router.push("/forgot-password")}
          >
            Request Reset Code
            <ArrowRight />
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => router.push("/login")}
          >
            Back to Sign In
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <KeyRound className="size-6" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">
          Set New Password
        </CardTitle>
        <CardDescription>
          Create a secure, strong password for your university account.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="mb-4 rounded-lg border border-border/60 bg-muted/40 p-3 text-center">
          <span className="text-xs text-muted-foreground block">
            Resetting password for
          </span>
          <span className="text-sm font-semibold text-foreground tracking-tight mt-0.5 block break-all">
            {email}
          </span>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="flex flex-col gap-4"
        >
          <FormInput
            form={form}
            name="password"
            label="New Password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            description="Must be at least 8 characters"
          />

          <FormInput
            form={form}
            name="confirmPassword"
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
          />

          <Button
            type="submit"
            className="w-full mt-1"
            size="lg"
            loading={isPending}
            loadingText="Updating Password..."
          >
            Update Password
            <ArrowRight />
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 border-t p-4 text-center text-xs text-muted-foreground">
        <div>
          Remember your password?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary underline underline-offset-4 hover:text-primary/80"
          >
            Sign In to Portal
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

function ResetPasswordSkeleton() {
  return (
    <Card>
      <CardHeader className="text-center space-y-1">
        <div className="mx-auto mb-2 size-12 rounded-xl bg-muted animate-pulse" />
        <div className="h-7 w-48 mx-auto bg-muted animate-pulse rounded-md" />
        <div className="h-4 w-64 mx-auto bg-muted animate-pulse rounded-md" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-10 w-full bg-muted animate-pulse rounded-md" />
        <div className="h-10 w-full bg-muted animate-pulse rounded-md" />
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordSkeleton />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
