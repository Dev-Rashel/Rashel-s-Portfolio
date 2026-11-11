/**
 * Idempotent database seed for the portfolio CMS.
 *
 * Usage:
 *   npm run seed        # admin, profile and site settings only
 *   npm run seed:demo   # the above plus placeholder portfolio content
 *   npm run seed -- --reset-admin   # also refresh the admin password from env
 *
 * The script reads .env.local and .env before importing any app modules so the
 * database connection sees the environment variables it needs.
 */

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Model } from "mongoose";

function loadEnvFile(fileName: string) {
  const filePath = resolve(process.cwd(), fileName);
  if (!existsSync(filePath)) return;

  const contents = readFileSync(filePath, "utf8");
  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const match = line.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key] !== undefined) continue;
    let value = rawValue.trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[key] = value.replace(/\\n/g, "\n");
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const args = new Set(process.argv.slice(2));
const demo = args.has("--demo");
const resetAdmin = args.has("--reset-admin");

async function main() {
  if (!process.env.MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not set. Create .env.local from .env.example and add your MongoDB Atlas connection string."
    );
  }

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME?.trim() || "Administrator";

  if (!adminEmail || !adminPassword) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set before seeding the admin account.");
  }
  if (adminPassword.length < 8) {
    throw new Error("ADMIN_PASSWORD must be at least 8 characters long.");
  }

  const [{ connectDB }, { Admin }, { Profile }, { SiteSettings }] = await Promise.all([
    import("../src/lib/db"),
    import("../src/lib/models/Admin"),
    import("../src/lib/models/Profile"),
    import("../src/lib/models/SiteSettings"),
  ]);
  const { defaultProfile, defaultSettings } = await import("../src/lib/defaults");
  const bcrypt = (await import("bcryptjs")).default;

  await connectDB();
  console.log("Connected to MongoDB.");

  // ---------------------------------------------------------------------------
  // Singleton documents
  // ---------------------------------------------------------------------------
  await Profile.updateOne({ key: "main" }, { $setOnInsert: defaultProfile }, { upsert: true });
  await SiteSettings.updateOne({ key: "main" }, { $setOnInsert: defaultSettings }, { upsert: true });
  console.log("Profile and site settings are ready.");

  // ---------------------------------------------------------------------------
  // Admin account
  // ---------------------------------------------------------------------------
  const existingAdmin = await Admin.findOne({ email: adminEmail }).select("+passwordHash").lean();
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await Admin.create({ email: adminEmail, passwordHash, name: adminName, role: "admin" });
    console.log(`Created admin account for ${adminEmail}.`);
  } else if (resetAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await Admin.updateOne({ _id: existingAdmin._id }, { $set: { passwordHash, name: adminName } });
    console.log(`Updated the password for ${adminEmail}.`);
  } else {
    console.log(`Admin ${adminEmail} already exists. Pass --reset-admin to refresh its password.`);
  }

  // ---------------------------------------------------------------------------
  // Placeholder content (demo mode)
  // ---------------------------------------------------------------------------
  if (!demo) {
    console.log("Skipped demo content. Run `npm run seed:demo` to add placeholder portfolio data.");
    return;
  }

  const {
    defaultAchievements,
    defaultActivities,
    defaultCategories,
    defaultCertifications,
    defaultEducation,
    defaultExperience,
    defaultPosts,
    defaultProjects,
    defaultSkills,
  } = await import("../src/lib/defaults");
  const [{ Skill }, { Project }, { Category }, { Post }, { Experience }, { Education }, { Certification }, { Activity }, { Achievement }] =
    await Promise.all([
      import("../src/lib/models/Skill"),
      import("../src/lib/models/Project"),
      import("../src/lib/models/Category"),
      import("../src/lib/models/Post"),
      import("../src/lib/models/Experience"),
      import("../src/lib/models/Education"),
      import("../src/lib/models/Certification"),
      import("../src/lib/models/Activity"),
      import("../src/lib/models/Achievement"),
    ]);

  const results: Record<string, number> = {};

  async function upsertMany<T extends Record<string, unknown>>(
    label: string,
    items: T[],
    filterFor: (item: T) => Record<string, unknown>,
    model: Model<any>
  ) {
    let changed = 0;
    for (const item of items) {
      const result = await model.updateOne(filterFor(item), { $setOnInsert: item }, { upsert: true });
      if (result.upsertedCount) changed += 1;
    }
    results[label] = changed;
  }

  await upsertMany("categories", defaultCategories, (item) => ({ slug: item.slug }), Category);
  await upsertMany("skills", defaultSkills, (item) => ({ name: item.name, category: item.category }), Skill);
  await upsertMany("projects", defaultProjects, (item) => ({ slug: item.slug }), Project);
  await upsertMany("posts", defaultPosts, (item) => ({ slug: item.slug }), Post);
  await upsertMany("experience", defaultExperience, (item) => ({ role: item.role, company: item.company }), Experience);
  await upsertMany("education", defaultEducation, (item) => ({ institution: item.institution, degree: item.degree }), Education);
  await upsertMany("certifications", defaultCertifications, (item) => ({ title: item.title, issuer: item.issuer }), Certification);
  await upsertMany("activities", defaultActivities, (item) => ({ title: item.title, date: item.date }), Activity);
  await upsertMany("achievements", defaultAchievements, (item) => ({ title: item.title }), Achievement);

  console.log("Demo content seeded:");
  for (const [label, count] of Object.entries(results)) {
    console.log(`  ${label}: ${count} new item${count === 1 ? "" : "s"}`);
  }
}

main()
  .then(async () => {
    const mongoose = (await import("mongoose")).default;
    await mongoose.disconnect();
    console.log("Seed complete.");
  })
  .catch(async (error) => {
    console.error("Seed failed:", error instanceof Error ? error.message : error);
    try {
      const mongoose = (await import("mongoose")).default;
      await mongoose.disconnect();
    } catch {
      // Ignore cleanup failures.
    }
    process.exitCode = 1;
  });
