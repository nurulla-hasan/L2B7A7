"use client";

import * as React from "react";
import { User, Phone, Mail, Save } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useUpdateMe } from "@/services";
import { successToast, errorToast } from "@/lib/toast";
import { getErrorMessage } from "@/lib/error";
import type { AuthUser } from "@/types";

interface AdminEditProfileFormProps {
  user?: AuthUser;
}

export function AdminEditProfileForm({ user }: AdminEditProfileFormProps) {
  const { mutateAsync: updateProfile, isPending } = useUpdateMe();

  const [name, setName] = React.useState(user?.name ?? "");
  const [phone, setPhone] = React.useState(user?.phone ?? "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      errorToast("Name is required");
      return;
    }

    try {
      await updateProfile({
        name: name.trim(),
        phone: phone.trim() || undefined,
      });
      successToast(
        "Profile Updated",
        "Your administrator profile details have been saved successfully."
      );
    } catch (error) {
      errorToast(getErrorMessage(error, "Failed to update profile"));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold text-foreground">
          Personal Information
        </CardTitle>
        <CardDescription className="text-xs">
          Update your public profile display name and administrative contact phone number.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <Label htmlFor="admin-profile-name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="admin-profile-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="pl-9"
                required
              />
            </div>
          </div>

          {/* Email Address (Read-only) */}
          <div className="space-y-1.5">
            <Label htmlFor="admin-profile-email">Institutional Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="admin-profile-email"
                value={user?.email ?? ""}
                readOnly
                disabled
                className="pl-9 bg-muted/50 cursor-not-allowed font-mono text-sm"
              />
            </div>
            <p className="text-2xs text-muted-foreground">
              Administrator institutional email is managed at the server level and cannot be modified.
            </p>
          </div>

          {/* Contact Phone */}
          <div className="space-y-1.5">
            <Label htmlFor="admin-profile-phone">Contact Phone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="admin-profile-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+880 1700 000000"
                className="pl-9 font-mono text-sm"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              loading={isPending}
              loadingText="Saving Changes..."
            >
              <Save />
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default AdminEditProfileForm;
