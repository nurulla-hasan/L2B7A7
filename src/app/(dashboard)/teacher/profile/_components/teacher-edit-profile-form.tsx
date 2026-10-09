"use client";

import * as React from "react";
import { User, Phone, Mail, Save, FileText } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useUpdateMe } from "@/services";
import { successToast, errorToast } from "@/lib/toast";
import { getErrorMessage } from "@/lib/error";
import type { AuthUser } from "@/types";

interface TeacherEditProfileFormProps {
  user?: AuthUser;
}

export function TeacherEditProfileForm({ user }: TeacherEditProfileFormProps) {
  const { mutateAsync: updateProfile, isPending } = useUpdateMe();

  const [name, setName] = React.useState(user?.name ?? "");
  const [phone, setPhone] = React.useState(user?.phone ?? "");
  const [bio, setBio] = React.useState(user?.teacherProfile?.bio ?? "");

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
        bio: bio.trim(),
      });
      successToast(
        "Profile Updated",
        "Your faculty profile information has been saved successfully."
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
          Update your public profile display name, contact phone number, and research biography.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <Label htmlFor="teacher-profile-name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="teacher-profile-name"
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
            <Label htmlFor="teacher-profile-email">Institutional Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="teacher-profile-email"
                value={user?.email ?? ""}
                readOnly
                disabled
                className="pl-9 bg-muted/50 cursor-not-allowed font-mono text-sm"
              />
            </div>
            <p className="text-2xs text-muted-foreground">
              Official institutional email is administered centrally and cannot be altered.
            </p>
          </div>

          {/* Contact Phone */}
          <div className="space-y-1.5">
            <Label htmlFor="teacher-profile-phone">Contact Phone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="teacher-profile-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+880 1700 000000"
                className="pl-9 font-mono text-sm"
              />
            </div>
          </div>

          {/* Faculty Biography */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="teacher-profile-bio" className="flex items-center gap-1.5">
                <FileText className="size-3.5 text-muted-foreground" />
                Faculty Bio / Academic Interests
              </Label>
              <span className="text-2xs text-muted-foreground font-mono">
                {bio.length}/500
              </span>
            </div>
            <Textarea
              id="teacher-profile-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Brief summary of your academic background, research interests, or office consultation hours..."
              maxLength={500}
              rows={3}
              className="resize-none text-xs"
            />
          </div>

          {/* Submit Action */}
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              loading={isPending}
              loadingText="Saving Changes..."
            >
              <Save className="size-4" />
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default TeacherEditProfileForm;
