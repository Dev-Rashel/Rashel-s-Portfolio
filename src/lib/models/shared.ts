import mongoose, { Schema } from "mongoose";

export type MediaRef = {
  url: string;
  publicId?: string;
  alt?: string;
  width?: number;
  height?: number;
};

export const mediaRefSchema = new Schema<MediaRef>(
  {
    url: { type: String, default: "" },
    publicId: { type: String, default: "" },
    alt: { type: String, default: "" },
    width: Number,
    height: Number,
  },
  { _id: false }
);

export type SocialLink = {
  _id?: string;
  platform: string;
  label: string;
  url: string;
  icon?: string;
  order: number;
  visible: boolean;
};

export const socialLinkSchema = new Schema<SocialLink>(
  {
    platform: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    icon: { type: String, default: "link" },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { _id: true }
);

export type NavItem = {
  _id?: string;
  label: string;
  href: string;
  order: number;
  visible: boolean;
};

const navItemSchema = new Schema<NavItem>(
  {
    label: { type: String, required: true },
    href: { type: String, required: true },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { _id: true }
);

export type FooterLink = {
  label: string;
  href: string;
};

const footerLinkSchema = new Schema<FooterLink>(
  {
    label: { type: String, required: true },
    href: { type: String, required: true },
  },
  { _id: false }
);

export type CTA = {
  label: string;
  url: string;
  enabled: boolean;
};

const ctaSchema = new Schema<CTA>(
  {
    label: { type: String, default: "" },
    url: { type: String, default: "" },
    enabled: { type: Boolean, default: true },
  },
  { _id: false }
);

export type Stat = {
  _id?: string;
  value: string;
  label: string;
  suffix?: string;
};

const statSchema = new Schema<Stat>(
  {
    value: { type: String, required: true },
    label: { type: String, required: true },
    suffix: { type: String, default: "" },
  },
  { _id: true }
);

export type Resume = {
  url: string;
  publicId?: string;
  fileName?: string;
  updatedAt?: Date;
};

const resumeSchema = new Schema<Resume>(
  {
    url: { type: String, default: "" },
    publicId: { type: String, default: "" },
    fileName: { type: String, default: "" },
    updatedAt: Date,
  },
  { _id: false }
);

const model = <T>(name: string, schema: Schema<T>) =>
  (mongoose.models[name] as mongoose.Model<T>) ||
  mongoose.model<T>(name, schema);

export { model, navItemSchema, footerLinkSchema, ctaSchema, statSchema, resumeSchema };
