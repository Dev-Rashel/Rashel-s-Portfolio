import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please share your name.").max(120),
  email: z.string().trim().email("Enter a valid email address.").max(254),
  subject: z.string().trim().min(3, "Add a short subject.").max(200),
  message: z.string().trim().min(20, "Tell me a little more (at least 20 characters).").max(5000),
  website: z.string().max(0).optional().or(z.literal("")), // honeypot
});

export type ContactValues = z.infer<typeof contactSchema>;
export type LoginValues = z.infer<typeof loginSchema>;

export const slugSchema = z
  .string()
  .trim()
  .min(1)
  .max(90)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only.");

const optionalUrl = z
  .union([z.string().url("Enter a valid URL."), z.literal("")])
  .optional()
  .default("");

const optionalText = z.string().optional().default("");
const number = z.coerce.number().optional().default(0);
const boolean = z.boolean().optional().default(false);
const stringArray = z.array(z.string()).optional().default([]);

export const skillInput = z.object({
  name: z.string().trim().min(1),
  category: z.string().trim().min(1),
  level: z.coerce.number().min(0).max(100).default(75),
  icon: z.string().optional().default(""),
  image: z.string().optional().default(""),
  description: z.string().optional().default(""),
  order: z.coerce.number().default(0),
  enabled: z.boolean().default(true),
});

export const projectInput = z.object({
  title: z.string().trim().min(1),
  slug: slugSchema,
  summary: z.string().optional().default(""),
  content: z.string().optional().default(""),
  thumbnail: z.string().optional().default(""),
  gallery: stringArray,
  githubUrl: optionalUrl,
  liveUrl: optionalUrl,
  techStack: stringArray,
  category: z.string().optional().default("Full-Stack"),
  features: stringArray,
  challenges: z.string().optional().default(""),
  role: z.string().optional().default(""),
  year: z.string().optional().default(String(new Date().getFullYear())),
  featured: z.boolean().default(false),
  order: z.coerce.number().default(0),
  published: z.boolean().default(false),
  seoTitle: z.string().optional().default(""),
  seoDescription: z.string().optional().default(""),
});

export const categoryInput = z.object({
  name: z.string().trim().min(1),
  slug: slugSchema,
  type: z.enum(["project", "post", "activity", "certification", "general"]).default("general"),
  description: z.string().optional().default(""),
  color: z.string().optional().default("#ff7a6b"),
  order: z.coerce.number().default(0),
});

export const postInput = z.object({
  title: z.string().trim().min(1),
  slug: slugSchema,
  excerpt: z.string().optional().default(""),
  content: z.string().optional().default(""),
  coverImage: z.string().optional().default(""),
  gallery: stringArray,
  category: z.string().optional().default("Technical Blog"),
  tags: stringArray,
  publishedAt: z.string().nullable().optional(),
  draft: z.boolean().default(true),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  seoTitle: z.string().optional().default(""),
  seoDescription: z.string().optional().default(""),
  seoKeywords: stringArray,
});

export const experienceInput = z.object({
  role: z.string().trim().min(1),
  company: z.string().trim().min(1),
  companyUrl: optionalUrl,
  location: optionalText,
  type: z.string().optional().default("Full-time"),
  startDate: optionalText,
  endDate: optionalText,
  current: boolean,
  description: optionalText,
  highlights: stringArray,
  logo: optionalText,
  order: number,
  visible: z.boolean().default(true),
});

export const educationInput = z.object({
  institution: z.string().trim().min(1),
  degree: z.string().trim().min(1),
  field: optionalText,
  location: optionalText,
  startDate: optionalText,
  endDate: optionalText,
  current: boolean,
  grade: optionalText,
  description: optionalText,
  logo: optionalText,
  order: number,
  visible: z.boolean().default(true),
});

export const certificationInput = z.object({
  title: z.string().trim().min(1),
  issuer: z.string().trim().min(1),
  issueDate: optionalText,
  expiryDate: optionalText,
  credentialId: optionalText,
  credentialUrl: optionalUrl,
  image: optionalText,
  description: optionalText,
  skills: stringArray,
  featured: boolean,
  order: number,
  visible: z.boolean().default(true),
});

export const activityInput = z.object({
  title: z.string().trim().min(1),
  category: z.string().optional().default("Workshop"),
  description: optionalText,
  content: optionalText,
  image: optionalText,
  gallery: stringArray,
  date: optionalText,
  location: optionalText,
  externalUrl: optionalUrl,
  organizer: optionalText,
  featured: boolean,
  order: number,
  visible: z.boolean().default(true),
});

export const achievementInput = z.object({
  title: z.string().trim().min(1),
  description: optionalText,
  date: optionalText,
  category: z.string().optional().default("Personal"),
  image: optionalText,
  link: optionalUrl,
  issuer: optionalText,
  featured: boolean,
  order: number,
  visible: z.boolean().default(true),
});

export const messageInput = z.object({
  read: z.boolean().optional(),
  archived: z.boolean().optional(),
});

export const mediaInput = z.object({
  alt: z.string().optional().default(""),
});

const ctaSchemaZ = z.object({
  label: z.string().optional().default(""),
  url: z.string().optional().default(""),
  enabled: z.boolean().optional().default(true),
});

export const profileUpdateSchema = z
  .object({
    fullName: z.string().trim().min(1).max(120),
    designation: z.string().trim().max(160),
    tagline: z.string().max(300),
    heroIntro: z.string().max(800),
    shortBio: z.string().max(1000),
    aboutBio: z.string().max(8000),
    journey: z.string().max(5000),
    goals: z.string().max(3000),
    educationSummary: z.string().max(2000),
    interests: z.array(z.string()).max(30),
    achievements: z.array(z.string()).max(50),
    profileImage: z.string().optional().default(""),
    heroImage: z.string().optional().default(""),
    aboutImage: z.string().optional().default(""),
    signatureImage: z.string().optional().default(""),
    location: z.string().max(200),
    email: z.union([z.string().email(), z.literal("")]).optional().default(""),
    phone: z.string().max(60),
    availability: z.string().max(200),
    available: z.boolean(),
    resume: z.object({
      url: z.string().optional().default(""),
      publicId: z.string().optional().default(""),
      fileName: z.string().optional().default(""),
      updatedAt: z.string().or(z.date()).optional(),
    }),
    socials: z.array(
      z.object({
        platform: z.string().min(1),
        label: z.string().min(1),
        url: z.string().min(1),
        icon: z.string().optional().default("link"),
        order: z.coerce.number().default(0),
        visible: z.boolean().default(true),
      })
    ),
    stats: z.array(
      z.object({
        value: z.string().min(1),
        label: z.string().min(1),
        suffix: z.string().optional().default(""),
      })
    ),
    ctas: z.object({
      projects: ctaSchemaZ,
      contact: ctaSchemaZ,
      resume: ctaSchemaZ,
    }),
  })
  .partial();

const sectionCopyZ = z.object({
  eyebrow: z.string().optional().default(""),
  title: z.string().optional().default(""),
  description: z.string().optional().default(""),
});

const sectionKey = z.enum(["about", "skills", "projects", "experience", "activities", "blog", "contact"]);

export const settingsUpdateSchema = z
  .object({
    siteName: z.string().trim().min(1).max(120),
    logo: z.string().optional().default(""),
    logoMark: z.string().max(4).optional().default("RM"),
    favicon: z.string().optional().default(""),
    siteTitle: z.string().max(160),
    siteDescription: z.string().max(500),
    keywords: z.array(z.string()).max(50),
    colors: z.object({
      accent: z.string(),
      accentSoft: z.string(),
      background: z.string(),
      surface: z.string(),
      foreground: z.string(),
    }),
    defaultTheme: z.enum(["dark", "light", "system"]),
    navItems: z.array(
      z.object({
        label: z.string().min(1),
        href: z.string().min(1),
        order: z.coerce.number().default(0),
        visible: z.boolean().default(true),
      })
    ),
    sectionVisibility: z.object({
      about: z.boolean(),
      skills: z.boolean(),
      projects: z.boolean(),
      experience: z.boolean(),
      activities: z.boolean(),
      blog: z.boolean(),
      contact: z.boolean(),
    }),
    sectionOrder: z.array(sectionKey),
    sectionCopy: z.record(sectionKey, sectionCopyZ),
    footer: z.object({
      tagline: z.string().optional().default(""),
      copyright: z.string().optional().default(""),
      links: z.array(z.object({ label: z.string(), href: z.string() })).optional().default([]),
      showSocials: z.boolean().optional().default(true),
      bigText: z.string().optional().default(""),
    }),
    contact: z.object({
      email: z.union([z.string().email(), z.literal("")]).optional().default(""),
      phone: z.string().optional().default(""),
      address: z.string().optional().default(""),
      mapUrl: z.string().optional().default(""),
      formTitle: z.string().optional().default(""),
      formDescription: z.string().optional().default(""),
      successMessage: z.string().optional().default(""),
    }),
    seo: z.object({
      titleTemplate: z.string().optional().default(""),
      defaultTitle: z.string().optional().default(""),
      defaultDescription: z.string().optional().default(""),
      ogImage: z.string().optional().default(""),
      twitterHandle: z.string().optional().default(""),
      robots: z.string().optional().default(""),
      googleVerification: z.string().optional().default(""),
    }),
  })
  .partial();
