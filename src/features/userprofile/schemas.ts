import { z } from "zod";

export const previousProjectSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().max(1000, "Description cannot exceed 1000 characters").optional(),
  projectUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  startedOn: z.string().optional(),
  endedOn: z.string().optional(),
  // Extended fields for frontend
  techStack: z.array(z.string()).optional(),
  role: z.string().optional(),
  githubUrl: z.string().optional(),
  contributors: z.array(z.object({ name: z.string(), profileUrl: z.string().optional() })).optional(),
  status: z.string().optional(),
});

export const studentSkillSchema = z.object({
  studentSkillId: z.string().uuid().optional(),
  skillId: z.string().uuid(),
  name: z.string(),
  level: z.string(),
  source: z.string().optional(),
  endorsedCount: z.number().optional(),
});

export const achievementSchema = z.object({
  id: z.string(),
  title: z.string(),
  organization: z.string(),
  date: z.string(),
  description: z.string().optional(),
  type: z.enum(["Certificate", "Hackathon", "Competition", "Award", "Badge"]),
  certificateUrl: z.string().nullable().optional(),
});

export const aiInsightsSchema = z.object({
  careerSummary: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  skillGaps: z.array(z.string()),
  suggestedTechnologies: z.array(z.string()),
  suggestedProjects: z.array(z.string()),
  recommendedRoles: z.array(z.string()),
  confidenceScore: z.number(),
  learningRoadmap: z.array(z.object({
    title: z.string(),
    description: z.string(),
    dueDate: z.string(),
  })),
});

export const profileResponseSchema = z.object({
  userId: z.string().uuid(),
  fullName: z.string(),
  bio: z.string().nullable().optional(),
  profilePictureUrl: z.string().nullable().optional(),
  resumeUrl: z.string().nullable().optional(),
  resumeSummary: z.string().nullable().optional(),
  linkedinUrl: z.string().nullable().optional(),
  githubUrl: z.string().nullable().optional(),
  portfolioUrl: z.string().nullable().optional(),
  major: z.string().nullable().optional(),
  graduationYear: z.number().nullable().optional(),
  projects: z.array(previousProjectSchema).optional(),
  skills: z.array(studentSkillSchema).optional(),
  
  // Extended mocked fields for UI Design
  // Extended mocked fields for UI Design
  currentRole: z.string().optional(),
  location: z.string().optional(),
  availability: z.string().optional(),
  languages: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  lookingFor: z.string().optional(),
  isVerified: z.boolean().optional(),
  achievements: z.array(achievementSchema).optional(),
  isPublic: z.boolean().optional(),
  aiInsights: aiInsightsSchema.optional(),
  insightsOutdated: z.boolean().optional(),
  stats: z.object({
    connections: z.number(),
    profileViews: z.number(),
    teamRequests: z.number(),
  }).optional(),
});

export const updateBasicInfoSchema = z.object({
  fullName: z.string().min(1, "Name cannot be blank"),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
  major: z.string().optional(),
  graduationYear: z.number().optional(),
  isPublic: z.boolean().optional(),
});

export const updateSocialLinksSchema = z.object({
  linkedinUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  githubUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  portfolioUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export type PreviousProject = z.infer<typeof previousProjectSchema>;
export type StudentSkill = z.infer<typeof studentSkillSchema>;
export type ProfileResponse = z.infer<typeof profileResponseSchema>;
export type UpdateBasicInfoInput = z.infer<typeof updateBasicInfoSchema>;
export type UpdateSocialLinksInput = z.infer<typeof updateSocialLinksSchema>;
export type Achievement = z.infer<typeof achievementSchema>;
export type AiInsights = z.infer<typeof aiInsightsSchema>;
