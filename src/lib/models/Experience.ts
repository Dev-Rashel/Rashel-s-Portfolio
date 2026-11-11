import { Schema } from "mongoose";
import { model } from "./shared";

export interface IExperience {
  _id?: string;
  role: string;
  company: string;
  companyUrl: string;
  location: string;
  type: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  highlights: string[];
  logo: string;
  order: number;
  visible: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const experienceSchema = new Schema<IExperience>(
  {
    role: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    companyUrl: { type: String, default: "" },
    location: { type: String, default: "" },
    type: { type: String, default: "Full-time" },
    startDate: { type: String, default: "" },
    endDate: { type: String, default: "" },
    current: { type: Boolean, default: false },
    description: { type: String, default: "" },
    highlights: { type: [String], default: [] },
    logo: { type: String, default: "" },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Experience = model<IExperience>("Experience", experienceSchema);
