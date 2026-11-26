import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Client } from "@stomp/stompjs";
import { getMyNotifications, getUnreadCount, markAsRead, markAllAsRead, NotificationResponse } from "./api";
import { useAuth } from "@/features/auth/context";
import { toast } from "sonner";
import { WS_BASE_URL } from "@/lib/api/axios";

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
  const { isAuthenticated, token } = useAuth();
  const queryClient = useQueryClient();
  const [liveUnreadCount, setLiveUnreadCount] = useState<number>(0);
  const hasConnectedRef = useRef(false);

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
    if (!isAuthenticated || !token) return;

    const client = new Client({
      brokerURL: WS_BASE_URL,
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        // Notifications are pushed over the same authenticated STOMP
        // connection as chat. The backend sends them to
        // /user/queue/notifications after the notification row commits.
        client.subscribe("/user/queue/notifications", (message) => {
          if (!message.body) return;

          try {
            const newNotification: NotificationResponse = JSON.parse(message.body);

            setLiveUnreadCount((prev) => prev + 1);

            // If this is a resume analysis notification, automatically refresh the profile
            if (newNotification.type === "RESUME_ANALYZED") {
              queryClient.invalidateQueries({ queryKey: ["profile"] });
            }

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
              if (oldData.content.some((n: NotificationResponse) => n.id === newNotification.id)) {
                return oldData;
              }
              return {
                ...oldData,
                content: [newNotification, ...oldData.content],
              };
            });
          } catch (err) {
            console.error("Failed to parse STOMP notification:", err);
          }
        });

        // A reconnect can miss pushes that happened while the socket was down.
        // The REST endpoints remain the source of truth, so resync on every
        // connection after the first one.
        if (hasConnectedRef.current) {
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
          queryClient.invalidateQueries({ queryKey: ["unreadCount"] });
        }
        hasConnectedRef.current = true;
      },
      onStompError: (frame) => {
        console.error("STOMP notification error:", frame.headers["message"], frame.body);
      },
      onWebSocketError: (event) => {
        console.error("Notification WebSocket error:", event);
      },
    });

    client.activate();

    return () => {
      void client.deactivate();
    };
  }, [isAuthenticated, token, queryClient]);

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
