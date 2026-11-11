import { Schema } from "mongoose";
import { model } from "./shared";

export interface IActivity {
  _id?: string;
  title: string;
  category: string;
  description: string;
  content: string;
  image: string;
  gallery: string[];
  date: string;
  location: string;
  externalUrl: string;
  organizer: string;
  featured: boolean;
  order: number;
  visible: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, default: "Workshop", index: true },
    description: { type: String, default: "" },
    content: { type: String, default: "" },
    image: { type: String, default: "" },
    gallery: { type: [String], default: [] },
    date: { type: String, default: "" },
    location: { type: String, default: "" },
    externalUrl: { type: String, default: "" },
    organizer: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Activity = model<IActivity>("Activity", activitySchema);
