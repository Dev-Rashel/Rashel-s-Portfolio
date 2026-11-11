import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/data";
import { absoluteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  let noIndex = false;

  try {
    const settings = await getSiteSettings();
    noIndex = settings.seo.robots.toLowerCase().includes("noindex");
  } catch {
    // Fall back to an indexable site when the database is unreachable.
  }

  if (noIndex) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
      sitemap: absoluteUrl("/sitemap.xml"),
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl(),
  };
}
