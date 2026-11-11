import { Schema } from "mongoose";
import { model } from "./shared";

export interface IEducation {
  _id?: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  grade: string;
  description: string;
  logo: string;
  order: number;
  visible: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const educationSchema = new Schema<IEducation>(
  {
    institution: { type: String, required: true, trim: true },
    degree: { type: String, required: true, trim: true },
    field: { type: String, default: "" },
    location: { type: String, default: "" },
    startDate: { type: String, default: "" },
    endDate: { type: String, default: "" },
    current: { type: Boolean, default: false },
    grade: { type: String, default: "" },
    description: { type: String, default: "" },
    logo: { type: String, default: "" },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Education = model<IEducation>("Education", educationSchema);
