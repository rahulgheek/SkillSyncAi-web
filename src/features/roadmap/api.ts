import { api } from "@/lib/api/axios";

export interface Checkpoint {
  id: string;
  title: string;
  description: string;
  orderIndex: number;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
}

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  status: "ACTIVE" | "COMPLETED" | "FAILED" | "INACTIVE";
  currentTopic?: string;
  checkpoints: Checkpoint[];
}

export interface CustomRoadmapPayload {
  targetRole?: string;
  currentKnowledge?: string;
  knowledgeGaps?: string;
}

export const getActiveRoadmap = async (): Promise<Roadmap | null> => {
  const response = await api.get("/api/v1/roadmaps/active");
  return response.data.data;
};

export const generateCustomRoadmap = async (payload: CustomRoadmapPayload): Promise<Roadmap> => {
  const response = await api.post("/api/v1/roadmaps/generate-custom", payload);
  return response.data.data;
};

export async function updateCheckpointStatus(checkpointId: string, status: string): Promise<void> {
  await api.patch(`/api/v1/roadmaps/checkpoints/${checkpointId}/status`, null, {
    params: { status }
  });
}

export async function chatWithRoadmap(roadmapId: string, message: string): Promise<string> {
  const { data } = await api.post(`/api/v1/roadmaps/${roadmapId}/chat`, { message });
  return data.data.reply;
}
