import { Schema } from "mongoose";
import { model } from "./shared";

export interface IAdmin {
  _id?: string;
  email: string;
  passwordHash: string;
  name: string;
  role: "admin" | "editor";
  lastLogin: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const adminSchema = new Schema<IAdmin>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true, select: false },
    name: { type: String, default: "Administrator" },
    role: { type: String, enum: ["admin", "editor"], default: "admin" },
    lastLogin: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Admin = model<IAdmin>("Admin", adminSchema);
