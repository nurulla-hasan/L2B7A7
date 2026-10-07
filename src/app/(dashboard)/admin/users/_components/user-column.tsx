"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Ban, UserCheck } from "lucide-react";

import type { UserItem } from "@/types";
import { useUpdateUserStatus } from "@/services";
import { ConfirmationModal } from "@/components/common/confirmation-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { successToast, errorToast } from "@/lib/toast";
import { getErrorMessage } from "@/lib/error";
import { formatDate, cn } from "@/lib/utils";

function UserActionsCell({ user }: { user: UserItem }) {
  const { mutate: updateStatus, isPending: isUpdatingStatus } =
    useUpdateUserStatus();

  const handleConfirmStatusChange = () => {
    const nextStatus = user.status === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    updateStatus(
      {
        id: user.id,
        payload: { status: nextStatus },
      },
      {
        onSuccess: () => {
          successToast(
            "User status updated",
            `${user.name} has been ${nextStatus === "ACTIVE" ? "activated" : "blocked"}.`,
          );
        },
        onError: (error) => {
          errorToast(getErrorMessage(error, "Failed to update user status"));
        },
      },
    );
  };

  const isBlocked = user.status === "BLOCKED";

  return (
    <div className="flex items-center justify-end">
      <ConfirmationModal
        title={isBlocked ? "Activate User" : "Block User"}
        description={`Are you sure you want to ${
          isBlocked ? "activate" : "block"
        } ${user.name}? ${
          isBlocked
            ? "The user will regain access to their account."
            : "The user will lose access to the portal immediately."
        }`}
        confirmText={isBlocked ? "Activate User" : "Block User"}
        variant={isBlocked ? "default" : "destructive"}
        isLoading={isUpdatingStatus}
        onConfirm={handleConfirmStatusChange}
        trigger={
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "cursor-pointer",
              isBlocked
                ? "text-primary hover:bg-primary/10"
                : "text-destructive hover:bg-destructive/10",
            )}
            title={isBlocked ? "Activate User" : "Block User"}
          >
            {isBlocked ? <UserCheck /> : <Ban />}
            <span className="sr-only">
              {isBlocked ? "Activate user" : "Block user"}
            </span>
          </Button>
        }
      />
    </div>
  );
}

export const userColumns: ColumnDef<UserItem>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <div>
          <p className="font-medium text-foreground">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role;
      return (
        <Badge
          variant={
            role === "ADMIN"
              ? "admin"
              : role === "TEACHER"
                ? "manager"
                : "success"
          }
          size="sm"
        >
          {role}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant={status === "ACTIVE" ? "active" : "blocked"} size="sm">
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      return (
        <span className="text-xs text-muted-foreground">
          {row.original.phone || "—"}
        </span>
      );
    },
  },
  {
    id: "profile",
    header: "Profile",
    cell: ({ row }) => {
      const user = row.original;

      if (user.role === "STUDENT") {
        return (
          <div className="text-xs">
            <p className="font-medium">
              {user.studentProfile?.studentId ?? "—"}
            </p>
            <p className="text-muted-foreground">
              {user.studentProfile?.department ?? "—"}
            </p>
          </div>
        );
      }

      if (user.role === "TEACHER") {
        return (
          <div className="text-xs">
            <p className="font-medium">
              {user.teacherProfile?.employeeId ?? "—"}
            </p>
            <p className="text-muted-foreground">
              {user.teacherProfile?.designation ?? "—"}
            </p>
          </div>
        );
      }

      return <span className="text-xs text-muted-foreground">—</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      return (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {formatDate(row.original.createdAt)}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => <UserActionsCell user={row.original} />,
  },
];
