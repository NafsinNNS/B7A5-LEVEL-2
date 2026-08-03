// Next.js 16 proxy (middleware) — role-based route protection for RentNest

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { JwtPayload } from "jsonwebtoken";

import { jwtUtils } from "./utils/jwt";
import { refreshAccessToken } from "./service/refresh";

const AUTH_ROUTES = ["/login", "/register"];
const PUBLIC_ROUTES = ["/", "/rentals", "/payment"];

const getRoleDashboard = (role?: string) => {
  if (role === "ADMIN") return "/admin-dashboard";
  if (role === "LANDLORD") return "/landlord-dashboard";
  if (role === "TENANT") return "/dashboard";
  return "/";
};

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  let accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const accessTokenVerification = accessToken
    ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string)
    : null;
  let decodedAccessToken = accessTokenVerification?.success
    ? (accessTokenVerification.data as JwtPayload)
    : null;

  const refreshTokenVerification = refreshToken
    ? jwtUtils.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET as string)
    : null;
  const decodedRefreshToken = refreshTokenVerification?.success
    ? (refreshTokenVerification.data as JwtPayload)
    : null;

  if (!decodedAccessToken && decodedRefreshToken) {
    // access token has expired but refresh token is valid, refresh the access token
    const newAccessToken = await refreshAccessToken();

    if (newAccessToken) {
      accessToken = newAccessToken;

      const newVerification = jwtUtils.verifyToken(
        newAccessToken,
        process.env.JWT_ACCESS_SECRET as string
      );
      decodedAccessToken = newVerification?.success
        ? (newVerification.data as JwtPayload)
        : null;
    }
  }

  const userRole = decodedAccessToken?.role as string | undefined;

  const isPublic = PUBLIC_ROUTES.some(
    (route) => pathname === route || (route !== "/" && pathname.startsWith(route))
  );

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route)
  );

  // user is logged in and trying to access login or register, redirect them to their role dashboard
  if (accessToken && isAuthRoute) {
    return NextResponse.redirect(new URL(getRoleDashboard(userRole), request.url));
  }

  // user is not logged in and trying to access a protected route, redirect them to login
  if (!accessToken && !isPublic && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/dashboard") && userRole !== "TENANT") {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }

  if (pathname.startsWith("/landlord-dashboard") && userRole !== "LANDLORD") {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }

  if (pathname.startsWith("/admin-dashboard") && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // catch all routes, excluding API routes, static files, and image optimizations
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
