"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

export const logout = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  revalidateTag("My-Profile", "max");
  return { success: true, message: "Logged out" };
};
