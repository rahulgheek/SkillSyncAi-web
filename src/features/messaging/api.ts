import { api } from "@/lib/api/axios";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface ProjectChatMessage {
  id: string;
  projectId: string;
  senderId: string;
  senderName?: string;
  senderAvatar?: string;
  content: string;
  createdAt: string;
}

export interface DirectMessageDto {
  id: string;
  senderId: string;
  senderName?: string;
  senderAvatar?: string;
  recipientId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export interface ChatInboxItemDto {
  id: string; // projectId or userId
  type: "PROJECT" | "DIRECT";
  name: string;
  avatarUrl?: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export const getChatHistory = async (projectId: string, page = 0, size = 50): Promise<Page<ProjectChatMessage>> => {
  const response = await api.get<ApiResponse<Page<ProjectChatMessage>>>(`/api/v1/projects/${projectId}/messages?page=${page}&size=${size}`);
  return response.data.data;
};

export const getDirectChatHistory = async (userId: string, page = 0, size = 50): Promise<Page<DirectMessageDto>> => {
  const response = await api.get<ApiResponse<Page<DirectMessageDto>>>(`/api/v1/messages/direct/${userId}?page=${page}&size=${size}`);
  return response.data.data;
};

export const getInbox = async (): Promise<ChatInboxItemDto[]> => {
  const response = await api.get<ApiResponse<ChatInboxItemDto[]>>(`/api/v1/messages/inbox`);
  return response.data.data;
};

export const markDirectAsRead = async (userId: string): Promise<void> => {
  await api.post(`/api/v1/messages/direct/${userId}/read`);
};
