import { api } from "@/lib/api/axios";

export interface NotificationResponse {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  relatedEntityId?: string;
  createdAt: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
}

export const getMyNotifications = async (page = 0, size = 20): Promise<Page<NotificationResponse>> => {
  const response = await api.get(`/api/v1/notifications?page=${page}&size=${size}`);
  return response.data.data;
};

export const getUnreadCount = async (): Promise<number> => {
  const response = await api.get(`/api/v1/notifications/unread-count`);
  return response.data.data.count;
};

export const markAllAsRead = async (): Promise<void> => {
  await api.put(`/api/v1/notifications/mark-read`);
};

export const markAsRead = async (notificationId: string): Promise<void> => {
  await api.patch(`/api/v1/notifications/${notificationId}/read`);
};
