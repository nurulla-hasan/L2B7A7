"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { KeyRound, ArrowRight } from "lucide-react";

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
import { useForgotPassword } from "@/services";
import { successToast, errorToast } from "@/lib/toast";
import { getErrorMessage } from "@/lib/error";
import { forgotPasswordSchema } from "@/validations";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onChange: forgotPasswordSchema,
    },
    onSubmit: ({ value }) => {
      forgotPassword(
        { email: value.email.trim() },
        {
          onSuccess: (res) => {
            successToast(
              "Reset Code Sent",
              res?.message || "A 6-digit recovery code has been sent to your email."
            );
            router.push(
              `/verify-otp?type=reset-pass&email=${encodeURIComponent(value.email.trim())}`
            );
          },
          onError: (err) => {
            errorToast(getErrorMessage(err, "Failed to send recovery code"));
          },
        }
      );
    },
  });

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <KeyRound className="size-6" />
        </div>
        <CardTitle>
          Forgot Password
        </CardTitle>
        <CardDescription>
          Enter your institutional email address to receive a 6-digit recovery code.
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
            label="Institutional Email"
            type="email"
            placeholder="your.email@university.edu"
            autoComplete="email"
          />

          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={isPending}
            loadingText="Sending Code..."
          >
            Send Recovery Code
            <ArrowRight />
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 text-center text-xs">
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
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-primary underline underline-offset-4 hover:text-primary/80"
          >
            Create an Account
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
