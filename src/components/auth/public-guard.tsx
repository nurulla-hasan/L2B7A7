"use client";

import { useGetMe } from "@/services";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import AuthLoading from "./auth-loading";
import { getDashboardPathByRole } from "@/constants/routes";

interface PublicGuardProps {
  children: ReactNode;
  redirectTo?: string;
  loadingClassName?: string;
}

export default function PublicGuard({
  children,
  redirectTo,
  loadingClassName = "min-h-screen",
}: PublicGuardProps) {
  const router = useRouter();

  const { data, isPending, isError } = useGetMe();

  const user = data?.data?.user;

  useEffect(() => {
    if (isPending) {
      return;
    }
    if (!isError && user) {
      const destination =
        redirectTo || (user.role ? getDashboardPathByRole(user.role) : "/admin/dashboard");
      router.replace(destination);
    }
  }, [isPending, isError, user, router, redirectTo]);

  if (isPending) {
    return <AuthLoading label="Checking session..." className={loadingClassName} />;
  }

  if (!isError && user) {
    return <AuthLoading label="Redirecting to dashboard..." className={loadingClassName} />;
  }

  return <>{children}</>;
}
