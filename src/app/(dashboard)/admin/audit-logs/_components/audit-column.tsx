"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Calendar, Layers, Shield } from "lucide-react";

import type { AuditLogItem } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDateTime, formatRelativeTime, getInitials } from "@/lib/utils";
import { AuditActionBadge } from "./audit-action-badge";
import { AuditDetailsModal } from "./audit-details-modal";

export const auditColumns: ColumnDef<AuditLogItem>[] = [
  // 1. Timestamp
  {
    accessorKey: "createdAt",
    header: "Timestamp",
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      return (
        <div className="flex flex-col gap-0.5 min-w-36">
          <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
            <Calendar className="size-3 text-muted-foreground shrink-0" />
            <span>{formatDateTime(createdAt)}</span>
          </div>
          <span className="text-[11px] text-muted-foreground pl-4.5">
            {formatRelativeTime(createdAt)}
          </span>
        </div>
      );
    },
  },

  // 2. Actor / Operator
  {
    id: "actor",
    header: "Operator",
    cell: ({ row }) => {
      const user = row.original.user;

      if (!user) {
        return (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex size-7 items-center justify-center rounded-full bg-muted border border-border">
              <Shield className="size-3.5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">System Automated</p>
              <p className="text-[10px] text-muted-foreground">Internal Service</p>
            </div>
          </div>
        );
      }

      return (
        <div className="flex items-center gap-2.5 min-w-44">
          <Avatar className="size-8 border border-border">
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-foreground text-xs truncate max-w-28">
                {user.name}
              </span>
              <Badge variant="outline" className="text-[9px] py-0 px-1 font-mono uppercase">
                {user.role}
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground truncate font-mono">
              {user.email}
            </p>
          </div>
        </div>
      );
    },
  },

  // 3. Action
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      return <AuditActionBadge action={row.original.action} />;
    },
  },

  // 4. Target Resource
  {
    accessorKey: "resource",
    header: "Resource",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-1.5">
          <Layers className="size-3.5 text-muted-foreground shrink-0" />
          <Badge variant="secondary" className="font-medium text-xs">
            {row.original.resource}
          </Badge>
        </div>
      );
    },
  },

  // 5. Resource ID
  {
    accessorKey: "resourceId",
    header: "Entity ID",
    cell: ({ row }) => {
      const id = row.original.resourceId;
      if (!id) {
        return <span className="text-xs text-muted-foreground">—</span>;
      }
      return (
        <span
          className="font-mono text-xs text-muted-foreground hover:text-foreground cursor-help"
          title={id}
        >
          {id.slice(0, 8)}...
        </span>
      );
    },
  },

  // 6. Action Inspection
  {
    id: "actions",
    header: () => <div className="text-right">Inspect</div>,
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-end">
          <AuditDetailsModal log={row.original} />
        </div>
      );
    },
  },
];
