"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Ban, Check, MoreHorizontal, UserCheck, UserCog } from "lucide-react";

import type { UserItem, UserRole } from "@/types";
import { useUpdateUserRole, useUpdateUserStatus } from "@/services";
import { ConfirmationModal } from "@/components/common/confirmation-modal";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { successToast, errorToast } from "@/lib/toast";
import { getErrorMessage } from "@/lib/error";
import { formatDate } from "@/lib/utils";

function UserActionsCell({ user }: { user: UserItem }) {
  const [isStatusModalOpen, setIsStatusModalOpen] = React.useState(false);
  const { mutate: updateStatus, isPending: isUpdatingStatus } =
    useUpdateUserStatus();
  const { mutate: updateRole, isPending: isUpdatingRole } = useUpdateUserRole();

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
          setIsStatusModalOpen(false);
        },
        onError: (error) => {
          errorToast(getErrorMessage(error, "Failed to update user status"));
        },
      },
    );
  };

  const handleRoleChange = (role: UserRole) => {
    if (role === user.role) return;
    updateRole(
      {
        id: user.id,
        payload: { role },
      },
      {
        onSuccess: () => {
          successToast(
            "User role updated",
            `${user.name}'s role changed to ${role}.`,
          );
        },
        onError: (error) => {
          errorToast(getErrorMessage(error, "Failed to update user role"));
        },
      },
    );
  };

  return (
    <div className="text-right">
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex size-8 items-center justify-center rounded-md hover:bg-muted cursor-pointer transition-colors">
          <MoreHorizontal className="size-4" />
          <span className="sr-only">Open menu</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            {/* Role Change Submenu */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <UserCog className="mr-2 size-4" />
                <span>Change Role</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-36">
                {(["ADMIN", "TEACHER", "STUDENT"] as const).map((role) => (
                  <DropdownMenuItem
                    key={role}
                    disabled={user.role === role || isUpdatingRole}
                    onClick={() => handleRoleChange(role)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <span className="capitalize">{role.toLowerCase()}</span>
                    {user.role === role && <Check className="ml-2 size-3.5" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            {/* Status Toggle Item */}
            <DropdownMenuItem
              variant={user.status === "ACTIVE" ? "destructive" : "default"}
              onClick={() => setIsStatusModalOpen(true)}
              className="cursor-pointer"
            >
              {user.status === "ACTIVE" ? (
                <>
                  <Ban className="mr-2 size-4" />
                  <span>Block User</span>
                </>
              ) : (
                <>
                  <UserCheck className="mr-2 size-4 text-primary" />
                  <span className="text-primary">Activate User</span>
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationModal
        open={isStatusModalOpen}
        onOpenChange={setIsStatusModalOpen}
        title={user.status === "ACTIVE" ? "Block User" : "Activate User"}
        description={`Are you sure you want to ${
          user.status === "ACTIVE" ? "block" : "activate"
        } ${user.name}? ${
          user.status === "ACTIVE"
            ? "The user will lose access to the portal immediately."
            : "The user will regain access to their account."
        }`}
        confirmText={user.status === "ACTIVE" ? "Block User" : "Activate User"}
        variant={user.status === "ACTIVE" ? "destructive" : "default"}
        isLoading={isUpdatingStatus}
        onConfirm={handleConfirmStatusChange}
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
