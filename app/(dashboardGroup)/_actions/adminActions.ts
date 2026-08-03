"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import type { TApiResponse, TProperty, TUser } from "@/lib/types";

const getAuthHeaders = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  return accessToken ? { Cookie: `accessToken=${accessToken}` } : null;
};

export const getAllUsers = async () => {
  const headers = await getAuthHeaders();
  if (!headers) {
    return {
      success: false,
      statusCode: 401,
      message: "Not authenticated",
      data: [],
    } as TApiResponse<TUser[]>;
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/admin/users`,
      { headers, cache: "no-store" }
    );
    const result = await res.json();
    return result as TApiResponse<TUser[]>;
  } catch {
    return {
      success: false,
      statusCode: 500,
      message: "Failed to fetch users",
      data: [],
    } as TApiResponse<TUser[]>;
  }
};

export const updateUserStatus = async (
  userId: string,
  status: TUser["activeStatus"]
) => {
  const headers = await getAuthHeaders();
  if (!headers) {
    return {
      success: false,
      statusCode: 401,
      message: "Not authenticated",
      data: null,
    } as TApiResponse<TUser | null>;
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/admin/users/${userId}`,
      {
        method: "PATCH",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
        cache: "no-store",
      }
    );
    const result = await res.json();
    revalidateTag("admin-users", "max");
    return result as TApiResponse<TUser>;
  } catch {
    return {
      success: false,
      statusCode: 500,
      message: "Failed to update user status",
      data: null,
    } as TApiResponse<TUser | null>;
  }
};

export const getAllProperties = async () => {
  const headers = await getAuthHeaders();
  if (!headers) {
    return {
      success: false,
      statusCode: 401,
      message: "Not authenticated",
      data: [],
    } as TApiResponse<TProperty[]>;
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/admin/properties`,
      { headers, cache: "no-store" }
    );
    const result = await res.json();
    return result as TApiResponse<TProperty[]>;
  } catch {
    return {
      success: false,
      statusCode: 500,
      message: "Failed to fetch properties",
      data: [],
    } as TApiResponse<TProperty[]>;
  }
};
