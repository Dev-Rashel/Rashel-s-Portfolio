import { Schema } from "mongoose";
import { model } from "./shared";

export interface IAchievement {
  _id?: string;
  title: string;
  description: string;
  date: string;
  category: string;
  image: string;
  link: string;
  issuer: string;
  featured: boolean;
  order: number;
  visible: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const achievementSchema = new Schema<IAchievement>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    date: { type: String, default: "" },
    category: { type: String, default: "Personal" },
    image: { type: String, default: "" },
    link: { type: String, default: "" },
    issuer: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Achievement = model<IAchievement>("Achievement", achievementSchema);
