import { Schema } from "mongoose";
import { FooterLink, NavItem, footerLinkSchema, model, navItemSchema } from "./shared";

export type Sections = {
  about: boolean;
  skills: boolean;
  projects: boolean;
  experience: boolean;
  activities: boolean;
  blog: boolean;
  contact: boolean;
};

export type SectionOrder = keyof Sections;

export type SectionCopy = {
  eyebrow: string;
  title: string;
  description: string;
};

const sectionCopySchema = new Schema<SectionCopy>(
  {
    eyebrow: { type: String, default: "" },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { _id: false }
);

const sectionCopyDefaults = {
  about: {
    eyebrow: "01 — The person",
    title: "Curiosity, compiled into craft.",
    description: "A developer with an editor’s eye and an engineer’s discipline.",
  },
  skills: {
    eyebrow: "02 — Capabilities",
    title: "A toolkit built for the whole stack.",
    description: "From data models to motion design — the tools I reach for.",
  },
  projects: {
    eyebrow: "03 — Selected work",
    title: "Work that rewards a closer look.",
    description: "A collection of products, experiments, and problems solved with care.",
  },
  experience: {
    eyebrow: "04 — Timeline",
    title: "The path, so far.",
    description: "Education, experience, and the milestones between.",
  },
  activities: {
    eyebrow: "05 — Beyond code",
    title: "A wider view of the work.",
    description: "Community, competitions, workshops, and the moments that shape a craft.",
  },
  blog: {
    eyebrow: "06 — Journal",
    title: "Notes from the build.",
    description: "Writing about code, process, and the learning in between.",
  },
  contact: {
    eyebrow: "07 — Next chapter",
    title: "Let’s make something worth remembering.",
    description: "Have a role, a product, or a good problem? I’d love to hear about it.",
  },
};

export interface ISiteSettings {
  _id?: string;
  key: string;
  siteName: string;
  logo: string;
  logoMark: string;
  favicon: string;
  siteTitle: string;
  siteDescription: string;
  keywords: string[];
  colors: {
    accent: string;
    accentSoft: string;
    background: string;
    surface: string;
    foreground: string;
  };
  defaultTheme: "dark" | "light" | "system";
  navItems: NavItem[];
  sectionVisibility: Sections;
  sectionOrder: SectionOrder[];
  sectionCopy: Record<keyof Sections, SectionCopy>;
  footer: {
    tagline: string;
    copyright: string;
    links: FooterLink[];
    showSocials: boolean;
    bigText: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
    mapUrl: string;
    formTitle: string;
    formDescription: string;
    successMessage: string;
  };
  seo: {
    titleTemplate: string;
    defaultTitle: string;
    defaultDescription: string;
    ogImage: string;
    twitterHandle: string;
    robots: string;
    googleVerification: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const sectionsSchema = new Schema<Sections>(
  {
    about: { type: Boolean, default: true },
    skills: { type: Boolean, default: true },
    projects: { type: Boolean, default: true },
    experience: { type: Boolean, default: true },
    activities: { type: Boolean, default: true },
    blog: { type: Boolean, default: true },
    contact: { type: Boolean, default: true },
  },
  { _id: false }
);

const footerSchema = new Schema(
  {
    tagline: { type: String, default: "Designed and engineered with intention." },
    copyright: { type: String, default: "Rashel Mahmud" },
    links: { type: [footerLinkSchema], default: () => [] },
    showSocials: { type: Boolean, default: true },
    bigText: { type: String, default: "Let's make something matter." },
  },
  { _id: false }
);

const contactSchema = new Schema(
  {
    email: { type: String, default: "hello@rashelmahmud.dev" },
    phone: { type: String, default: "" },
    address: { type: String, default: "Dhaka, Bangladesh" },
    mapUrl: { type: String, default: "" },
    formTitle: { type: String, default: "Tell me about the idea." },
    formDescription: {
      type: String,
      default: "A role, a product, a collaboration — my inbox is open. I usually reply within 48 hours.",
    },
    successMessage: { type: String, default: "Message received. I’ll be in touch soon." },
  },
  { _id: false }
);

const seoSchema = new Schema(
  {
    titleTemplate: { type: String, default: "%s — Rashel Mahmud" },
    defaultTitle: { type: String, default: "Rashel Mahmud — Full-Stack Developer" },
    defaultDescription: {
      type: String,
      default: "The portfolio and digital garden of Rashel Mahmud, a junior full-stack developer building thoughtful web experiences.",
    },
    ogImage: { type: String, default: "" },
    twitterHandle: { type: String, default: "@rashelbuilds" },
    robots: { type: String, default: "index, follow" },
    googleVerification: { type: String, default: "" },
  },
  { _id: false }
);

const siteSettingsSchema = new Schema<ISiteSettings>(
  {
    key: { type: String, unique: true, default: "main" },
    siteName: { type: String, default: "Rashel Mahmud" },
    logo: { type: String, default: "" },
    logoMark: { type: String, default: "RM" },
    favicon: { type: String, default: "/favicon.svg" },
    siteTitle: { type: String, default: "Full-Stack Developer" },
    siteDescription: {
      type: String,
      default: "A cinematic portfolio and digital garden by Rashel Mahmud.",
    },
    keywords: {
      type: [String],
      default: ["full-stack developer", "react", "next.js", "node.js", "portfolio", "bangladesh"],
    },
    colors: {
      accent: { type: String, default: "#b794f6" },
      accentSoft: { type: String, default: "#eadcff" },
      background: { type: String, default: "#0b0817" },
      surface: { type: String, default: "#151027" },
      foreground: { type: String, default: "#f4f0fc" },
    },
    defaultTheme: { type: String, enum: ["dark", "light", "system"], default: "dark" },
    navItems: {
      type: [navItemSchema],
      default: () => [
        { label: "Home", href: "/", order: 0, visible: true },
        { label: "About", href: "/#about", order: 1, visible: true },
        { label: "Skills", href: "/#skills", order: 2, visible: true },
        { label: "Projects", href: "/#projects", order: 3, visible: true },
        { label: "Experience", href: "/#experience", order: 4, visible: true },
        { label: "Activities", href: "/#activities", order: 5, visible: true },
        { label: "Journal", href: "/blog", order: 6, visible: true },
        { label: "Contact", href: "/#contact", order: 7, visible: true },
      ],
    },
    sectionVisibility: { type: sectionsSchema, default: () => ({}) },
    sectionOrder: {
      type: [String],
      default: ["about", "skills", "projects", "experience", "activities", "blog", "contact"],
    },
    sectionCopy: {
      type: new Schema(
        {
          about: { type: sectionCopySchema, default: () => sectionCopyDefaults.about },
          skills: { type: sectionCopySchema, default: () => sectionCopyDefaults.skills },
          projects: { type: sectionCopySchema, default: () => sectionCopyDefaults.projects },
          experience: { type: sectionCopySchema, default: () => sectionCopyDefaults.experience },
          activities: { type: sectionCopySchema, default: () => sectionCopyDefaults.activities },
          blog: { type: sectionCopySchema, default: () => sectionCopyDefaults.blog },
          contact: { type: sectionCopySchema, default: () => sectionCopyDefaults.contact },
        },
        { _id: false }
      ),
      default: () => sectionCopyDefaults,
    },
    footer: { type: footerSchema, default: () => ({}) },
    contact: { type: contactSchema, default: () => ({}) },
    seo: { type: seoSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export const SiteSettings = model<ISiteSettings>("SiteSettings", siteSettingsSchema);
