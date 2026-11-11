"use client";

import type { AdminField } from "@/lib/admin-fields";
import { SingletonForm, type SingletonGroup } from "@/components/admin/singleton-form";

const SETTINGS_ENDPOINT = "/api/admin/settings";

const PALETTE_FIELDS: AdminField[] = [
  { name: "colors.accent", label: "Accent", type: "color", defaultValue: "#ff7a6b", help: "Links, highlights, and the primary button." },
  { name: "colors.accentSoft", label: "Accent soft", type: "color", defaultValue: "#ffc4ad", help: "Italic display type and quiet emphasis." },
  { name: "colors.background", label: "Background", type: "color", defaultValue: "#0b0714" },
  { name: "colors.surface", label: "Surface", type: "color", defaultValue: "#171024" },
  { name: "colors.foreground", label: "Foreground", type: "color", defaultValue: "#f6f1ff" },
];

const BRAND_FIELDS: AdminField[] = [
  {
    name: "defaultTheme",
    label: "Default theme",
    type: "select",
    options: [
      { label: "Dark", value: "dark" },
      { label: "Light", value: "light" },
      { label: "Match system", value: "system" },
    ],
    help: "Visitors can still switch themes; this is the first impression.",
  },
  { name: "logoMark", label: "Monogram", type: "text", placeholder: "RM", help: "Up to four characters." },
  { name: "favicon", label: "Favicon path or URL", type: "text", placeholder: "/favicon.svg" },
  { name: "logo", label: "Logo image", type: "image", colSpan: 2, folder: "branding", help: "Optional. The monogram is used when no logo is set." },
];

const GROUPS: SingletonGroup[] = [
  {
    title: "Palette",
    description: "Set the visual temperature. Changes apply across the public site immediately.",
    endpoint: SETTINGS_ENDPOINT,
    fields: PALETTE_FIELDS,
  },
  {
    title: "Brand & default theme",
    description: "The mark, the favicon, and the theme a first-time visitor sees.",
    endpoint: SETTINGS_ENDPOINT,
    fields: BRAND_FIELDS,
  },
];

export default function ThemePage() {
  return (
    <SingletonForm
      endpoint={SETTINGS_ENDPOINT}
      eyebrow="Website"
      title="Theme & appearance"
      description="Set the visual temperature — palette, branding, and the default experience."
      groups={GROUPS}
      saveLabel="Apply theme"
    />
  );
}
