"use client";

import * as React from "react";
import {
  Eye,
  Calendar,
  User,
  Shield,
  Layers,
  FileCode2,
  Copy,
  Check,
} from "lucide-react";

import { ModalWrapper } from "@/components/common/modal-wrapper";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDateTime, formatRelativeTime, getInitials } from "@/lib/utils";
import { AuditActionBadge } from "./audit-action-badge";
import type { AuditLogItem } from "@/types";

interface AuditDetailsModalProps {
  log: AuditLogItem;
  trigger?: React.ReactNode;
}

export function AuditDetailsModal({ log, trigger }: AuditDetailsModalProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopyPayload = () => {
    if (!log.details) return;
    navigator.clipboard.writeText(JSON.stringify(log.details, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const defaultTrigger = (
    <Button
      variant="ghost"
      size="icon-sm"
      className="cursor-pointer text-muted-foreground hover:text-foreground"
      title="View Audit Details"
    >
      <Eye className="size-4" />
      <span className="sr-only">View audit event details</span>
    </Button>
  );

  return (
    <ModalWrapper
      title="Audit Event Inspection"
      description="Immutable ledger record of administrative operations and system modifications."
      actionTrigger={trigger ?? defaultTrigger}
    >
      <div className="space-y-5 pt-2">
        {/* Event Header Banner */}
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-card p-4 shadow-2xs">
          <div className="grid gap-1">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Triggered Operation
            </span>
            <div>
              <AuditActionBadge action={log.action} />
            </div>
          </div>

          <div className="text-right space-y-1">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Captured Timestamp
            </span>
            <div className="flex items-center gap-1.5 text-xs text-foreground font-mono">
              <Calendar className="size-3.5 text-muted-foreground" />
              <span>{formatDateTime(log.createdAt)}</span>
              <span className="text-muted-foreground">
                ({formatRelativeTime(log.createdAt)})
              </span>
            </div>
          </div>
        </div>

        {/* Actor Profile & Target Entity Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Actor Profile */}
          <div className="rounded-xl border border-border bg-muted/30 p-3.5 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <User className="size-3.5" />
              <span>Operator Profile</span>
            </div>

            {log.user ? (
              <div className="flex items-center gap-3">
                <Avatar className="size-9 border border-border">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                    {getInitials(log.user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground text-sm truncate">
                      {log.user.name}
                    </p>
                    <Badge variant="outline" className="text-[10px] py-0 px-1 font-mono uppercase">
                      {log.user.role}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate font-mono">
                    {log.user.email}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-muted-foreground py-1">
                <Shield className="size-4 text-primary" />
                <span className="font-medium">System Automated Worker</span>
              </div>
            )}

            <div className="pt-1 text-[11px] text-muted-foreground">
              <span className="font-medium text-foreground">User ID:</span>{" "}
              <code className="font-mono text-[10px] break-all">
                {log.userId || "System Service"}
              </code>
            </div>
          </div>

          {/* Target Resource */}
          <div className="rounded-xl border border-border bg-muted/30 p-3.5 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <Layers className="size-3.5" />
              <span>Target Resource</span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Resource Type:</span>
                <Badge variant="secondary" className="font-mono text-xs">
                  {log.resource}
                </Badge>
              </div>

              <div className="flex items-baseline justify-between gap-2">
                <span className="text-xs text-muted-foreground shrink-0">Resource ID:</span>
                <code className="font-mono text-xs text-foreground break-all text-right">
                  {log.resourceId || "None"}
                </code>
              </div>

              <div className="flex items-baseline justify-between gap-2">
                <span className="text-xs text-muted-foreground shrink-0">Log ID:</span>
                <code className="font-mono text-[10px] text-muted-foreground break-all text-right">
                  {log.id}
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Structured Payload Inspector */}
        <div className="rounded-xl border border-border bg-card p-3.5 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <FileCode2 className="size-3.5" />
              <span>Captured Payload & State Details</span>
            </div>
            {log.details && (
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={handleCopyPayload}
                className="cursor-pointer gap-1 text-[11px]"
              >
                {copied ? (
                  <>
                    <Check className="size-3 text-emerald-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="size-3" />
                    Copy JSON
                  </>
                )}
              </Button>
            )}
          </div>

          {log.details && Object.keys(log.details).length > 0 ? (
            <pre className="max-h-64 overflow-y-auto rounded-lg border border-border bg-muted/50 p-3 font-mono text-xs text-foreground leading-relaxed whitespace-pre-wrap break-all">
              {JSON.stringify(log.details, null, 2)}
            </pre>
          ) : (
            <div className="rounded-lg border border-border bg-muted/20 py-6 text-center text-xs text-muted-foreground">
              No payload attributes were recorded for this audit entry.
            </div>
          )}
        </div>
      </div>
    </ModalWrapper>
  );
}

export default AuditDetailsModal;
