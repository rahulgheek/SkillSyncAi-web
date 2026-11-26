import { api } from "@/lib/api/axios";
import type { Todo } from "@/features/todo/api";

export type RoadmapStatus = "ACTIVE" | "COMPLETED" | "FAILED" | "INACTIVE";
export type RoadmapSessionStatus = "ACTIVE" | "COMPLETED" | "FAILED" | "INACTIVE";

export interface Checkpoint {
  id: string;
  title: string;
  description: string;
  orderIndex: number;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  dueDate?: string;
  completedAt?: string;
  subtasks?: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  learningResources?: unknown[];
}

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  status: RoadmapStatus;
  currentTopic?: string;
  checkpoints: Checkpoint[];
}

export interface CustomRoadmapPayload {
  targetRole?: string;
  currentKnowledge?: string;
  knowledgeGaps?: string;
}

export interface RoadmapDetail {
  id: string;
  title: string;
  description: string;
  status: RoadmapStatus;
  currentTopic?: string;
  completedTopics: string[];
  curriculum: string[];
  createdAt: string;
  checkpoints: Checkpoint[];
}

export interface RoadmapSessionProgress {
  roadmapCount: number;
  checkpointCount: number;
  completedCheckpoints: number;
  taskCount: number;
  completedTasks: number;
  progressPercentage: number;
}

export interface RoadmapSessionSummary {
  id: string;
  title: string;
  targetRole?: string;
  status: RoadmapSessionStatus;
  lastViewedAt?: string;
  createdAt: string;
  updatedAt: string;
  roadmapCount: number;
  checkpointCount: number;
  completedCheckpoints: number;
  taskCount: number;
  completedTasks: number;
  progressPercentage: number;
  latestRoadmapId?: string;
  currentTopic?: string;
}

export interface RoadmapSessionDetail {
  id: string;
  title: string;
  targetRole?: string;
  description: string;
  status: RoadmapSessionStatus;
  lastViewedAt?: string;
  createdAt: string;
  updatedAt: string;
  progress: RoadmapSessionProgress;
  roadmaps: RoadmapDetail[];
  tasks: Todo[];
}

/**
 * Legacy single-roadmap endpoint. Prefer the session endpoints below so a
 * roadmap and its tasks always come from the same session.
 */
export const getActiveRoadmap = async (): Promise<Roadmap | null> => {
  const response = await api.get("/api/v1/roadmaps/active");
  return response.data.data;
};

export const generateCustomRoadmap = async (payload: CustomRoadmapPayload): Promise<Roadmap> => {
  const response = await api.post("/api/v1/roadmaps/generate-custom", payload);
  return response.data.data;
};

export const getRoadmapSessions = async (): Promise<RoadmapSessionSummary[]> => {
  const response = await api.get("/api/v1/roadmaps/sessions", {
    params: { page: 0, size: 50, sort: "updatedAt,desc" },
  });
  return response.data.data.content;
};

export const getRecentRoadmapSession = async (): Promise<RoadmapSessionSummary | null> => {
  const response = await api.get("/api/v1/roadmaps/sessions/recent");
  return response.data.data;
};

export const getRoadmapSession = async (sessionId: string): Promise<RoadmapSessionDetail> => {
  const response = await api.get(`/api/v1/roadmaps/sessions/${sessionId}`);
  return response.data.data;
};

export const createRoadmapSession = async (
  payload: CustomRoadmapPayload,
): Promise<RoadmapSessionDetail> => {
  const response = await api.post("/api/v1/roadmaps/sessions", payload);
  return response.data.data;
};

export async function updateCheckpointStatus(checkpointId: string, status: string): Promise<void> {
  await api.patch(`/api/v1/roadmaps/checkpoints/${checkpointId}/status`, null, {
    params: { status },
  });
}

export async function chatWithRoadmap(roadmapId: string, message: string): Promise<string> {
  const { data } = await api.post(`/api/v1/roadmaps/${roadmapId}/chat`, {
    message,
  });
  return data.data.reply;
}
