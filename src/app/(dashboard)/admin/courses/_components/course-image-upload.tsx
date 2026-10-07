"use client";

import * as React from "react";
import Image from "next/image";
import { UploadCloud, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const MAX_FILES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

interface CourseImageUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
  existingImages?: string[];
  disabled?: boolean;
}

export function CourseImageUpload({
  files,
  onChange,
  existingImages = [],
  disabled = false,
}: CourseImageUploadProps) {
  const [dragActive, setDragActive] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const previews = React.useMemo(() => {
    if (typeof window === "undefined") return [];
    return files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
    }));
  }, [files]);

  // Clean up object URLs on unmount or file changes
  React.useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  const handleFiles = (incomingFiles: FileList | File[]) => {
    setErrorMsg(null);
    const newFiles: File[] = [];

    const totalAllowed = MAX_FILES - files.length;
    if (totalAllowed <= 0) {
      setErrorMsg(`You can upload a maximum of ${MAX_FILES} images.`);
      return;
    }

    const fileArray = Array.from(incomingFiles);
    for (const file of fileArray) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setErrorMsg("Only JPEG, PNG, and WebP images are allowed.");
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setErrorMsg(`"${file.name}" exceeds the 5MB size limit.`);
        return;
      }
      if (newFiles.length < totalAllowed) {
        newFiles.push(file);
      }
    }

    if (newFiles.length > 0) {
      onChange([...files, ...newFiles]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (disabled || !e.dataTransfer.files) return;
    handleFiles(e.dataTransfer.files);
  };

  const handleRemove = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          Course Images / Materials
        </label>
        <span className="text-xs text-muted-foreground">
          {files.length}/{MAX_FILES} images (Max 5MB each)
        </span>
      </div>

      {/* Drop area */}
      {files.length < MAX_FILES && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !disabled && inputRef.current?.click()}
          className={cn(
            "relative flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-4 transition-colors hover:bg-muted/30 focus-visible:outline-hidden",
            dragActive && "border-primary bg-primary/5",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            multiple
            disabled={disabled}
            className="hidden"
            onChange={(e) => {
              if (e.target.files) {
                handleFiles(e.target.files);
                e.target.value = "";
              }
            }}
          />

          <div className="flex flex-col items-center gap-1.5 text-center">
            <div className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <UploadCloud className="size-5" />
            </div>
            <p className="text-xs font-medium text-foreground">
              Click to upload or drag & drop
            </p>
            <p className="text-[11px] text-muted-foreground">
              PNG, JPG, or WebP up to 5MB
            </p>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-1.5 text-xs text-destructive">
          <AlertCircle className="size-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Existing uploaded images preview */}
      {existingImages.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">
            Current Images
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {existingImages.map((url, idx) => (
              <div
                key={url + idx}
                className="group relative flex aspect-video items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/40"
              >
                <Image
                  src={url}
                  alt={`Existing course image ${idx + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <Badge
                  variant="secondary"
                  size="sm"
                  className="absolute bottom-1 left-1 text-[10px]"
                >
                  Saved
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Newly attached files preview */}
      {previews.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">
            Newly Attached ({previews.length})
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {previews.map((preview, idx) => (
              <div
                key={preview.url}
                className="relative flex items-center gap-2.5 rounded-lg border border-border bg-card p-2 shadow-xs"
              >
                <div className="relative size-11 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                  <Image
                    src={preview.url}
                    alt={preview.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-foreground">
                    {preview.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {preview.size}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={disabled}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(idx);
                  }}
                  className="size-7 cursor-pointer text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  title="Remove image"
                >
                  <X className="size-3.5" />
                  <span className="sr-only">Remove</span>
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseImageUpload;
