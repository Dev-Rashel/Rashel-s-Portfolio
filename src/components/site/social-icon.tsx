"use client";

import { Github, Linkedin, Twitter, Instagram, Dribbble, Facebook, Youtube, Mail, Globe, Link2 } from "lucide-react";

const icons = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  x: Twitter,
  instagram: Instagram,
  dribbble: Dribbble,
  facebook: Facebook,
  youtube: Youtube,
  mail: Mail,
  email: Mail,
  website: Globe,
  link: Link2,
} as const;

export function SocialIcon({
  icon,
  platform,
  size = 16,
  className,
}: {
  icon?: string;
  platform?: string;
  size?: number;
  className?: string;
}) {
  const key = (icon || platform || "link").toLowerCase();
  const Icon = icons[key as keyof typeof icons] ?? Link2;
  return <Icon size={size} strokeWidth={1.6} className={className} />;
}
