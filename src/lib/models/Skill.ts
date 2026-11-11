import { Schema } from "mongoose";
import { model } from "./shared";

export interface ISkill {
  _id?: string;
  name: string;
  category: string;
  level: number;
  icon: string;
  image?: string;
  description?: string;
  order: number;
  enabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const skillSchema = new Schema<ISkill>(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, index: true },
    level: { type: Number, min: 0, max: 100, default: 75 },
    icon: { type: String, default: "" },
    image: { type: String, default: "" },
    description: { type: String, default: "" },
    order: { type: Number, default: 0, index: true },
    enabled: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Skill = model<ISkill>("Skill", skillSchema);
