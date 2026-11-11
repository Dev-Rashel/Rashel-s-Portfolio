import { connectDB } from "@/lib/db";
import { Profile } from "@/lib/models/Profile";
import { SiteSettings } from "@/lib/models/SiteSettings";
import { Skill } from "@/lib/models/Skill";
import { Project } from "@/lib/models/Project";
import { Post } from "@/lib/models/Post";
import { Experience } from "@/lib/models/Experience";
import { Education } from "@/lib/models/Education";
import { Certification } from "@/lib/models/Certification";
import { Activity } from "@/lib/models/Activity";
import { Achievement } from "@/lib/models/Achievement";
import { Category } from "@/lib/models/Category";
import { defaultProfile, defaultSettings } from "@/lib/defaults";
import { toPlain } from "@/lib/utils";

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value) && !(value instanceof Date);
}

export function mergeDeep<T>(base: T, override: unknown): T {
  if (override === undefined || override === null) return base;
  if (Array.isArray(base)) return (Array.isArray(override) ? override : base) as T;
  if (isPlainObject(base) && isPlainObject(override)) {
    const result: Record<string, unknown> = { ...base };
    for (const [key, value] of Object.entries(override)) {
      result[key] = key in result ? mergeDeep(result[key], value) : value;
    }
    return result as T;
  }
  return override as T;
}

export async function getSiteSettings() {
  await connectDB();
  const doc = await SiteSettings.findOne({ key: "main" }).lean();
  const settings = mergeDeep(defaultSettings, doc ? toPlain(doc) : null);
  return {
    ...settings,
    navItems: [...(settings.navItems || [])].sort((a, b) => a.order - b.order).filter((item) => item.visible),
    sectionOrder: (settings.sectionOrder || []).filter((key): key is keyof typeof settings.sectionVisibility =>
      Object.prototype.hasOwnProperty.call(settings.sectionVisibility, key)
    ),
  };
}

export type PublicSettings = Awaited<ReturnType<typeof getSiteSettings>>;

export async function getProfile() {
  await connectDB();
  const doc = await Profile.findOne({ key: "main" }).lean();
  const profile = mergeDeep(defaultProfile, doc ? toPlain(doc) : null);
  return {
    ...profile,
    socials: [...(profile.socials || [])].sort((a, b) => a.order - b.order).filter((social) => social.visible),
    stats: profile.stats || [],
  };
}

export type PublicProfile = Awaited<ReturnType<typeof getProfile>>;

export async function getPublicHomeData() {
  await connectDB();
  const [
    profile,
    settings,
    skills,
    projects,
    posts,
    experiences,
    education,
    certifications,
    activities,
    achievements,
    categories,
  ] = await Promise.all([
    getProfile(),
    getSiteSettings(),
    Skill.find({ enabled: true }).sort({ order: 1, name: 1 }).lean(),
    Project.find({ published: true }).sort({ featured: -1, order: 1, createdAt: -1 }).limit(12).lean(),
    Post.find({ published: true, draft: false }).sort({ featured: -1, publishedAt: -1 }).limit(6).lean(),
    Experience.find({ visible: true }).sort({ order: 1, startDate: -1 }).lean(),
    Education.find({ visible: true }).sort({ order: 1, startDate: -1 }).lean(),
    Certification.find({ visible: true }).sort({ order: 1, issueDate: -1 }).lean(),
    Activity.find({ visible: true }).sort({ featured: -1, order: 1, date: -1 }).lean(),
    Achievement.find({ visible: true }).sort({ order: 1, date: -1 }).lean(),
    Category.find().sort({ order: 1, name: 1 }).lean(),
  ]);

  return {
    profile,
    settings,
    skills: toPlain(skills),
    projects: toPlain(projects),
    posts: toPlain(posts),
    experiences: toPlain(experiences),
    education: toPlain(education),
    certifications: toPlain(certifications),
    activities: toPlain(activities),
    achievements: toPlain(achievements),
    categories: toPlain(categories),
  };
}

export type HomeData = Awaited<ReturnType<typeof getPublicHomeData>>;

export async function getProjects(options: { limit?: number; category?: string } = {}) {
  await connectDB();
  const filter: Record<string, unknown> = { published: true };
  if (options.category) filter.category = options.category;
  const query = Project.find(filter).sort({ featured: -1, order: 1, createdAt: -1 });
  if (options.limit) query.limit(options.limit);
  return toPlain(await query.lean());
}

export async function getProjectBySlug(slug: string) {
  await connectDB();
  const project = await Project.findOne({ slug, published: true }).lean();
  return project ? toPlain(project) : null;
}

export async function getPosts(options: { limit?: number; category?: string; tag?: string; query?: string } = {}) {
  await connectDB();
  const filter: Record<string, unknown> = { published: true, draft: false };
  if (options.category) filter.category = options.category;
  if (options.tag) filter.tags = options.tag;
  if (options.query) {
    filter.$or = [
      { title: { $regex: options.query, $options: "i" } },
      { excerpt: { $regex: options.query, $options: "i" } },
      { tags: { $regex: options.query, $options: "i" } },
    ];
  }
  const query = Post.find(filter).sort({ featured: -1, publishedAt: -1 });
  if (options.limit) query.limit(options.limit);
  return toPlain(await query.lean());
}

export async function getPostBySlug(slug: string) {
  await connectDB();
  const post = await Post.findOne({ slug, published: true, draft: false }).lean();
  return post ? toPlain(post) : null;
}

export async function getRelatedPosts(slug: string, category: string, limit = 3) {
  await connectDB();
  const posts = await Post.find({
    slug: { $ne: slug },
    published: true,
    draft: false,
    ...(category ? { category } : {}),
  })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .lean();
  return toPlain(posts);
}

export async function getActivities() {
  await connectDB();
  return toPlain(await Activity.find({ visible: true }).sort({ featured: -1, order: 1, date: -1 }).lean());
}

export async function getCategories(type?: string) {
  await connectDB();
  const filter = type ? { type } : {};
  return toPlain(await Category.find(filter).sort({ order: 1, name: 1 }).lean());
}
