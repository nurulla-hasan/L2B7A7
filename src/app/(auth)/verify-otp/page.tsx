"use client";

import * as React from "react";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, ArrowRight, RotateCcw, KeyRound } from "lucide-react";
import { REGEXP_ONLY_DIGITS } from "input-otp";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { useCountdown } from "@/hooks/useUtilityHooks";
import {
  useVerifyEmail,
  useVerifyResetOtp,
  useResendOtp,
  useResendResetOtp,
} from "@/services";
import { successToast, errorToast } from "@/lib/toast";
import { getErrorMessage } from "@/lib/error";

export type OtpVerificationType = "signup" | "reset-pass";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromParams = searchParams.get("email") || "";
  const typeParam = searchParams.get("type");

  const isResetPass = typeParam === "reset-pass";

  const [customEmail, setCustomEmail] = useState("");
  const [otp, setOtp] = useState("");

  const targetEmail = (emailFromParams || customEmail).trim();

  // Signup flow hooks (verify registration email & resend code)
  const { mutate: verifyEmail, isPending: isVerifyingSignup } =
    useVerifyEmail();
  const { mutate: resendSignupOtp, isPending: isResendingSignup } =
    useResendOtp();

  // Password reset flow hooks (verify reset code & resend recovery code)
  const { mutate: verifyResetOtp, isPending: isVerifyingReset } =
    useVerifyResetOtp();
  const { mutate: resendResetOtp, isPending: isResendingReset } =
    useResendResetOtp();

  const isVerifying = isResetPass ? isVerifyingReset : isVerifyingSignup;
  const isResending = isResetPass ? isResendingReset : isResendingSignup;

  const storageKey = `otp-timer-${isResetPass ? "reset-pass" : "signup"}-${targetEmail || "default"}`;
  const {
    secondsLeft,
    isRunning,
    isMounted,
    start: startTimer,
    reset: resetTimer,
  } = useCountdown(60, storageKey);

  const handleVerify = (codeToVerify?: string) => {
    const finalOtp = (codeToVerify ?? otp).trim();

    if (!targetEmail) {
      errorToast("Email address is required.");
      return;
    }

    if (finalOtp.length !== 6) {
      errorToast("Please enter the complete 6-digit verification code.");
      return;
    }

    // 1. Password Reset Flow: Verify code with backend before navigating to set new password
    if (isResetPass) {
      verifyResetOtp(
        { email: targetEmail, otp: finalOtp },
        {
          onSuccess: () => {
            successToast(
              "Code Verified Successfully!",
              "Please enter your new password to complete the reset.",
            );
            resetTimer();
            router.push(
              `/reset-password?email=${encodeURIComponent(targetEmail)}&otp=${encodeURIComponent(finalOtp)}`,
            );
          },
          onError: (err) => {
            errorToast(getErrorMessage(err, "Invalid verification code"));
          },
        },
      );
      return;
    }

    // 2. Signup Flow: Verify registration email and activate account
    verifyEmail(
      { email: targetEmail, otp: finalOtp },
      {
        onSuccess: () => {
          successToast(
            "Email Verified Successfully!",
            "Your account is now activated. Welcome to the portal!",
          );
          resetTimer();
          router.replace(`/login?email=${encodeURIComponent(targetEmail)}`);
        },
        onError: (err) => {
          errorToast(getErrorMessage(err, "Verification Failed"));
        },
      },
    );
  };

  const handleResend = () => {
    if (isResending || isRunning) return;

    if (!targetEmail) {
      errorToast("Please provide your email address first.");
      return;
    }

    if (isResetPass) {
      resendResetOtp(
        { email: targetEmail },
        {
          onSuccess: (res) => {
            successToast(
              "Recovery Code Sent",
              res.message ||
                "A fresh 6-digit recovery code has been sent to your email.",
            );
            startTimer();
            setOtp("");
          },
          onError: (err) => {
            errorToast(getErrorMessage(err, "Failed to resend recovery code"));
          },
        },
      );
      return;
    }

    resendSignupOtp(
      { email: targetEmail },
      {
        onSuccess: (res) => {
          successToast(
            "Verification Code Sent",
            res.message ||
              "A fresh 6-digit verification code has been sent to your email.",
          );
          startTimer();
          setOtp("");
        },
        onError: (err) => {
          errorToast(getErrorMessage(err, "Failed to resend code"));
        },
      },
    );
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {isResetPass ? (
            <KeyRound className="size-6" />
          ) : (
            <ShieldCheck className="size-6" />
          )}
        </div>
        <CardTitle>
          {isResetPass ? "Verify Reset Code" : "Verify Your Email"}
        </CardTitle>
        <CardDescription>
          {isResetPass
            ? "Enter the 6-digit recovery code sent to your academic email address."
            : "Enter the 6-digit verification code sent to your academic email address."}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleVerify();
          }}
          className="flex flex-col gap-5"
        >
          {emailFromParams ? (
            <div className="rounded-lg border border-border/60 bg-muted/40 p-3 text-center">
              <span className="text-xs text-muted-foreground block">
                {isResetPass
                  ? "Recovery code sent to"
                  : "Verification code sent to"}
              </span>
              <span className="text-sm font-semibold text-foreground tracking-tight mt-0.5 block break-all">
                {emailFromParams}
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-xs font-medium text-foreground">
                Institutional Email
              </label>
              <Input
                type="email"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="your.email@university.edu"
                autoComplete="email"
                disabled={isVerifying || isResending}
              />
            </div>
          )}

          {/* 6-Digit OTP Input */}
          <div className="flex flex-col items-center gap-2 py-1">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(val) => setOtp(val)}
              onComplete={(val) => handleVerify(val)}
              pattern={REGEXP_ONLY_DIGITS}
              disabled={isVerifying}
              autoFocus
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <span className="text-xs text-muted-foreground">
              Tip: You can paste the 6-digit code directly
            </span>
          </div>

          {/* Submit Action */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={isVerifying}
            loadingText={
              isResetPass ? "Confirming Code..." : "Verifying Code..."
            }
            disabled={isVerifying || !targetEmail || otp.length !== 6}
          >
            {isResetPass ? "Proceed to Reset Password" : "Verify Account"}
            <ArrowRight />
          </Button>

          {/* Resend Section with Countdown */}
          <div className="flex items-center justify-between border-t border-border/50 pt-3 text-xs">
            <span className="text-muted-foreground">
              {isResetPass
                ? "Didn't receive the recovery code?"
                : "Didn't receive the code?"}
            </span>
            {!isMounted || isRunning ? (
              <span className="text-muted-foreground font-mono font-medium">
                Resend in {isMounted ? secondsLeft : "01:00"}
              </span>
            ) : (
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={handleResend}
                disabled={isResending || !targetEmail}
                loading={isResending}
                loadingText="Sending..."
              >
                <RotateCcw />
                Resend Code
              </Button>
            )}
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 border-t p-4 text-center text-xs text-muted-foreground">
        {isResetPass ? (
          <>
            <div>
              Remembered your password?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary underline underline-offset-4 hover:text-primary/80"
              >
                Sign In to Portal
              </Link>
            </div>
            <div>
              Need a new recovery code?{" "}
              <Link
                href="/forgot-password"
                className="font-semibold text-primary underline underline-offset-4 hover:text-primary/80"
              >
                Request again
              </Link>
            </div>
          </>
        ) : (
          <>
            <div>
              Incorrect email address?{" "}
              <Link
                href="/register"
                className="font-semibold text-primary underline underline-offset-4 hover:text-primary/80"
              >
                Register again
              </Link>
            </div>
            <div>
              Already verified?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary underline underline-offset-4 hover:text-primary/80"
              >
                Sign In to Portal
              </Link>
            </div>
          </>
        )}
      </CardFooter>
    </Card>
  );
}

function VerifyOtpSkeleton() {
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

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<VerifyOtpSkeleton />}>
      <VerifyOtpContent />
    </Suspense>
  );
}
