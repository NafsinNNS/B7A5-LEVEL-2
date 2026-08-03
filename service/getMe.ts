"use server";

import { cookies } from "next/headers";
import { refreshAccessToken } from "./refresh";
import type { TApiResponse, TUser } from "@/lib/types";

const fetchMe = async (accessToken: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/auth/me`,
    {
      headers: { Cookie: `accessToken=${accessToken}` },
      cache: "no-store",
    }
  );
  const result = await res.json();
  return {
    ...result,
    data: result?.data?.myUser ?? null,
  } as TApiResponse<TUser | null>;
};

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
    const result = await fetchMe(accessToken);

    if (result?.statusCode === 401) {
      const freshToken = await refreshAccessToken();
      if (freshToken) {
        return fetchMe(freshToken);
      }
    }

    return result;
  } catch {
    return {
      success: false,
      statusCode: 500,
      message: "Failed to fetch user",
      data: null,
    } as TApiResponse<TUser | null>;
  }
};
