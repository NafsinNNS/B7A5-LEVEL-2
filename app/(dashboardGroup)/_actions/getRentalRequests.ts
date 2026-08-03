"use server";

import { cookies } from "next/headers";
import type { TApiResponse, TRentalRequest, TReview } from "@/lib/types";

const getAuthHeaders = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  return accessToken ? { Cookie: `accessToken=${accessToken}` } : null;
};

export const getRentalRequests = async () => {
  const headers = await getAuthHeaders();
  if (!headers) {
    return {
      success: false,
      statusCode: 401,
      message: "Not authenticated",
      data: [],
    } as TApiResponse<TRentalRequest[]>;
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/rentals`,
      { headers, cache: "no-store" }
    );
    const result = await res.json();
    return result as TApiResponse<TRentalRequest[]>;
  } catch {
    return {
      success: false,
      statusCode: 500,
      message: "Failed to fetch rental requests",
      data: [],
    } as TApiResponse<TRentalRequest[]>;
  }
};

export const getRentalRequestDetails = async (requestId: string) => {
  const headers = await getAuthHeaders();
  if (!headers) {
    return {
      success: false,
      statusCode: 401,
      message: "Not authenticated",
      data: null,
    } as TApiResponse<TRentalRequest | null>;
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/rentals/${requestId}`,
      { headers, cache: "no-store" }
    );
    const result = await res.json();
    return result as TApiResponse<TRentalRequest>;
  } catch {
    return {
      success: false,
      statusCode: 500,
      message: "Failed to fetch rental request details",
      data: null,
    } as TApiResponse<TRentalRequest | null>;
  }
};

export const createReview = async (
  rentalRequestId: string,
  payload: { rating: number; comment?: string }
) => {
  const headers = await getAuthHeaders();
  if (!headers) {
    return {
      success: false,
      statusCode: 401,
      message: "Not authenticated",
      data: null,
    } as TApiResponse<TReview | null>;
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/reviews/${rentalRequestId}`,
      {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      }
    );
    const result = await res.json();
    return result as TApiResponse<TReview>;
  } catch {
    return {
      success: false,
      statusCode: 500,
      message: "Failed to submit review",
      data: null,
    } as TApiResponse<TReview | null>;
  }
};
