"use client";

import type { AdminField } from "@/lib/admin-fields";
import { SingletonForm, type SingletonGroup } from "@/components/admin/singleton-form";

const SETTINGS_ENDPOINT = "/api/admin/settings";

const SEARCH_FIELDS: AdminField[] = [
  { name: "seo.defaultTitle", label: "Default title", type: "text", colSpan: 2, placeholder: "Rashel Mahmud — Full-Stack Developer" },
  { name: "seo.titleTemplate", label: "Title template", type: "text", colSpan: 2, help: "Use %s where the page title should appear.", placeholder: "%s — Rashel Mahmud" },
  {
    name: "seo.defaultDescription",
    label: "Default description",
    type: "textarea",
    rows: 4,
    colSpan: 2,
    help: "Aim for 140–160 characters. This is the fallback description across the site.",
  },
  { name: "seo.ogImage", label: "Social share image", type: "image", colSpan: 2, folder: "seo", help: "1200 × 630 works best for Open Graph and Twitter cards." },
];

const INDEX_FIELDS: AdminField[] = [
  { name: "seo.twitterHandle", label: "X / Twitter handle", type: "text", placeholder: "@yourhandle" },
  {
    name: "seo.robots",
    label: "Robots directive",
    type: "select",
    options: [
      { label: "Index, follow", value: "index, follow" },
      { label: "Index, nofollow", value: "index, nofollow" },
      { label: "No index, follow", value: "noindex, follow" },
      { label: "No index, nofollow", value: "noindex, nofollow" },
    ],
  },
  { name: "seo.googleVerification", label: "Google verification code", type: "text", colSpan: 2, help: "Paste only the content value from the verification meta tag." },
];

const GROUPS: SingletonGroup[] = [
  {
    title: "Search metadata",
    description: "How your work appears in search results and social previews.",
    endpoint: SETTINGS_ENDPOINT,
    fields: SEARCH_FIELDS,
  },
  {
    title: "Indexing & verification",
    description: "Control crawlers and verify ownership of the domain.",
    endpoint: SETTINGS_ENDPOINT,
    fields: INDEX_FIELDS,
  },
];

export default function SeoPage() {
  return (
    <SingletonForm
      endpoint={SETTINGS_ENDPOINT}
      eyebrow="Website"
      title="SEO"
      description="How the world discovers your work — titles, descriptions, sharing cards, and crawler behaviour."
      groups={GROUPS}
    />
  );
}
