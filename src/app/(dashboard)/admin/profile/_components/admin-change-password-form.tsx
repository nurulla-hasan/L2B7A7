"use client";

import * as React from "react";
import { KeyRound, Lock, ShieldCheck } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useChangePassword } from "@/services";
import { successToast, errorToast } from "@/lib/toast";
import { getErrorMessage } from "@/lib/error";

export function AdminChangePasswordForm() {
  const { mutateAsync: changePassword, isPending } = useChangePassword();

  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!oldPassword) {
      errorToast("Current password is required");
      return;
    }

    if (newPassword.length < 6) {
      errorToast("New password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      errorToast("New passwords do not match");
      return;
    }

    if (newPassword === oldPassword) {
      errorToast("New password must be different from current password");
      return;
    }

    try {
      await changePassword({
        oldPassword,
        newPassword,
      });
      successToast(
        "Password Changed",
        "Your administrator security password has been updated successfully."
      );
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      errorToast(getErrorMessage(error, "Failed to change password"));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold text-foreground">
          Administrator Security & Password
        </CardTitle>
        <CardDescription className="text-xs">
          Maintain strict system security by updating your master administrative password regularly.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password */}
          <div className="space-y-1.5">
            <Label htmlFor="admin-old-password">Current Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="admin-old-password"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-9 font-mono text-sm"
                required
              />
            </div>
          </div>

          {/* New Password & Confirm Password */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="admin-new-password">New Password</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="admin-new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="pl-9 font-mono text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="admin-confirm-password">Confirm Password</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="admin-confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="pl-9 font-mono text-sm"
                  required
                />
              </div>
            </div>
          </div>

          <p className="text-2xs text-muted-foreground flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-primary" />
            Administrative passwords require high entropy: min 6 characters, mixing characters, numbers, and symbols.
          </p>

          {/* Submit Action */}
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              loading={isPending}
              loadingText="Updating Password..."
            >
              Update Password
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default AdminChangePasswordForm;
