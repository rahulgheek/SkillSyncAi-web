import { api } from "@/lib/api/axios";

export interface NoteResponse {
  id: string;
  title: string;
  content: string;
  aiSummary?: string;
  summaryStatus: "NONE" | "PENDING" | "COMPLETED" | "FAILED" | "OUTDATED";
  summaryUpdatedAt?: string;
  projectId?: string;
  pinned: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface NoteRequest {
  title: string;
  content: string;
  projectId?: string;
  pinned: boolean;
  tags: string[];
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
}

export const getMyNotes = async (page = 0, size = 20, projectId?: string): Promise<Page<NoteResponse>> => {
  const url = projectId 
    ? `/api/v1/notes?page=${page}&size=${size}&projectId=${projectId}`
    : `/api/v1/notes?page=${page}&size=${size}`;
  const response = await api.get(url);
  return response.data.data;
};

export const getNote = async (id: string): Promise<NoteResponse> => {
  const response = await api.get(`/api/v1/notes/${id}`);
  return response.data.data;
};

export const createNote = async (request: NoteRequest): Promise<NoteResponse> => {
  const response = await api.post(`/api/v1/notes`, request);
  return response.data.data;
};

export const updateNote = async (id: string, request: NoteRequest): Promise<NoteResponse> => {
  const response = await api.put(`/api/v1/notes/${id}`, request);
  return response.data.data;
};

export const deleteNote = async (id: string): Promise<void> => {
  await api.delete(`/api/v1/notes/${id}`);
};

export const summarizeNote = async (id: string): Promise<void> => {
  await api.post(`/api/v1/notes/${id}/summarize`);
};
