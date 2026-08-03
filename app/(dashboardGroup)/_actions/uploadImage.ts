"use server";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const uploadImage = async (
  dataUrl: string
): Promise<
  | { success: true; url: string }
  | { success: false; message: string }
> => {
  if (!dataUrl || !dataUrl.startsWith("data:image")) {
    return { success: false, message: "Please select a valid image file." };
  }

  const base64 = dataUrl.split(",")[1] || "";
  if (!base64) {
    return { success: false, message: "Please select a valid image file." };
  }

  const estimatedBytes = Math.floor((base64.length * 3) / 4);
  if (estimatedBytes > MAX_FILE_SIZE) {
    return { success: false, message: "Image must be under 5MB." };
  }

  try {
    const result = await cloudinary.uploader.upload(dataUrl, {
      folder: "rent-nest",
      resource_type: "image",
    });
    return { success: true, url: result.secure_url };
  } catch {
    return {
      success: false,
      message: "Image upload failed. Please try again.",
    };
  }
};
