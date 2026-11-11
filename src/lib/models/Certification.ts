import { Schema } from "mongoose";
import { model } from "./shared";

export interface ICertification {
  _id?: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  credentialId: string;
  credentialUrl: string;
  image: string;
  description: string;
  skills: string[];
  featured: boolean;
  order: number;
  visible: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const certificationSchema = new Schema<ICertification>(
  {
    title: { type: String, required: true, trim: true },
    issuer: { type: String, required: true, trim: true },
    issueDate: { type: String, default: "" },
    expiryDate: { type: String, default: "" },
    credentialId: { type: String, default: "" },
    credentialUrl: { type: String, default: "" },
    image: { type: String, default: "" },
    description: { type: String, default: "" },
    skills: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Certification = model<ICertification>("Certification", certificationSchema);
