import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Media } from "@/lib/models/Media";
import { destroyAsset, isCloudinaryConfigured, uploadBuffer } from "@/lib/cloudinary";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { toPlain } from "@/lib/utils";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
const FILE_TYPES = ["application/pdf"];
const MAX_BYTES = 8 * 1024 * 1024;

function safeFolder(value: string | null) {
  return (value || "portfolio")
    .toLowerCase()
    .replace(/[^a-z0-9/_-]/g, "")
    .replace(/\.\./g, "")
    .replace(/^\/+|\/+$/g, "")
    .slice(0, 60) || "portfolio";
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  try {
    if (!isCloudinaryConfigured()) {
      return NextResponse.json(
        { error: "Cloudinary is not configured. Add the CLOUDINARY_* environment variables." },
        { status: 503 }
      );
    }

    const limit = rateLimit(clientKey(request, "upload"), 30, 60_000);
    if (!limit.success) {
      return NextResponse.json({ error: "Too many uploads. Please wait a moment." }, { status: 429 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const folder = safeFolder(formData.get("folder") as string | null);

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file was provided." }, { status: 400 });
    }
    if (file.size === 0) {
      return NextResponse.json({ error: "The file is empty." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Files must be smaller than 8 MB." }, { status: 413 });
    }

    const isImage = IMAGE_TYPES.includes(file.type);
    const isFile = FILE_TYPES.includes(file.type);
    if (!isImage && !isFile) {
      return NextResponse.json(
        { error: "Unsupported file type. Upload a JPG, PNG, WebP, AVIF, GIF, or PDF." },
        { status: 415 }
      );
    }

    const extension = file.name.split(".").pop()?.toLowerCase() || "";
    if (isImage && !["jpg", "jpeg", "png", "webp", "avif", "gif"].includes(extension)) {
      return NextResponse.json({ error: "The file extension does not match an allowed image type." }, { status: 415 });
    }
    if (isFile && extension !== "pdf") {
      return NextResponse.json({ error: "Resume uploads must be PDF files." }, { status: 415 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadBuffer(buffer, {
      folder: `portfolio/${folder}`,
      resourceType: isFile ? "raw" : "image",
      filename: file.name.replace(/\.[^.]+$/, "").slice(0, 80),
    });

    await connectDB();
    const media = await Media.create({
      publicId: result.public_id,
      url: result.url,
      secureUrl: result.secure_url,
      type: isFile ? "raw" : result.resource_type,
      format: result.format,
      name: file.name,
      width: result.width || 0,
      height: result.height || 0,
      bytes: result.bytes,
      alt: "",
      folder,
    });

    return NextResponse.json({
      data: toPlain(media.toObject()),
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
    });
  } catch (error) {
    console.error("[upload]", error);
    return NextResponse.json({ error: "The upload failed. Please try again." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  try {
    const url = new URL(request.url);
    const publicId = url.searchParams.get("publicId");
    if (!publicId) return NextResponse.json({ error: "A public id is required." }, { status: 400 });
    await destroyAsset(publicId);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Could not remove the asset." }, { status: 500 });
  }
}
