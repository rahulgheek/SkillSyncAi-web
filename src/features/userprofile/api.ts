import { api } from "@/lib/api/axios";
import { ProfileResponse, UpdateBasicInfoInput, UpdateSocialLinksInput } from "./schemas";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getMyProfile = async (): Promise<ProfileResponse> => {
  const { data } = await api.get<ApiResponse<ProfileResponse>>("/api/v1/profile/me");
  return data.data;
};

export const generateAiInsights = async (): Promise<ProfileResponse> => {
  const { data } = await api.post<ApiResponse<ProfileResponse>>("/api/v1/profile/me/insights/generate");
  return data.data;
};

export const getPublicProfile = async (userId: string): Promise<ProfileResponse> => {
  const { data } = await api.get<ApiResponse<ProfileResponse>>(`/api/v1/profile/me/${userId}`);
  return data.data;
};

export const searchProfiles = async (query: string, page = 0, size = 20): Promise<{ content: ProfileResponse[], totalPages: number, number: number }> => {
  const { data } = await api.get<ApiResponse<{ content: ProfileResponse[], totalPages: number, number: number }>>(`/api/v1/profile/me/search?query=${encodeURIComponent(query)}&page=${page}&size=${size}`);
  return data.data;
};

export const createProfile = async (input: UpdateBasicInfoInput): Promise<ProfileResponse> => {
  const { data } = await api.post<ApiResponse<ProfileResponse>>("/api/v1/profile/me", input);
  return data.data;
};

export const updateBasicInfo = async (input: UpdateBasicInfoInput): Promise<void> => {
  await api.put("/api/v1/profile/me/basic-info", input);
};

export const updateSocialLinks = async (input: UpdateSocialLinksInput): Promise<void> => {
  await api.put("/api/v1/profile/me/social-links", input);
};

export const updateResume = async (mediaUrl: string): Promise<void> => {
  await api.put("/api/v1/profile/me/resume", { url: mediaUrl });
};

export const updateAvatar = async (mediaUrl: string): Promise<void> => {
  await api.put("/api/v1/profile/me/avatar", { url: mediaUrl });
};

export interface Skill {
  id: string;
  name: string;
  category: string;
}

export const searchSkills = async (query: string): Promise<Skill[]> => {
  if (!query || query.trim().length < 2) return [];
  const { data } = await api.get<ApiResponse<Skill[]>>(`/api/v1/skills/search?query=${encodeURIComponent(query)}`);
  return data.data;
};

export const addSkill = async (input: { skillId: string; level: string }): Promise<void> => {
  await api.post("/api/v1/skills/me", input);
};

export const removeSkill = async (studentSkillId: string): Promise<void> => {
  await api.delete(`/api/v1/skills/me/${studentSkillId}`);
};

// --- Projects ---

export interface ProjectInput {
  title: string;
  description?: string;
  projectUrl?: string;
  githubUrl?: string;
  startedOn?: string;
  endedOn?: string;
  techStack?: string[];
}

export const addProject = async (input: ProjectInput): Promise<void> => {
  await api.post("/api/v1/profile/me/projects", input);
};

export const updateProject = async (projectId: string, input: ProjectInput): Promise<void> => {
  await api.put(`/api/v1/profile/me/projects/${projectId}`, input);
};

export const deleteProject = async (projectId: string): Promise<void> => {
  await api.delete(`/api/v1/profile/me/projects/${projectId}`);
};

// --- Uploads ---

export interface UploadSignature {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  folder: string;
}

export const getUploadSignature = async (type: string): Promise<UploadSignature> => {
  const { data } = await api.get<ApiResponse<UploadSignature>>(`/api/uploads/signature?type=${type}`);
  return data.data;
};

// --- Achievements ---

export interface AchievementInput {
  title: string;
  organization: string;
  date: string;
  description?: string;
  type: string;
  certificateUrl?: string;
}

export const addAchievement = async (input: AchievementInput): Promise<void> => {
  await api.post("/api/v1/userprofile/achievements", input);
};

export const updateAchievement = async (id: string, input: AchievementInput): Promise<void> => {
  await api.put(`/api/v1/userprofile/achievements/${id}`, input);
};

export const deleteAchievement = async (id: string): Promise<void> => {
  await api.delete(`/api/v1/userprofile/achievements/${id}`);
};
