import type { Metadata } from "next";
import StudentPaymentList from "./_components/student-payment-list";

export const metadata: Metadata = {
  title: "Fee Payments | Student Portal",
  description:
    "Review tuition invoices, verify payment status, and pay course fees via bKash.",
};

export default function StudentPaymentsPage() {
  return <StudentPaymentList />;
}
