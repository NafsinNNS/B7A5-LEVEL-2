"use server";

import { cookies } from "next/headers";
import type { TApiResponse, TUser } from "@/lib/types";

export const getMe = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return {
      success: false,
      statusCode: 401,
      message: "No access token found",
      data: null,
    } as TApiResponse<TUser | null>;
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/auth/me`, {
      headers: { Cookie: `accessToken=${accessToken}` },
      cache: "no-store",
    });
    const result = await res.json();
    return result as TApiResponse<TUser | null>;
  } catch {
    return {
      success: false,
      statusCode: 500,
      message: "Failed to fetch user",
      data: null,
    } as TApiResponse<TUser | null>;
  }
};
