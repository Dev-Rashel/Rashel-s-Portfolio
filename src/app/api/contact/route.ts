import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ContactMessage } from "@/lib/models/ContactMessage";
import { contactSchema } from "@/lib/validators";
import { clientKey, rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const limit = rateLimit(clientKey(request, "contact"), 4, 10 * 60_000);
    if (!limit.success) {
      return NextResponse.json({ error: "Too many messages. Please try again a little later." }, { status: 429 });
    }

    const body = await request.json().catch(() => null);
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Please check the form and try again." },
        { status: 400 }
      );
    }

    if (parsed.data.website) {
      // Honeypot triggered — respond as success without touching the database.
      return NextResponse.json({ success: true });
    }

    await connectDB();
    await ContactMessage.create({
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject,
      message: parsed.data.message,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[contact]", error);
    return NextResponse.json({ error: "The message could not be sent. Please try again." }, { status: 500 });
  }
}
