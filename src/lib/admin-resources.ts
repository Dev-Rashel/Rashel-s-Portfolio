import type { Model } from "mongoose";
import type { z } from "zod";
import { Skill } from "@/lib/models/Skill";
import { Project } from "@/lib/models/Project";
import { Category } from "@/lib/models/Category";
import { Post } from "@/lib/models/Post";
import { Experience } from "@/lib/models/Experience";
import { Education } from "@/lib/models/Education";
import { Certification } from "@/lib/models/Certification";
import { Activity } from "@/lib/models/Activity";
import { Achievement } from "@/lib/models/Achievement";
import { ContactMessage } from "@/lib/models/ContactMessage";
import { Media } from "@/lib/models/Media";
import {
  achievementInput,
  activityInput,
  categoryInput,
  certificationInput,
  educationInput,
  experienceInput,
  mediaInput,
  messageInput,
  postInput,
  projectInput,
  skillInput,
} from "@/lib/validators";

export type ResourceDefinition = {
  model: Model<any>;
  schema: z.ZodObject<z.ZodRawShape>;
  searchFields: string[];
  defaultSort: Record<string, 1 | -1>;
  creatable?: boolean;
};

export const resources: Record<string, ResourceDefinition> = {
  skills: {
    model: Skill,
    schema: skillInput,
    searchFields: ["name", "category"],
    defaultSort: { order: 1, name: 1 },
  },
  projects: {
    model: Project,
    schema: projectInput,
    searchFields: ["title", "summary", "techStack", "category"],
    defaultSort: { featured: -1, order: 1, createdAt: -1 },
  },
  categories: {
    model: Category,
    schema: categoryInput,
    searchFields: ["name", "slug", "type"],
    defaultSort: { order: 1, name: 1 },
  },
  posts: {
    model: Post,
    schema: postInput,
    searchFields: ["title", "excerpt", "tags", "category"],
    defaultSort: { createdAt: -1 },
  },
  experiences: {
    model: Experience,
    schema: experienceInput,
    searchFields: ["role", "company", "description"],
    defaultSort: { order: 1, startDate: -1 },
  },
  education: {
    model: Education,
    schema: educationInput,
    searchFields: ["institution", "degree", "field"],
    defaultSort: { order: 1, startDate: -1 },
  },
  certifications: {
    model: Certification,
    schema: certificationInput,
    searchFields: ["title", "issuer", "skills"],
    defaultSort: { order: 1, issueDate: -1 },
  },
  activities: {
    model: Activity,
    schema: activityInput,
    searchFields: ["title", "category", "description", "organizer"],
    defaultSort: { order: 1, date: -1 },
  },
  achievements: {
    model: Achievement,
    schema: achievementInput,
    searchFields: ["title", "description", "category"],
    defaultSort: { order: 1, date: -1 },
  },
  messages: {
    model: ContactMessage,
    schema: messageInput,
    searchFields: ["name", "email", "subject", "message"],
    defaultSort: { createdAt: -1 },
    creatable: false,
  },
  media: {
    model: Media,
    schema: mediaInput,
    searchFields: ["name", "alt", "folder"],
    defaultSort: { createdAt: -1 },
    creatable: false,
  },
};

export function getResource(name: string) {
  return resources[name] ?? null;
}
