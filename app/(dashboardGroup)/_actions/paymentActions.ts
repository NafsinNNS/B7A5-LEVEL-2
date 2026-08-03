"use server";

import { cookies } from "next/headers";
import type { TApiResponse, TPayment } from "@/lib/types";

const getAuthHeaders = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  return accessToken ? { Cookie: `accessToken=${accessToken}` } : null;
};

export const getMyPayments = async () => {
  const headers = await getAuthHeaders();
  if (!headers) {
    return {
      success: false,
      statusCode: 401,
      message: "Not authenticated",
      data: [],
    } as TApiResponse<TPayment[]>;
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/payments`,
      { headers, cache: "no-store" }
    );
    const result = await res.json();
    return result as TApiResponse<TPayment[]>;
  } catch {
    return {
      success: false,
      statusCode: 500,
      message: "Failed to fetch payments",
      data: [],
    } as TApiResponse<TPayment[]>;
  }
};

export const createPayment = async (rentalRequestId: string) => {
  const headers = await getAuthHeaders();
  if (!headers) {
    return {
      success: false,
      statusCode: 401,
      message: "Not authenticated",
      data: null,
    } as TApiResponse<{ paymentUrl: string } | null>;
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/payments/create/${rentalRequestId}`,
      { method: "POST", headers, cache: "no-store" }
    );
    const result = await res.json();
    return result as TApiResponse<{ paymentUrl: string }>;
  } catch {
    return {
      success: false,
      statusCode: 500,
      message: "Failed to create payment",
      data: null,
    } as TApiResponse<{ paymentUrl: string } | null>;
  }
};
