"use server";

import type { TApiResponse, TCategory } from "@/lib/types";

export const getCategories = async () => {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/categories`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    const result = await res.json();
    return result as TApiResponse<TCategory[]>;
  } catch {
    return {
      success: false,
      statusCode: 500,
      message: "Failed to fetch categories",
      data: [],
    } as TApiResponse<TCategory[]>;
  }
};
