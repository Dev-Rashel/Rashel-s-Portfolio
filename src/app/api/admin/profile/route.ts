import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Profile } from "@/lib/models/Profile";
import { profileUpdateSchema } from "@/lib/validators";
import { defaultProfile } from "@/lib/defaults";
import { mergeDeep } from "@/lib/data";
import { pickPresentValues, toPlain } from "@/lib/utils";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  try {
    await connectDB();
    const doc = await Profile.findOne({ key: "main" }).lean();
    return NextResponse.json({ data: mergeDeep(defaultProfile, doc ? toPlain(doc) : null) });
  } catch (error) {
    console.error("[admin-profile-get]", error);
    return NextResponse.json({ error: "Could not load the profile." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  try {
    await connectDB();
    const body = await request.json().catch(() => null);
    const parsed = profileUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Validation failed.", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const existing = await Profile.findOne({ key: "main" }).lean();
    const updates = pickPresentValues(parsed.data, body);
    const merged = mergeDeep(existing ? toPlain(existing) : defaultProfile, updates) as Record<string, unknown>;
    delete merged._id;
    delete merged.__v;
    delete merged.createdAt;
    delete merged.updatedAt;
    merged.key = "main";

    const doc = await Profile.findOneAndUpdate(
      { key: "main" },
      { $set: merged },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    ).lean();

    revalidatePath("/", "layout");
    return NextResponse.json({ data: toPlain(doc) });
  } catch (error) {
    console.error("[admin-profile-put]", error);
    return NextResponse.json({ error: "Could not save the profile." }, { status: 500 });
  }
}
