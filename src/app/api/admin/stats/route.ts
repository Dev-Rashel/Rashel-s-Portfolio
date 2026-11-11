import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Skill } from "@/lib/models/Skill";
import { Project } from "@/lib/models/Project";
import { Post } from "@/lib/models/Post";
import { ContactMessage } from "@/lib/models/ContactMessage";
import { Media } from "@/lib/models/Media";
import { Activity } from "@/lib/models/Activity";
import { Certification } from "@/lib/models/Certification";
import { Experience } from "@/lib/models/Experience";
import { Education } from "@/lib/models/Education";
import { Achievement } from "@/lib/models/Achievement";
import { Category } from "@/lib/models/Category";
import { toPlain } from "@/lib/utils";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  try {
    await connectDB();
    const [
      skills,
      projects,
      publishedProjects,
      posts,
      publishedPosts,
      drafts,
      messages,
      unread,
      archived,
      media,
      activities,
      certifications,
      experiences,
      education,
      achievements,
      categories,
      recentMessages,
      recentPosts,
      recentProjects,
      allPosts,
    ] = await Promise.all([
      Skill.countDocuments({}),
      Project.countDocuments({}),
      Project.countDocuments({ published: true }),
      Post.countDocuments({}),
      Post.countDocuments({ published: true, draft: false }),
      Post.countDocuments({ draft: true }),
      ContactMessage.countDocuments({}),
      ContactMessage.countDocuments({ read: false, archived: false }),
      ContactMessage.countDocuments({ archived: true }),
      Media.countDocuments({}),
      Activity.countDocuments({ visible: true }),
      Certification.countDocuments({ visible: true }),
      Experience.countDocuments({ visible: true }),
      Education.countDocuments({ visible: true }),
      Achievement.countDocuments({ visible: true }),
      Category.countDocuments({}),
      ContactMessage.find({ archived: false }).sort({ createdAt: -1 }).limit(5).lean(),
      Post.find({}).sort({ createdAt: -1 }).limit(5).select("title slug published draft createdAt category").lean(),
      Project.find({}).sort({ createdAt: -1 }).limit(5).select("title slug published featured createdAt category").lean(),
      Post.find({}).select("createdAt published").lean(),
    ]);

    const monthKeys: string[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthKeys.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`);
    }
    const timeline = monthKeys.map((key) => ({
      month: key,
      published: allPosts.filter((post) => {
        if (!post.published || !post.createdAt) return false;
        const date = new Date(post.createdAt);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}` === key;
      }).length,
    }));

    return NextResponse.json({
      data: {
        counts: {
          skills,
          projects,
          publishedProjects,
          posts,
          publishedPosts,
          drafts,
          messages,
          unread,
          archived,
          media,
          activities,
          certifications,
          experiences,
          education,
          achievements,
          categories,
        },
        recentMessages: toPlain(recentMessages),
        recentPosts: toPlain(recentPosts),
        recentProjects: toPlain(recentProjects),
        timeline,
      },
    });
  } catch (error) {
    console.error("[admin-stats]", error);
    return NextResponse.json({ error: "Could not load dashboard data." }, { status: 500 });
  }
}
