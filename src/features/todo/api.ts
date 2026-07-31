import { api } from "@/lib/api/axios";

export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDate?: string;
  completedAt?: string;
  relatedEntityId?: string;
  sourceTitle?: string;
  createdAt: string;
  subtasks?: {
    id: string;
    title: string;
    completed: boolean;
  }[];
}

export const getMyTodos = async (status?: string): Promise<Todo[]> => {
  const url = status ? `/api/v1/todos?status=${status}` : `/api/v1/todos`;
  const response = await api.get(url);
  return response.data.data.content;
};

export const updateTodoStatus = async (todoId: string, status: string): Promise<Todo> => {
  const response = await api.patch(`/api/v1/todos/${todoId}/status?status=${status}`);
  return response.data.data;
};

export const toggleSubtask = async (todoId: string, subtaskId: string): Promise<Todo> => {
  const response = await api.patch(`/api/v1/todos/${todoId}/subtasks/${subtaskId}/toggle`);
  return response.data.data;
};
