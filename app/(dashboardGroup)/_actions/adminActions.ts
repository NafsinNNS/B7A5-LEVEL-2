"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import type {
  TApiResponse,
  TCategory,
  TPaginationMeta,
  TProperty,
  TRentalRequest,
  TUser,
} from "@/lib/types";

const getAuthHeaders = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  return accessToken ? { Cookie: `accessToken=${accessToken}` } : null;
};

export type GetAdminUsersParams = {
  searchTerm?: string;
  page?: number;
  limit?: number;
};

export type TAdminUsersData = {
  users: TUser[];
  meta: TPaginationMeta;
};

export const getAdminUsers = async (params: GetAdminUsersParams = {}) => {
  const headers = await getAuthHeaders();
  if (!headers) {
    return {
      success: false,
      statusCode: 401,
      message: "Not authenticated",
      data: { users: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0 } },
    } as TApiResponse<TAdminUsersData>;
  }

  const searchParams = new URLSearchParams();
  if (params.searchTerm) searchParams.set("searchTerm", params.searchTerm);
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/admin/users${
        searchParams.toString() ? `?${searchParams.toString()}` : ""
      }`,
      { headers, cache: "no-store" }
    );
    const result = await res.json();
    return result as TApiResponse<TAdminUsersData>;
  } catch {
    return {
      success: false,
      statusCode: 500,
      message: "Failed to fetch users",
      data: { users: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0 } },
    } as TApiResponse<TAdminUsersData>;
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

export const getAllRentalRequests = async () => {
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
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/admin/rentals`,
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

export const createCategory = async (name: string) => {
  const headers = await getAuthHeaders();
  if (!headers) {
    return {
      success: false,
      statusCode: 401,
      message: "Not authenticated",
      data: null,
    } as TApiResponse<TCategory | null>;
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/admin/create-category`,
      {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
        cache: "no-store",
      }
    );
    const result = await res.json();
    revalidateTag("categories", "max");
    return result as TApiResponse<TCategory>;
  } catch {
    return {
      success: false,
      statusCode: 500,
      message: "Failed to create category",
      data: null,
    } as TApiResponse<TCategory | null>;
  }
};
