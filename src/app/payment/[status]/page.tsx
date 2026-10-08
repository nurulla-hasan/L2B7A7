import Link from "next/link";
import { CheckCircle2, XCircle, AlertTriangle, BookOpen, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface PaymentStatusPageProps {
  params: Promise<{
    status: string;
  }>;
  searchParams: Promise<{
    paymentId?: string;
  }>;
}

export default async function PaymentStatusPage({
  params,
  searchParams,
}: PaymentStatusPageProps) {
  const { status } = await params;
  const { paymentId } = await searchParams;

  const isSuccess = status === "success";
  const isFailure = status === "failure";

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-4">
          {/* Status Icon */}
          <div
            className={`flex size-16 items-center justify-center rounded-full ${
              isSuccess
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : isFailure
                  ? "bg-destructive/10 text-destructive"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
            }`}
          >
            {isSuccess ? (
              <CheckCircle2 className="size-8" />
            ) : isFailure ? (
              <XCircle className="size-8" />
            ) : (
              <AlertTriangle className="size-8" />
            )}
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-foreground">
              {isSuccess
                ? "Payment Successful!"
                : isFailure
                  ? "Payment Failed"
                  : "Payment Cancelled"}
            </h1>
            <p className="text-xs text-muted-foreground max-w-xs">
              {isSuccess
                ? "Your tuition payment has been verified and processed successfully. Your course seat is fully confirmed."
                : isFailure
                  ? "The payment transaction could not be completed. If money was deducted, it will be refunded automatically by bKash."
                  : "You cancelled the bKash payment checkout session before completion."}
            </p>
          </div>

          {/* Transaction Ref if available */}
          {paymentId && (
            <div className="w-full rounded-lg bg-muted/50 p-2.5 text-xs">
              <span className="text-muted-foreground">Payment Reference: </span>
              <span className="font-mono font-semibold text-foreground">
                {paymentId}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 w-full pt-2">
            <Button
              className="w-full"
              render={<Link href="/student/my-courses" />}
            >
              <BookOpen />
              My Courses
            </Button>
            <Button
              variant="outline"
              className="w-full"
              render={<Link href="/student/payments" />}
            >
              <CreditCard />
              Fee Payments
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
