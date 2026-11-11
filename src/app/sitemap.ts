import type { MetadataRoute } from "next";
import { getPosts, getProjects } from "@/lib/data";
import { absoluteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/projects"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/blog"), changeFrequency: "weekly", priority: 0.8 },
  ];

  try {
    const [projects, posts] = await Promise.all([getProjects(), getPosts()]);

    return [
      ...base,
      ...projects.map((project) => ({
        url: absoluteUrl(`/projects/${project.slug}`),
        lastModified: project.updatedAt ? new Date(project.updatedAt) : undefined,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
      ...posts.map((post) => ({
        url: absoluteUrl(`/blog/${post.slug}`),
        lastModified: post.updatedAt ? new Date(post.updatedAt) : undefined,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ];
  } catch {
    // Keep the sitemap available even when the database is unreachable.
    return base;
  }
}
