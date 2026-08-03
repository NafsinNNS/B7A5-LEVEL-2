"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { refreshAccessToken } from "@/service/refresh";
import type { TApiResponse, TRentalRequest } from "@/lib/types";

export const createRentalRequest = async (propertyId: string) => {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return {
      success: false,
      statusCode: 401,
      message: "Please log in to send a rental request",
      data: null,
    } as TApiResponse<TRentalRequest | null>;
  }

  const send = async (token: string) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/rentals`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `accessToken=${token}`,
        },
        body: JSON.stringify({ propertyId }),
        cache: "no-store",
      }
    );
    return res.json();
  };

  try {
    let result = await send(accessToken);

    if (result?.statusCode === 401) {
      const freshToken = await refreshAccessToken();
      if (freshToken) {
        result = await send(freshToken);
      }
    }

    revalidateTag("rental-requests", "max");
    return result as TApiResponse<TRentalRequest>;
  } catch {
    return {
      success: false,
      statusCode: 500,
      message: "Failed to send rental request",
      data: null,
    } as TApiResponse<TRentalRequest | null>;
  }
};
