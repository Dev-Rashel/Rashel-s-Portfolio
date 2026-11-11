import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { Admin } from "@/lib/models/Admin";
import { loginSchema } from "@/lib/validators";
import { createSessionToken, SESSION_COOKIE, SESSION_DURATION } from "@/lib/session-token";
import { clientKey, rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const limit = rateLimit(clientKey(request, "login"), 6, 10 * 60_000);
    if (!limit.success) {
      return NextResponse.json({ error: "Too many attempts. Please wait and try again." }, { status: 429 });
    }

    const body = await request.json().catch(() => null);
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Enter a valid email and password." },
        { status: 400 }
      );
    }

    await connectDB();
    const admin = await Admin.findOne({ email: parsed.data.email.toLowerCase() }).select("+passwordHash").lean();
    if (!admin) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const valid = await bcrypt.compare(parsed.data.password, admin.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    await Admin.updateOne({ _id: admin._id }, { $set: { lastLogin: new Date() } });

    const token = await createSessionToken({
      sub: String(admin._id),
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    const response = NextResponse.json({ success: true, redirect: "/admin/dashboard" });
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_DURATION,
    });
    return response;
  } catch (error) {
    console.error("[admin-login]", error);
    return NextResponse.json({ error: "Sign in is unavailable right now. Please try again." }, { status: 500 });
  }
}
