"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { ArrowRight, UserPlus, BookOpen, UserCheck } from "lucide-react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/common/form-input";
import { useRegister } from "@/services";
import { addToast, showErrorToast } from "@/lib/toast";

export default function RegisterPage() {
  const router = useRouter();
  const { mutate: register, isPending } = useRegister();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      role: "STUDENT" as "STUDENT" | "TEACHER",
    },
    onSubmit: ({ value }) => {
      register(
        {
          name: value.name.trim(),
          email: value.email.trim(),
          password: value.password,
          role: value.role,
          phone: value.phone.trim() || undefined,
        },
        {
          onSuccess: (res) => {
            addToast({
              title: "Registration Initiated",
              description: "A 6-digit verification code has been sent to your email.",
              type: "success",
            });
            const targetEmail = res.data?.email || value.email.trim();
            router.push(`/verify-otp?email=${encodeURIComponent(targetEmail)}`);
          },
          onError: (err) => {
            showErrorToast(
              err,
              "Registration Failed",
              "Could not complete registration. Please try again."
            );
          },
        }
      );
    },
  });

  return (
    <Card>
      <CardHeader className="text-center space-y-1">
        <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <UserPlus className="size-6" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Create Portal Account</CardTitle>
        <CardDescription>
          Sign up to access university course registration, schedules, and portal services.
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
          {/* Account Role Selector */}
          <div className="grid gap-1.5 mb-2">
            <label className="text-xs font-medium text-foreground">Select Role</label>
            <form.Subscribe selector={(state) => state.values.role}>
              {(role) => (
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={role === "STUDENT" ? "default" : "outline"}
                    size="sm"
                    onClick={() => form.setFieldValue("role", "STUDENT")}
                  >
                    <UserCheck />
                    <span>Student</span>
                  </Button>
                  <Button
                    type="button"
                    variant={role === "TEACHER" ? "default" : "outline"}
                    size="sm"
                    onClick={() => form.setFieldValue("role", "TEACHER")}
                  >
                    <BookOpen />
                    <span>Teacher</span>
                  </Button>
                </div>
              )}
            </form.Subscribe>
          </div>

          <FormInput
            form={form}
            name="name"
            label="Full Name"
            placeholder="e.g. John Doe"
            autoComplete="name"
          />

          <FormInput
            form={form}
            name="email"
            label="Institutional Email"
            type="email"
            placeholder="your.email@university.edu"
            autoComplete="email"
          />

          <FormInput
            form={form}
            name="password"
            label="Password"
            type="password"
            placeholder="Minimum 6 characters"
            autoComplete="new-password"
          />

          <FormInput
            form={form}
            name="phone"
            label="Phone Number (Optional)"
            type="tel"
            placeholder="+880 1XXXXXXXXX"
            autoComplete="tel"
          />

          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={isPending}
            loadingText="Creating Account..."
          >
            Create Account
            <ArrowRight />
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 text-center text-xs text-muted-foreground border-t pt-4">
        <div>
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Sign In to Portal
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
