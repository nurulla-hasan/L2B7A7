import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { JwtPayload } from "jsonwebtoken";

import { jwtUtils } from "@/lib/jwt";

export type UserRole = "ADMIN" | "TEACHER" | "STUDENT";

export interface TokenPayload extends JwtPayload {
  id: string;
  name?: string;
  email?: string;
  role: UserRole;
  status: "ACTIVE" | "BLOCKED";
}

const PRIVATE_ROUTES = ["/admin", "/teacher", "/student"];

const AUTH_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

const ROLE_HOME: Record<UserRole, string> = {
  ADMIN: "/admin/dashboard",
  TEACHER: "/teacher/dashboard",
  STUDENT: "/student/dashboard",
};

const REFRESH_BEFORE_EXPIRY = 5 * 60;

function verifyToken(token?: string): TokenPayload | null {
  return jwtUtils.verifyToken<TokenPayload>(token);
}

function isTokenExpiringSoon(session: TokenPayload | null) {
  if (!session?.exp) return false;

  const now = Math.floor(Date.now() / 1000);

  return session.exp - now <= REFRESH_BEFORE_EXPIRY;
}

async function refreshAccessToken(
  refreshToken: string,
): Promise<string | null> {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

    const res = await fetch(`${apiUrl.replace(/\/$/, "")}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refreshToken=${refreshToken}`,
      },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();

    return data?.data?.accessToken ?? null;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const isPrivateRoute = PRIVATE_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  const accessToken = request.cookies.get("accessToken")?.value;

  const refreshToken = request.cookies.get("refreshToken")?.value;

  let session = verifyToken(accessToken);
  let newAccessToken: string | null = null;

  // Refresh if expired/missing or less than 5 minutes remain
  if (refreshToken && (!session || isTokenExpiringSoon(session))) {
    const refreshedToken = await refreshAccessToken(refreshToken);

    if (refreshedToken) {
      const refreshedSession = verifyToken(refreshedToken);

      if (refreshedSession) {
        session = refreshedSession;
        newAccessToken = refreshedToken;
      }
    }
  }

  const isAuthenticated =
    Boolean(session?.role) && session?.status === "ACTIVE";

  const role = isAuthenticated ? session?.role : undefined;

  let response: NextResponse | null = null;

  // Unauthenticated → private route
  if (isPrivateRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);

    loginUrl.searchParams.set("callbackUrl", pathname + search);

    response = NextResponse.redirect(loginUrl);
  }

  // Authenticated → auth routes
  else if (isAuthRoute && role) {
    response = NextResponse.redirect(new URL(ROLE_HOME[role], request.url));
  }


  // Strict role isolation
  else if (role) {
    const isAdminPortal =
      pathname === "/admin" || pathname.startsWith("/admin/");

    const isTeacherPortal =
      pathname === "/teacher" || pathname.startsWith("/teacher/");

    const isStudentPortal =
      pathname === "/student" || pathname.startsWith("/student/");

    const wrongPortal =
      (role === "ADMIN" && (isTeacherPortal || isStudentPortal)) ||
      (role === "TEACHER" && (isAdminPortal || isStudentPortal)) ||
      (role === "STUDENT" && (isAdminPortal || isTeacherPortal));

    if (wrongPortal) {
      response = NextResponse.redirect(new URL(ROLE_HOME[role], request.url));
    }
  }

  if (!response) {
    response = NextResponse.next();
  }

  // Store refreshed access token
  if (newAccessToken && session?.exp) {
    const now = Math.floor(Date.now() / 1000);

    response.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: Math.max(session.exp - now, 0),
    });
  }

  return response;
}

export default proxy;

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|robots.txt|sitemap.xml|assets|.*\\..*).*)",
  ],
};
