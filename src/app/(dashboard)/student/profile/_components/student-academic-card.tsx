"use client";

import * as React from "react";
import { Copy, Check, ShieldCheck, Mail, Camera } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageCropDialog } from "@/components/common/image-crop-dialog";
import { formatDate, getInitials } from "@/lib/utils";
import { useUploadProfileImage } from "@/services";
import { successToast, errorToast } from "@/lib/toast";
import { getErrorMessage } from "@/lib/error";
import type { AuthUser } from "@/types";

interface StudentAcademicCardProps {
  user?: AuthUser;
  isLoading?: boolean;
}

export function StudentAcademicCard({
  user,
  isLoading,
}: StudentAcademicCardProps) {
  const [copied, setCopied] = React.useState(false);
  const [cropImageSrc, setCropImageSrc] = React.useState<string | null>(null);
  const [isCropOpen, setIsCropOpen] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { mutateAsync: uploadImage, isPending: isUploadingImage } =
    useUploadProfileImage();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="size-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <div className="space-y-2 pt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const profile = user?.studentProfile;
  const studentId = profile?.studentId || "—";

  const handleCopyId = () => {
    if (profile?.studentId) {
      navigator.clipboard.writeText(profile.studentId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    if (!file.type.startsWith("image/")) {
      errorToast("Invalid file type", "Please select an image file (JPEG, PNG, WebP).");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      errorToast("File too large", "Source image size cannot exceed 15MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCropImageSrc(reader.result as string);
      setIsCropOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedFile: File) => {
    const formData = new FormData();
    formData.append("image", croppedFile);

    try {
      await uploadImage(formData);
      successToast(
        "Profile Photo Updated",
        "Your profile picture has been cropped and updated successfully."
      );
    } catch (error) {
      errorToast(getErrorMessage(error, "Failed to upload profile photo"));
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <Avatar className="size-16 border-2 border-border shadow-sm">
                {user?.imageUrl && (
                  <AvatarImage src={user.imageUrl} alt={user.name} />
                )}
                <AvatarFallback className="text-base font-bold bg-primary/10 text-primary">
                  {getInitials(user?.name ?? "Student")}
                </AvatarFallback>
              </Avatar>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Upload profile image"
                disabled={isUploadingImage}
              />

              <Button
                type="button"
                variant="secondary"
                size="icon-xs"
                onClick={() => fileInputRef.current?.click()}
                loading={isUploadingImage}
                disabled={isUploadingImage}
                title="Change & crop profile photo"
                aria-label="Change & crop profile photo"
                className="absolute -bottom-1 -right-1 rounded-full shadow-md"
              >
                <Camera className="size-3" />
              </Button>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg font-bold text-foreground">
                  {user?.name ?? "Student"}
                </CardTitle>
                <Badge variant="outline">STUDENT</Badge>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Mail className="size-3 shrink-0" />
                <span className="truncate max-w-50">{user?.email}</span>
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Verified Academic Details */}
          <div className="space-y-2.5 rounded-lg border border-border bg-background p-3.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Student ID:</span>
              <div className="flex items-center gap-1.5 font-mono font-semibold text-foreground">
                <span>{studentId}</span>
                {profile?.studentId && (
                  <Button
                    variant="ghost"
                    onClick={handleCopyId}
                    title="Copy Student ID"
                    className="size-6 p-0"
                  >
                    {copied ? (
                      <Check className="size-3 text-emerald-500" />
                    ) : (
                      <Copy className="size-3" />
                    )}
                  </Button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Department:</span>
              <span className="font-medium text-foreground text-right">
                {profile?.department || "—"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Batch:</span>
              <span className="font-medium text-foreground">
                {profile?.batch ? `Batch ${profile.batch}` : "—"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Account Status:</span>
              <Badge
                variant={user?.status === "ACTIVE" ? "success" : "destructive"}
              >
                {user?.status ?? "ACTIVE"}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Enrolled Date:</span>
              <span className="text-foreground">
                {user?.createdAt ? formatDate(user.createdAt) : "—"}
              </span>
            </div>

            {user?.phone && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Contact Phone:</span>
                <span className="font-mono text-foreground">{user.phone}</span>
              </div>
            )}
          </div>

          {/* Registrar Notice */}
          <div className="flex items-start gap-2.5 rounded-lg border border-border bg-muted/40 p-3 text-xs">
            <ShieldCheck className="size-4 shrink-0 text-primary mt-0.5" />
            <p className="text-muted-foreground">
              Academic credentials (Student ID, Department, Batch) are verified
              and managed by the University Registrar Office.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Image Crop & Adjust Modal */}
      <ImageCropDialog
        open={isCropOpen}
        imageSrc={cropImageSrc}
        onClose={() => {
          setIsCropOpen(false);
          setCropImageSrc(null);
        }}
        onCropComplete={handleCropComplete}
      />
    </>
  );
}
