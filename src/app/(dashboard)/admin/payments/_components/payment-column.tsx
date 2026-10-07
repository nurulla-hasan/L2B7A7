"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Clock } from "lucide-react";

import type { PaymentItem } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate, getInitials } from "@/lib/utils";
import { PaymentStatusBadge } from "./payment-status-badge";
import { PaymentGatewayBadge } from "./payment-gateway-badge";
import { PaymentDetailsModal } from "./payment-details-modal";

export const paymentColumns: ColumnDef<PaymentItem>[] = [
  {
    accessorKey: "transactionId",
    header: "Transaction ID",
    cell: ({ row }) => {
      const payment = row.original;
      return (
        <div className="space-y-0.5 min-w-36">
          <p className="font-mono text-xs font-semibold text-foreground">
            {payment.transactionId}
          </p>
          {payment.bkashPaymentId && (
            <p className="font-mono text-[10px] text-muted-foreground truncate max-w-32">
              GW: {payment.bkashPaymentId}
            </p>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "student",
    header: "Student",
    cell: ({ row }) => {
      const student = row.original.enrollment.student;

      return (
        <div className="flex items-center gap-2.5 min-w-48">
          <Avatar size="sm">
            {student.imageUrl && (
              <AvatarImage src={student.imageUrl} alt={student.name} />
            )}
            <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
          </Avatar>
          <div className="space-y-0.5">
            <p className="font-medium text-foreground text-sm leading-none">
              {student.name}
            </p>
            <p className="text-[11px] text-muted-foreground">{student.email}</p>
            {student.studentProfile?.studentId && (
              <p className="text-[10px] font-mono text-muted-foreground/80">
                ID: {student.studentProfile.studentId}
              </p>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "course",
    header: "Course & Section",
    cell: ({ row }) => {
      const offering = row.original.enrollment.courseOffering;
      return (
        <div className="space-y-1 min-w-44">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant="outline" className="font-mono text-[11px]">
              {offering.course.code}
            </Badge>
            <Badge
              variant="secondary"
              size="sm"
              className="font-mono text-[11px]"
            >
              Sec {offering.section}
            </Badge>
          </div>
          <p className="font-medium text-foreground text-xs line-clamp-1">
            {offering.course.title}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.original.amount;
      return (
        <span className="font-bold text-sm text-foreground">
          ৳{amount.toLocaleString()}
        </span>
      );
    },
  },
  {
    accessorKey: "gateway",
    header: "Gateway",
    cell: ({ row }) => {
      return <PaymentGatewayBadge gateway={row.original.gateway} />;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return <PaymentStatusBadge status={row.original.status} />;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Transaction Date",
    cell: ({ row }) => {
      const payment = row.original;
      const date = payment.paidAt || payment.createdAt;
      return (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="size-3.5 shrink-0" />
          <span>{formatDate(date)}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-end">
          <PaymentDetailsModal payment={row.original} />
        </div>
      );
    },
  },
];

export default paymentColumns;
