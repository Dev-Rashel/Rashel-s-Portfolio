import { Schema } from "mongoose";
import { model } from "./shared";

export interface IProject {
  _id?: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  thumbnail: string;
  gallery: string[];
  githubUrl: string;
  liveUrl: string;
  techStack: string[];
  category: string;
  features: string[];
  challenges: string;
  role: string;
  year: string;
  featured: boolean;
  order: number;
  published: boolean;
  seoTitle: string;
  seoDescription: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const projectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    summary: { type: String, default: "" },
    content: { type: String, default: "" },
    thumbnail: { type: String, default: "" },
    gallery: { type: [String], default: [] },
    githubUrl: { type: String, default: "" },
    liveUrl: { type: String, default: "" },
    techStack: { type: [String], default: [] },
    category: { type: String, default: "Full-Stack", index: true },
    features: { type: [String], default: [] },
    challenges: { type: String, default: "" },
    role: { type: String, default: "Full-Stack Developer" },
    year: { type: String, default: () => String(new Date().getFullYear()) },
    featured: { type: Boolean, default: false, index: true },
    order: { type: Number, default: 0, index: true },
    published: { type: Boolean, default: false, index: true },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Project = model<IProject>("Project", projectSchema);
