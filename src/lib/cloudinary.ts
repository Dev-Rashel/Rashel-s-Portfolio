import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export type CloudinaryUploadResult = {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  resource_type: string;
  width?: number;
  height?: number;
  bytes: number;
  original_filename?: string;
};

export function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

export async function uploadBuffer(
  buffer: Buffer,
  options: { folder?: string; resourceType?: "image" | "raw" | "video" | "auto"; filename?: string } = {}
): Promise<CloudinaryUploadResult> {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary credentials are not configured.");
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || "portfolio",
        resource_type: options.resourceType || "image",
        use_filename: true,
        unique_filename: true,
        filename_override: options.filename,
        overwrite: false,
      },
      (error, result) => {
        if (error || !result) return reject(error || new Error("Upload failed."));
        resolve(result as CloudinaryUploadResult);
      }
    );
    stream.end(buffer);
  });
}

export async function destroyAsset(publicId: string, resourceType: "image" | "raw" | "video" = "image") {
  if (!isCloudinaryConfigured()) return;
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}

export async function generateSignature(params: Record<string, string | number>) {
  if (!process.env.CLOUDINARY_API_SECRET) throw new Error("Cloudinary is not configured.");
  return cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET);
}

export { cloudinary };
