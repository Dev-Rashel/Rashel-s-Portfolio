import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { getResource } from "@/lib/admin-resources";
import { pickPresentValues, readingTime, slugify, toPlain } from "@/lib/utils";

const FILTERABLE = [
  "published",
  "draft",
  "read",
  "archived",
  "type",
  "category",
  "enabled",
  "visible",
  "featured",
  "folder",
];

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizePayload(resource: string, input: Record<string, unknown>, partial = false) {
  const payload: Record<string, unknown> = { ...input };
  delete payload._id;
  delete payload.__v;
  delete payload.createdAt;
  delete payload.updatedAt;

  if (!partial || "slug" in payload) {
    const title = String(payload.title || payload.name || "");
    if (!payload.slug && title) payload.slug = slugify(title);
  }

  if (resource === "posts") {
    if ("publishedAt" in payload) {
      if (payload.publishedAt) {
        const date = new Date(String(payload.publishedAt));
        payload.publishedAt = Number.isNaN(date.getTime()) ? null : date;
      } else {
        payload.publishedAt = null;
      }
    } else if (!partial) {
      payload.publishedAt = null;
    }

    if (payload.draft === true) payload.published = false;
    if (!partial && payload.published === true && !payload.publishedAt) {
      payload.publishedAt = new Date();
    }
    if (payload.published === false && !partial) {
      payload.publishedAt = payload.publishedAt || null;
    }
    if ("content" in payload) {
      payload.readingTime = readingTime(String(payload.content || ""));
    } else if (!partial) {
      payload.readingTime = readingTime("");
    }
  }

  if (resource === "media") {
    delete payload.publicId;
    delete payload.url;
    delete payload.secureUrl;
  }

  if (resource === "messages") {
    delete payload.name;
    delete payload.email;
    delete payload.subject;
    delete payload.message;
  }

  return payload;
}

export async function GET(request: Request, context: { params: Promise<{ resource: string }> }) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  try {
    const { resource } = await context.params;
    const definition = getResource(resource);
    if (!definition) return NextResponse.json({ error: "Unknown resource." }, { status: 404 });

    await connectDB();
    const url = new URL(request.url);
    const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit")) || 20));
    const query = url.searchParams.get("q")?.trim() || "";
    const filter: Record<string, unknown> = {};

    for (const key of FILTERABLE) {
      const value = url.searchParams.get(key);
      if (value === null || value === "") continue;
      if (value === "true" || value === "false") filter[key] = value === "true";
      else filter[key] = value;
    }

    if (query) {
      const regex = new RegExp(escapeRegex(query), "i");
      filter.$or = definition.searchFields.map((field) => ({ [field]: regex }));
    }

    const [items, total] = await Promise.all([
      definition.model
        .find(filter)
        .sort(definition.defaultSort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      definition.model.countDocuments(filter),
    ]);

    return NextResponse.json({
      data: toPlain(items),
      pagination: { page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) },
    });
  } catch (error) {
    console.error("[admin-resource-list]", error);
    return NextResponse.json({ error: "Could not load this collection." }, { status: 500 });
  }
}

export async function POST(request: Request, context: { params: Promise<{ resource: string }> }) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  try {
    const { resource } = await context.params;
    const definition = getResource(resource);
    if (!definition) return NextResponse.json({ error: "Unknown resource." }, { status: 404 });
    if (definition.creatable === false) {
      return NextResponse.json({ error: "This collection cannot be created from the dashboard." }, { status: 405 });
    }

    await connectDB();
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const normalized = normalizePayload(resource, body as Record<string, unknown>);
    const parsed = definition.schema.safeParse(normalized);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Validation failed.", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const created = await definition.model.create(parsed.data);
    return NextResponse.json({ data: toPlain(created.toObject()) }, { status: 201 });
  } catch (error: unknown) {
    const mongoError = error as { code?: number; message?: string };
    if (mongoError.code === 11000) {
      return NextResponse.json({ error: "That slug or unique value is already in use." }, { status: 409 });
    }
    console.error("[admin-resource-create]", error);
    return NextResponse.json({ error: mongoError.message || "Could not create the item." }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ resource: string }> }) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  try {
    const { resource } = await context.params;
    const definition = getResource(resource);
    if (!definition) return NextResponse.json({ error: "Unknown resource." }, { status: 404 });

    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const body = await request.json().catch(() => null);
    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "A valid item id is required." }, { status: 400 });
    }
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    await connectDB();
    const normalized = normalizePayload(resource, body as Record<string, unknown>, true);
    const parsed = definition.schema.partial().safeParse(normalized);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Validation failed." },
        { status: 400 }
      );
    }

    const updates = pickPresentValues(parsed.data, normalized);
    const updated = await definition.model
      .findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true })
      .lean();
    if (!updated) return NextResponse.json({ error: "Item not found." }, { status: 404 });
    return NextResponse.json({ data: toPlain(updated) });
  } catch (error: unknown) {
    const mongoError = error as { code?: number; message?: string };
    if (mongoError.code === 11000) {
      return NextResponse.json({ error: "That slug or unique value is already in use." }, { status: 409 });
    }
    console.error("[admin-resource-update]", error);
    return NextResponse.json({ error: mongoError.message || "Could not update the item." }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ resource: string }> }) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  try {
    const { resource } = await context.params;
    const definition = getResource(resource);
    if (!definition) return NextResponse.json({ error: "Unknown resource." }, { status: 404 });

    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "A valid item id is required." }, { status: 400 });
    }

    await connectDB();
    const deleted = (await definition.model.findByIdAndDelete(id).lean()) as
      | { publicId?: string; type?: string }
      | null;
    if (!deleted) return NextResponse.json({ error: "Item not found." }, { status: 404 });

    if (resource === "media" && deleted.publicId) {
      const { destroyAsset } = await import("@/lib/cloudinary");
      const type = deleted.type === "video" ? "video" : deleted.type === "raw" ? "raw" : "image";
      await destroyAsset(deleted.publicId, type).catch(() => undefined);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[admin-resource-delete]", error);
    return NextResponse.json({ error: "Could not delete the item." }, { status: 500 });
  }
}
