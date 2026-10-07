import type { Metadata } from "next";
import PaymentList from "./_components/payment-list";

export const metadata: Metadata = {
  title: "Payments & Fees Management | UniPortal Admin",
  description:
    "Audit tuition payment transactions, examine gateway verification records, and monitor financial revenue with the UniPortal admin portal.",
  keywords: [
    "Payments Management",
    "Tuition Fees",
    "bKash Gateway",
    "SSLCommerz",
    "Transaction Verification",
    "Admin Portal",
  ],
};

export default function PaymentsPage() {
  return <PaymentList />;
}
