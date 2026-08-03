"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import type { TApiResponse, TProperty, TRentalRequest } from "@/lib/types";

const getAuthHeaders = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  return accessToken ? { Cookie: `accessToken=${accessToken}` } : null;
};

export const getLandlordProperties = async () => {
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
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/landlord/properties`,
      { headers, cache: "no-store" }
    );
    const result = await res.json();
    return result as TApiResponse<TProperty[]>;
  } catch {
    return {
      success: false,
      statusCode: 500,
      message: "Failed to fetch your properties",
      data: [],
    } as TApiResponse<TProperty[]>;
  }
};

export const createLandlordProperty = async (payload: {
  title: string;
  description: string;
  price: number;
  location: string;
  categoryName?: string;
  amenities?: string[];
  imageUrl?: string;
}) => {
  const headers = await getAuthHeaders();
  if (!headers) {
    return {
      success: false,
      statusCode: 401,
      message: "Not authenticated",
      data: null,
    } as TApiResponse<TProperty | null>;
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/landlord/properties`,
      {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      }
    );
    const result = await res.json();
    revalidateTag("landlord-properties", "max");
    return result as TApiResponse<TProperty>;
  } catch {
    return {
      success: false,
      statusCode: 500,
      message: "Failed to create property",
      data: null,
    } as TApiResponse<TProperty | null>;
  }
};

export const updateLandlordProperty = async (
  propertyId: string,
  payload: {
    title?: string;
    description?: string;
    price?: number;
    location?: string;
    categoryName?: string;
    amenities?: string[];
    imageUrl?: string;
  }
) => {
  const headers = await getAuthHeaders();
  if (!headers) {
    return {
      success: false,
      statusCode: 401,
      message: "Not authenticated",
      data: null,
    } as TApiResponse<TProperty | null>;
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/landlord/properties/${propertyId}`,
      {
        method: "PUT",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      }
    );
    const result = await res.json();
    revalidateTag("landlord-properties", "max");
    return result as TApiResponse<TProperty>;
  } catch {
    return {
      success: false,
      statusCode: 500,
      message: "Failed to update property",
      data: null,
    } as TApiResponse<TProperty | null>;
  }
};

export const deleteLandlordProperty = async (propertyId: string) => {
  const headers = await getAuthHeaders();
  if (!headers) {
    return {
      success: false,
      statusCode: 401,
      message: "Not authenticated",
      data: null,
    } as TApiResponse<TProperty | null>;
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/landlord/properties/${propertyId}`,
      { method: "DELETE", headers, cache: "no-store" }
    );
    const result = await res.json();
    revalidateTag("landlord-properties", "max");
    return result as TApiResponse<TProperty>;
  } catch {
    return {
      success: false,
      statusCode: 500,
      message: "Failed to delete property",
      data: null,
    } as TApiResponse<TProperty | null>;
  }
};

export const getLandlordRequests = async () => {
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
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/landlord/requests`,
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

export const updateRequestStatus = async (
  requestId: string,
  status: TRentalRequest["approveStatus"]
) => {
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
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/landlord/requests/${requestId}`,
      {
        method: "PATCH",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
        cache: "no-store",
      }
    );
    const result = await res.json();
    revalidateTag("landlord-requests", "max");
    return result as TApiResponse<TRentalRequest>;
  } catch {
    return {
      success: false,
      statusCode: 500,
      message: "Failed to update request status",
      data: null,
    } as TApiResponse<TRentalRequest | null>;
  }
};