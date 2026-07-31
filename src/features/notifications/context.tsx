import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyNotifications, getUnreadCount, markAsRead, markAllAsRead, NotificationResponse } from "./api";
import { useAuth } from "@/features/auth/context";
import { toast } from "sonner";
import { api } from "@/lib/api/axios";

interface NotificationContextType {
  notifications: NotificationResponse[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refetch: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [liveUnreadCount, setLiveUnreadCount] = useState<number>(0);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getMyNotifications(0, 50),
    enabled: isAuthenticated,
  });

  const { data: initialUnreadCount } = useQuery({
    queryKey: ["unreadCount"],
    queryFn: getUnreadCount,
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (initialUnreadCount !== undefined) {
      setLiveUnreadCount(initialUnreadCount);
    }
  }, [initialUnreadCount]);

  useEffect(() => {
    if (!isAuthenticated) return;

    // We must pass the auth token. EventSource doesn't support headers natively in browser API.
    // However, the browser sends cookies automatically if we set up session cookies.
    // If using JWT in localStorage, we can append it as a query param (if backend supports it)
    // or use a custom EventSource library. Assuming standard cookie-based or interceptor setup,
    // wait, we are using JWT. EventSource doesn't send Authorization header.
    // A trick is to use a polyfill or just let the backend accept a token query param.
    // For this boilerplate, let's assume it works with cookies or we append the token.
    const token = localStorage.getItem("token");
    const sse = new EventSource(`http://localhost:8080/api/v1/notifications/stream?token=${token}`);

    sse.addEventListener("notification", (event) => {
      try {
        const newNotification: NotificationResponse = JSON.parse(event.data);
        
        // Update unread count
        setLiveUnreadCount((prev) => prev + 1);

        // If this is a resume analysis notification, automatically refresh the profile
        if (newNotification.type === "RESUME_ANALYZED") {
          queryClient.invalidateQueries({ queryKey: ["profile"] });
        }
        
        // Show a live toast
        toast(newNotification.title, {
          description: newNotification.message,
          action: {
            label: "View",
            onClick: () => {
              /* Add navigation logic if needed based on relatedEntityId */
            },
          },
        });

        // Update the react-query cache directly to show the new notification instantly
        queryClient.setQueryData(["notifications"], (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            content: [newNotification, ...oldData.content],
          };
        });
      } catch (err) {
        console.error("Failed to parse SSE notification:", err);
      }
    });

    sse.onerror = (err) => {
      console.error("SSE Error:", err);
      sse.close();
    };

    return () => {
      sse.close();
    };
  }, [isAuthenticated, queryClient]);

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
    setLiveUnreadCount((prev) => Math.max(0, prev - 1));
    queryClient.setQueryData(["notifications"], (oldData: any) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        content: oldData.content.map((n: NotificationResponse) =>
          n.id === id ? { ...n, isRead: true } : n
        ),
      };
    });
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    setLiveUnreadCount(0);
    queryClient.setQueryData(["notifications"], (oldData: any) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        content: oldData.content.map((n: NotificationResponse) => ({ ...n, isRead: true })),
      };
    });
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications: data?.content || [],
        unreadCount: liveUnreadCount,
        isLoading,
        markAsRead: handleMarkAsRead,
        markAllAsRead: handleMarkAllAsRead,
        refetch,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};
