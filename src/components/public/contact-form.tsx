"use client";

import * as React from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Send, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/common/form-input";
import { Spinner } from "@/components/ui/spinner";
import { successToast } from "@/lib/toast";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Please provide a valid email"),
  phone: z.string().min(7, "Please provide a valid contact number"),
  department: z.string().min(1, "Please choose a department"),
  subject: z.string().min(4, "Subject must be at least 4 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

const DEPARTMENT_OPTIONS = [
  { label: "Select Department", value: "" },
  { label: "Admissions & Enrollment", value: "Admissions & Enrollment" },
  { label: "Academic Records & Registrar", value: "Academic Records & Registrar" },
  { label: "Tuition & Financial Aid", value: "Tuition & Financial Aid" },
  { label: "International Student Desk", value: "International Student Desk" },
  { label: "Campus Facilities & Tours", value: "Campus Facilities & Tours" },
];

function generateReferenceNumber() {
  return `APX-${Date.now().toString().slice(-6)}`;
}

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submittedRef, setSubmittedRef] = React.useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      department: "",
      subject: "",
      message: "",
    },
    validators: {
      onChange: contactFormSchema,
    },
    onSubmit: async () => {
      setIsSubmitting(true);
      // Simulate submission network delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsSubmitting(false);

      const refNumber = generateReferenceNumber();
      setSubmittedRef(refNumber);
      successToast(
        "Inquiry Received Successfully",
        `Ticket Reference: ${refNumber}. An academic officer will contact you within 24 hours.`
      );
      form.reset();
    },
  });

  return (
    <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-xs">
      {submittedRef ? (
        <div className="space-y-4 text-center py-8">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-8" />
          </div>
          <h3 className="text-xl font-bold text-foreground">Thank You for Reaching Out!</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Your inquiry has been logged under ticket reference{" "}
            <span className="font-mono font-semibold text-foreground">{submittedRef}</span>. A confirmation has been sent to your email.
          </p>
          <div className="pt-2">
            <Button
              variant="outline"
              onClick={() => setSubmittedRef(null)}
            >
              Send Another Inquiry
            </Button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-foreground">Send an Academic Inquiry</h3>
            <p className="text-xs text-muted-foreground">
              Fill in your details and our admission advisors will get back to you promptly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              form={form}
              name="name"
              label="Full Name *"
              placeholder="e.g. Tanvir Ahmed"
              disabled={isSubmitting}
            />

            <FormInput
              form={form}
              name="email"
              label="Email Address *"
              type="email"
              placeholder="tanvir@example.com"
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              form={form}
              name="phone"
              label="Contact Number *"
              placeholder="+880 1712 345678"
              disabled={isSubmitting}
            />

            <FormInput
              form={form}
              name="department"
              label="Department / Desk *"
              type="select"
              placeholder="Select Department"
              options={DEPARTMENT_OPTIONS}
              disabled={isSubmitting}
            />
          </div>

          <FormInput
            form={form}
            name="subject"
            label="Subject *"
            placeholder="e.g. Inquiry regarding CSE Fall 2026 Credit Transfer"
            disabled={isSubmitting}
          />

          <FormInput
            form={form}
            name="message"
            label="Message *"
            type="textarea"
            placeholder="Write your questions or specify program interests here..."
            disabled={isSubmitting}
          />

          <div className="pt-2">
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? (
                <>
                  <Spinner className="mr-2" />
                  Sending Inquiry...
                </>
              ) : (
                <>
                  <Send className="size-4" />
                  Submit Inquiry
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
