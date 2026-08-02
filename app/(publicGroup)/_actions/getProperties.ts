"use server";

import type { TApiResponse, TProperty, TPropertyQuery } from "@/lib/types";

export const getProperties = async (query: TPropertyQuery = {}) => {
  const searchParams = new URLSearchParams();
  if (query.searchTerm) searchParams.set("searchTerm", query.searchTerm);
  if (query.title) searchParams.set("title", query.title);
  if (query.price) searchParams.set("price", query.price);
  if (query.maxPrice) searchParams.set("maxPrice", query.maxPrice);
  if (query.location) searchParams.set("location", query.location);
  if (query.categoryName) searchParams.set("categoryName", query.categoryName);
  if (query.sortBy) searchParams.set("sortBy", query.sortBy);
  if (query.sortOrder) searchParams.set("sortOrder", query.sortOrder);

  const queryString = searchParams.toString();
  const url = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/properties${
    queryString ? `?${queryString}` : ""
  }`;

  try {
    const res = await fetch(url, { cache: "no-store" });
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

export const getPropertyById = async (propertyId: string) => {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/properties/${propertyId}`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    const result = await res.json();
    return result as TApiResponse<TProperty>;
  } catch {
    return {
      success: false,
      statusCode: 500,
      message: "Failed to fetch property",
      data: null,
    } as TApiResponse<TProperty | null>;
  }
};
