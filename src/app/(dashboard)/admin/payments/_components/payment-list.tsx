"use client";

import {
  Banknote,
  CreditCard,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { SectionHeading } from "@/components/common/section-heading";
import { SearchInput } from "@/components/common/search-input";
import { FilterSelect } from "@/components/common/filter-select";
import { DataTable } from "@/components/common/data-table";
import { useStateFilter } from "@/hooks";
import { useGetAllPayments, useGetSemesters } from "@/services";
import { getErrorMessage } from "@/lib/error";
import type { PaymentSortBy } from "@/types";
import { paymentColumns } from "./payment-column";

const SORT_OPTIONS: { label: string; value: PaymentSortBy }[] = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Amount (High to Low)", value: "amount_desc" },
  { label: "Amount (Low to High)", value: "amount_asc" },
];

const STATUS_OPTIONS: { label: string; value: string }[] = [
  { label: "All Statuses", value: "all" },
  { label: "Paid", value: "PAID" },
  { label: "Pending", value: "PENDING" },
  { label: "Failed", value: "FAILED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export default function PaymentList() {
  const filter = useStateFilter();

  const { data: semestersRes } = useGetSemesters({ limit: 100 });
  const semesters = semestersRes?.data ?? [];

  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetAllPayments(filter.filters);

  const payments = response?.data ?? [];
  const meta = response?.meta;

  let totalRevenue = 0;
  let paidCount = 0;
  let pendingCount = 0;

  for (const p of payments) {
    if (p.status === "PAID") {
      totalRevenue += p.amount;
      paidCount += 1;
    } else if (p.status === "PENDING") {
      pendingCount += 1;
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        title="Payments & Fees"
        description="Monitor tuition payment transactions, examine gateway verification records, and audit revenue."
        alignment="left"
        as="h3"
      />

      {/* Top Financial Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-1.5 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Page Revenue</span>
            <Banknote className="size-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            ৳{totalRevenue.toLocaleString()}
          </p>
          <p className="text-[11px] text-muted-foreground">
            From {paidCount} confirmed payment(s)
          </p>
        </div>

        {/* Total Records */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-1.5 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Total Transactions</span>
            <CreditCard className="size-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {meta?.total ?? 0}
          </p>
          <p className="text-[11px] text-muted-foreground">
            Recorded in system database
          </p>
        </div>

        {/* Successful Payments */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-1.5 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Successful (Paid)</span>
            <CheckCircle2 className="size-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{paidCount}</p>
          <p className="text-[11px] text-muted-foreground">
            Confirmed tuition fee seats
          </p>
        </div>

        {/* Pending & Unresolved */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-1.5 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Pending Processing</span>
            <AlertCircle className="size-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
          <p className="text-[11px] text-muted-foreground">
            Awaiting checkout completion
          </p>
        </div>
      </div>

      {/* Filters row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-xs">
          <SearchInput
            filter={filter}
            filterKey="searchTerm"
            debounce={500}
            placeholder="Search TxID, student, course..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Filter */}
          <FilterSelect
            filter={filter}
            filterKey="status"
            placeholder="All Statuses"
            options={STATUS_OPTIONS}
            className="w-36"
          />

          {/* Semester Filter */}
          <FilterSelect
            filter={filter}
            filterKey="semesterId"
            placeholder="All Semesters"
            options={[
              { label: "All Semesters", value: "all" },
              ...semesters.map((s) => ({ label: `${s.name} ${s.year}`, value: s.id })),
            ]}
            className="w-40"
          />

          {/* Sort By Filter */}
          <FilterSelect
            filter={filter}
            filterKey="sortBy"
            placeholder="Sort by"
            options={SORT_OPTIONS}
            className="min-w-44"
          />
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={paymentColumns}
        data={payments}
        meta={meta}
        filter={filter}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        errorMessage={getErrorMessage(error, "Failed to load payments")}
        onRetry={refetch}
      />
    </div>
  );
}
