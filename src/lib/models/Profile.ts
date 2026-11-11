import { Schema } from "mongoose";
import {
  CTA,
  Resume,
  Stat,
  SocialLink,
  ctaSchema,
  model,
  resumeSchema,
  socialLinkSchema,
  statSchema,
} from "./shared";

export type CTAButtons = {
  projects: CTA;
  contact: CTA;
  resume: CTA;
};

export interface IProfile {
  _id?: string;
  key: string;
  fullName: string;
  designation: string;
  tagline: string;
  heroIntro: string;
  shortBio: string;
  aboutBio: string;
  journey: string;
  goals: string;
  educationSummary: string;
  interests: string[];
  achievements: string[];
  profileImage: string;
  heroImage: string;
  aboutImage: string;
  signatureImage?: string;
  location: string;
  email: string;
  phone: string;
  availability: string;
  available: boolean;
  resume: Resume;
  socials: SocialLink[];
  stats: Stat[];
  ctas: CTAButtons;
  createdAt?: Date;
  updatedAt?: Date;
}

const ctaButtonsSchema = new Schema<CTAButtons>(
  {
    projects: { type: ctaSchema, default: () => ({ label: "View projects", url: "/#projects", enabled: true }) },
    contact: { type: ctaSchema, default: () => ({ label: "Start a conversation", url: "/#contact", enabled: true }) },
    resume: { type: ctaSchema, default: () => ({ label: "Download résumé", url: "", enabled: true }) },
  },
  { _id: false }
);

const profileSchema = new Schema<IProfile>(
  {
    key: { type: String, unique: true, default: "main" },
    fullName: { type: String, default: "Rashel Mahmud", trim: true },
    designation: { type: String, default: "Junior Full-Stack Developer", trim: true },
    tagline: { type: String, default: "Engineering quiet details into bold digital experiences." },
    heroIntro: {
      type: String,
      default:
        "A junior full-stack developer crafting thoughtful, high-performance products from the database to the last pixel.",
    },
    shortBio: {
      type: String,
      default:
        "I build accessible, expressive web experiences with modern JavaScript, careful architecture, and an obsession with the details.",
    },
    aboutBio: {
      type: String,
      default:
        "I am a full-stack developer at the beginning of a long, deliberate journey. I enjoy the space where clean engineering meets considered design — where a product feels as good as it works.\n\nMy work focuses on the MERN ecosystem, with a growing love for interaction design, motion, and the small details that turn a functional interface into a memorable one.",
    },
    journey: {
      type: String,
      default:
        "My journey began with curiosity about how the web works. That curiosity became late nights building interfaces, then APIs, then complete products. Today I am sharpening my craft through real projects, collaboration, and an appetite for problems worth solving.",
    },
    goals: {
      type: String,
      default:
        "To grow into an engineer who can own a product end-to-end — with the technical depth to build it, the design sensitivity to shape it, and the discipline to ship it well.",
    },
    educationSummary: {
      type: String,
      default: "Computer Science & Engineering — Diploma / ongoing studies. Add your education through the dashboard.",
    },
    interests: { type: [String], default: ["Interface design", "Motion systems", "Open source", "Product thinking"] },
    achievements: { type: [String], default: [] },
    profileImage: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=85",
    },
    heroImage: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1200&q=85",
    },
    aboutImage: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=85",
    },
    signatureImage: { type: String, default: "" },
    location: { type: String, default: "Dhaka, Bangladesh" },
    email: { type: String, default: "hello@rashelmahmud.dev" },
    phone: { type: String, default: "" },
    availability: { type: String, default: "Open for junior roles & freelance" },
    available: { type: Boolean, default: true },
    resume: { type: resumeSchema, default: () => ({}) },
    socials: {
      type: [socialLinkSchema],
      default: () => [
        { platform: "github", label: "GitHub", url: "https://github.com/", icon: "github", order: 0, visible: true },
        { platform: "linkedin", label: "LinkedIn", url: "https://linkedin.com/", icon: "linkedin", order: 1, visible: true },
        { platform: "x", label: "X / Twitter", url: "https://x.com/", icon: "twitter", order: 2, visible: true },
      ],
    },
    stats: {
      type: [statSchema],
      default: () => [
        { value: "12", suffix: "+", label: "Projects built" },
        { value: "2", suffix: "+", label: "Years learning" },
        { value: "18", suffix: "", label: "Technologies" },
      ],
    },
    ctas: { type: ctaButtonsSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export const Profile = model<IProfile>("Profile", profileSchema);
