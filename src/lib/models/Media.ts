import { Schema } from "mongoose";
import { model } from "./shared";

export interface IMedia {
  _id?: string;
  publicId: string;
  url: string;
  secureUrl: string;
  type: string;
  format: string;
  name: string;
  width: number;
  height: number;
  bytes: number;
  alt: string;
  folder: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const mediaSchema = new Schema<IMedia>(
  {
    publicId: { type: String, required: true, unique: true },
    url: { type: String, required: true },
    secureUrl: { type: String, required: true },
    type: { type: String, default: "image" },
    format: { type: String, default: "" },
    name: { type: String, default: "" },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    bytes: { type: Number, default: 0 },
    alt: { type: String, default: "" },
    folder: { type: String, default: "portfolio" },
  },
  { timestamps: true }
);

export const Media = model<IMedia>("Media", mediaSchema);
