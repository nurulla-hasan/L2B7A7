import type { Metadata } from "next";
import ResultList from "./_components/result-list";

export const metadata: Metadata = {
  title: "Exam Results & Grading | UniPortal Admin",
  description:
    "Audit student examination marks, evaluate letter grades and GPA distribution, and manage result publication across academic terms.",
  keywords: [
    "Exam Results",
    "Academic Grading",
    "Student Scorecard",
    "Marks Evaluation",
    "Grade Distribution",
    "Admin Portal",
  ],
};

export default function ResultsPage() {
  return <ResultList />;
}
