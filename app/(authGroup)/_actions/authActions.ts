"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getWithBody } from "@/lib/serverHttp";

const getRoleDashboard = (role?: string) => {
  if (role === "ADMIN") return "/admin-dashboard";
  if (role === "LANDLORD") return "/landlord-dashboard";
  return "/dashboard";
};

export const loginAction = async (formData: FormData) => {
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = formData.get("redirect");

  const result = (await getWithBody(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/auth/login`,
    { email, password }
  ).catch(() => null)) as {
    success: boolean;
    message?: string;
    data?: { accessToken: string; refreshToken: string };
  } | null;

  if (!result) {
    redirect("/login?error=Could%20not%20reach%20the%20server.%20Please%20try%20again.");
  }

  if (result.success && result.data) {
    const cookieStore = await cookies();
    cookieStore.set("accessToken", result.data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
    });
    cookieStore.set("refreshToken", result.data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    const decodedToken = jwt.decode(result.data.accessToken) as JwtPayload;

    if (redirectTo && String(redirectTo).startsWith("/")) {
      redirect(String(redirectTo));
    }
    redirect(getRoleDashboard(decodedToken?.role));
  }

  redirect(
    `/login?error=${encodeURIComponent(
      result?.message || "Invalid email or password"
    )}`
  );
};

export const registerAction = async (formData: FormData) => {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const role = formData.get("role") || "TENANT";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/auth/register`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
      cache: "no-store",
    }
  );
  const result = await res.json();

  if (result.success) {
    redirect("/login?registered=true");
  }

  redirect(
    `/register?error=${encodeURIComponent(
      result?.message || "Registration failed"
    )}`
  );
};
