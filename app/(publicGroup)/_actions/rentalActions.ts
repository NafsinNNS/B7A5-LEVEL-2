"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import type { TApiResponse, TRentalRequest } from "@/lib/types";

export const createRentalRequest = async (propertyId: string) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return {
      success: false,
      statusCode: 401,
      message: "Please log in to send a rental request",
      data: null,
    } as TApiResponse<TRentalRequest | null>;
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/rentals`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `accessToken=${accessToken}`,
        },
        body: JSON.stringify({ propertyId }),
        cache: "no-store",
      }
    );
    const result = await res.json();
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
