import { useState, useEffect, useCallback, useRef } from "react";
import { Client } from "@stomp/stompjs";
import { useAuth } from "@/features/auth/context";
import { getChatHistory, ProjectChatMessage } from "../api";
import { useQuery } from "@tanstack/react-query";

export function useProjectChat(projectId: string) {
  const { token } = useAuth();
  const [messages, setMessages] = useState<ProjectChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);

  const { data: historyData, isLoading: isLoadingHistory } = useQuery({
    queryKey: ["projectChatHistory", projectId],
    queryFn: () => getChatHistory(projectId),
    enabled: !!projectId,
  });

  useEffect(() => {
    if (historyData?.content) {
      // Backend returns newest first (DESC). Reverse to display oldest first.
      setMessages([...historyData.content].reverse());
    }
  }, [historyData]);

  useEffect(() => {
    if (!token || !projectId) return;

    const client = new Client({
      brokerURL: "wss://skillsyncai-kkip.onrender.com/ws",
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      debug: (str) => {
        // Uncomment for STOMP debugging
        // console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        setIsConnected(true);
        client.subscribe(`/topic/projects/${projectId}`, (message) => {
          if (message.body) {
            const newMsg = JSON.parse(message.body) as ProjectChatMessage;
            setMessages((prev) => {
              // Avoid duplicates if STOMP delivers multiple times or if our own message comes back
              if (prev.some(m => m.id === newMsg.id)) return prev;
              return [...prev, newMsg];
            });
          }
        });
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      },
      onWebSocketClose: () => {
        setIsConnected(false);
      }
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
      setIsConnected(false);
    };
  }, [projectId, token]);

  const sendMessage = useCallback((content: string) => {
    if (clientRef.current && isConnected) {
      clientRef.current.publish({
        destination: `/app/projects/${projectId}/chat`,
        body: JSON.stringify({ content })
      });
    }
  }, [projectId, isConnected]);

  return {
    messages,
    isConnected,
    isLoadingHistory,
    sendMessage
  };
}
