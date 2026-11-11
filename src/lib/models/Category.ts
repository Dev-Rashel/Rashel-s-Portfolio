import { Schema } from "mongoose";
import { model } from "./shared";

export interface ICategory {
  _id?: string;
  name: string;
  slug: string;
  type: "project" | "post" | "activity" | "certification" | "general";
  description: string;
  color: string;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    type: {
      type: String,
      enum: ["project", "post", "activity", "certification", "general"],
      default: "general",
      index: true,
    },
    description: { type: String, default: "" },
    color: { type: String, default: "#e9b25f" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Category = model<ICategory>("Category", categorySchema);
