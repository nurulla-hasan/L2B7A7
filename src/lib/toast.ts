import * as React from "react";
import { toast as sonnerToast, type ExternalToast } from "sonner";
import { getErrorMessage } from "./error";

export type ToastType = "success" | "error" | "info" | "warning" | "loading" | "default";


export interface ToastAddOptions extends Omit<ExternalToast, "description"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  type?: ToastType;
}

/**
 * Reusable object-based toast utility function (camelCase best practice)
 * Usage:
 * ```ts
 * addToast({
 *   title: "Login Success",
 *   description: "Welcome back",
 *   type: "success",
 * });
 * ```
 */
export function addToast({
  title,
  description,
  type = "default",
  ...rest
}: ToastAddOptions) {
  const options: ExternalToast = {
    description,
    ...rest,
  };

  switch (type) {
    case "success":
      return sonnerToast.success(title, options);
    case "error":
      return sonnerToast.error(title, options);
    case "warning":
      return sonnerToast.warning(title, options);
    case "info":
      return sonnerToast.info(title, options);
    case "loading":
      return sonnerToast.loading(title, options);
    default:
      return sonnerToast(title, options);
  }
}

// Extended toast object matching standard ecosystem conventions (toast.add, toast.dismiss, etc.)
export const toast = Object.assign(sonnerToast, {
  add: addToast,
});

/**
 * Convenience helper to immediately display an error toast with the extracted error message.
 */
export function showErrorToast(
  error: unknown,
  title = "Action Failed",
  fallback = "Something went wrong. Please try again."
) {
  return addToast({
    title,
    description: getErrorMessage(error, fallback),
    type: "error",
  });
}

export { getErrorMessage };
export default toast;

