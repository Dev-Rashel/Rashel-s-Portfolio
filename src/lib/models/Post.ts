import { Schema } from "mongoose";
import { model } from "./shared";

export interface IPost {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  gallery: string[];
  category: string;
  tags: string[];
  publishedAt: Date | null;
  draft: boolean;
  published: boolean;
  featured: boolean;
  readingTime: number;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const postSchema = new Schema<IPost>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    gallery: { type: [String], default: [] },
    category: { type: String, default: "Technical Blog", index: true },
    tags: { type: [String], default: [], index: true },
    publishedAt: { type: Date, default: null, index: true },
    draft: { type: Boolean, default: true, index: true },
    published: { type: Boolean, default: false, index: true },
    featured: { type: Boolean, default: false, index: true },
    readingTime: { type: Number, default: 1 },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    seoKeywords: { type: [String], default: [] },
  },
  { timestamps: true }
);

postSchema.index({ title: "text", excerpt: "text", tags: "text" });

export const Post = model<IPost>("Post", postSchema);
