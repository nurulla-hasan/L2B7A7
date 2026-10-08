"use client";

import { SectionHeading } from "@/components/common/section-heading";
import { SearchInput } from "@/components/common/search-input";

import { useStateFilter } from "@/hooks";
import { useGetUsers } from "@/services";
import { getErrorMessage } from "@/lib/error";
import { userColumns } from "./user-column";
import { DataTable } from "@/components/common/data-table";

export default function UsersList() {
  const filter = useStateFilter();

  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetUsers(filter.filters);

  const users = response?.data ?? [];
  const meta = response?.meta;

  return (
    <div className="space-y-6">
      <SectionHeading
        title="Users Management"
        description="Manage student registrations, faculty access, and administrator credentials."
        alignment="left"
        as="h3"
      >
        <SearchInput
          filter={filter}
          filterKey="searchTerm"
          debounce={500}
          placeholder="Search users..."
        />
      </SectionHeading>

      <DataTable
        columns={userColumns}
        data={users}
        meta={meta}
        filter={filter}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        errorMessage={getErrorMessage(error, "Failed to load users")}
        onRetry={refetch}
      />
    </div>
  );
}
