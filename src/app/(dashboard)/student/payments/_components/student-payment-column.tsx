"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { CreditCard, Copy, Check } from "lucide-react";

import type { PaymentItem, PaymentStatus } from "@/types";
import { useInitiateBkashPayment } from "@/services";
import { ConfirmationModal } from "@/components/common/confirmation-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { errorToast } from "@/lib/toast";
import { getErrorMessage } from "@/lib/error";
import { formatDate } from "@/lib/utils";
import { StudentPaymentDetailsModal } from "./student-payment-details-modal";

function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  switch (status) {
    case "PAID":
      return <Badge variant="success">Paid</Badge>;
    case "PENDING":
      return <Badge variant="warning">Pending</Badge>;
    case "FAILED":
      return <Badge variant="destructive">Failed</Badge>;
    case "CANCELLED":
      return <Badge variant="outline">Cancelled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function StudentPaymentActionsCell({ payment }: { payment: PaymentItem }) {
  const { mutateAsync: initiateBkash, isPending: isInitiating } =
    useInitiateBkashPayment();

  const handlePay = async () => {
    try {
      const response = await initiateBkash({
        enrollmentId: payment.enrollmentId,
      });
      if (response?.data?.paymentUrl) {
        window.location.href = response.data.paymentUrl;
      }
    } catch (error) {
      errorToast(getErrorMessage(error, "Failed to initiate bKash checkout"));
    }
  };

  const isPending =
    payment.status === "PENDING" &&
    payment.enrollment?.status === "PENDING_PAYMENT";
  const course = payment.enrollment.courseOffering.course;
  const section = payment.enrollment.courseOffering.section;

  return (
    <div className="flex items-center justify-end gap-2">
      {isPending && (
        <ConfirmationModal
          title="Confirm bKash Payment"
          description={`You are about to initiate payment of ৳${Number(payment.amount).toLocaleString()} for ${course.code} Section ${section}. You will be redirected to the secure bKash checkout page.`}
          confirmText="Pay with bKash"
          isLoading={isInitiating}
          onConfirm={handlePay}
          trigger={
            <Button>
              <CreditCard />
              Pay
            </Button>
          }
        />
      )}

      <StudentPaymentDetailsModal payment={payment} />
    </div>
  );
}

function TxIdCell({ txId, createdAt }: { txId: string; createdAt: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(txId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-1.5">
        <span className="font-mono text-xs font-semibold text-foreground">
          {txId}
        </span>
        <Button
          variant="ghost"
          onClick={handleCopy}
          title="Copy Transaction ID"
        >
          {copied ? (
            <Check className="size-3 text-emerald-500" />
          ) : (
            <Copy className="size-3" />
          )}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">{formatDate(createdAt)}</p>
    </div>
  );
}

export const studentPaymentColumns: ColumnDef<PaymentItem>[] = [
  {
    accessorKey: "transactionId",
    header: "Transaction ID",
    cell: ({ row }) => (
      <TxIdCell
        txId={row.original.transactionId}
        createdAt={row.original.createdAt}
      />
    ),
  },
  {
    accessorKey: "course",
    header: "Course Section",
    cell: ({ row }) => {
      const offering = row.original.enrollment.courseOffering;
      return (
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{offering.course.code}</Badge>
            <span className="font-medium text-foreground">
              {offering.course.title}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Section {offering.section} • {offering.semester.name}{" "}
            {offering.semester.year}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <span className="font-mono text-sm font-semibold text-foreground">
        ৳ {Number(row.original.amount).toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: "gateway",
    header: "Gateway",
    cell: () => (
      <Badge variant="outline">
        bKash
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <PaymentStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "paidAt",
    header: "Paid Date",
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {row.original.paidAt ? formatDate(row.original.paidAt) : "—"}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Action</div>,
    cell: ({ row }) => <StudentPaymentActionsCell payment={row.original} />,
  },
];
