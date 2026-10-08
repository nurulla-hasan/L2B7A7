"use client";

import { Send } from "lucide-react";

import { SectionHeading } from "@/components/common/section-heading";
import { SearchInput } from "@/components/common/search-input";
import { DataTable } from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStateFilter } from "@/hooks";
import { useGetAllResults, usePublishResults } from "@/services";
import { getErrorMessage } from "@/lib/error";
import { successToast, errorToast } from "@/lib/toast";
import { resultColumns } from "./result-column";

const STATUS_OPTIONS: { label: string; value: string }[] = [
  { label: "All Statuses", value: "all" },
  { label: "Published Only", value: "true" },
  { label: "Draft (Unpublished)", value: "false" },
];

export default function ResultList() {
  const filter = useStateFilter();

  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetAllResults(filter.filters);

  const publishMutation = usePublishResults();

  const results = response?.data ?? [];
  const meta = response?.meta;

  const draftCount = meta?.draftCount ?? 0;

  const handleBulkPublish = () => {
    if (draftCount === 0) return;

    publishMutation.mutate(
      { publishAll: true },
      {
        onSuccess: (res) => {
          successToast(
            "Results published",
            res?.message || `${draftCount} draft result(s) have been successfully published.`
          );
        },
        onError: (err) => {
          errorToast(getErrorMessage(err, "Failed to publish results"));
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        title="Exam Results & Grading"
        description="Audit student examination marks, evaluate grade distributions, and publish academic records."
        alignment="left"
        as="h3"
      >
        {draftCount > 0 && (
          <Button
            variant="default"
            onClick={handleBulkPublish}
            loading={publishMutation.isPending}
            loadingText="Publishing..."
            className="cursor-pointer gap-1.5"
          >
            <Send className="size-3.5" />
            Publish All Drafts ({draftCount})
          </Button>
        )}
      </SectionHeading>

      {/* Filters row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-xs">
          <SearchInput
            filter={filter}
            filterKey="searchTerm"
            debounce={500}
            placeholder="Search student, course, instructor..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Select
            value={filter.getFilter("published")}
            onValueChange={(val) =>
              filter.updateFilter(
                "published",
                !val || val === "all" ? null : val
              )
            }
          >
            <SelectTrigger className="w-48 cursor-pointer">
              <SelectValue placeholder="Status">
                {(val) =>
                  STATUS_OPTIONS.find((opt) => opt.value === val)?.label ||
                  "All Statuses"
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="end">
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  className="cursor-pointer"
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={resultColumns}
        data={results}
        meta={meta}
        filter={filter}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        errorMessage={getErrorMessage(error, "Failed to load examination results")}
        onRetry={refetch}
      />
    </div>
  );
}
