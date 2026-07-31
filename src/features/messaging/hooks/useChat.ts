import { useState, useEffect, useCallback, useRef } from "react";
import { Client } from "@stomp/stompjs";
import { useAuth } from "@/features/auth/context";
import { getChatHistory, getDirectChatHistory, ProjectChatMessage, DirectMessageDto } from "../api";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";

export type ChatMessage = {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string | null;
  content: string;
  createdAt: string;
};

export function useChat(chatId: string | null, type: "PROJECT" | "DIRECT" | null) {
  const { token } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);

  // Fetch Project history
  const { 
    data: projectHistory, 
    isLoading: isLoadingProject,
    fetchNextPage: fetchNextProjectPage,
    hasNextPage: hasNextProjectPage,
    isFetchingNextPage: isFetchingNextProjectPage
  } = useInfiniteQuery({
    queryKey: ["projectChatHistory", chatId],
    queryFn: ({ pageParam = 0 }) => getChatHistory(chatId!, pageParam),
    getNextPageParam: (lastPage) => lastPage && lastPage.number < lastPage.totalPages - 1 ? lastPage.number + 1 : undefined,
    enabled: !!chatId && type === "PROJECT",
    initialPageParam: 0,
  });

  // Fetch Direct history
  const { 
    data: directHistory, 
    isLoading: isLoadingDirect,
    fetchNextPage: fetchNextDirectPage,
    hasNextPage: hasNextDirectPage,
    isFetchingNextPage: isFetchingNextDirectPage
  } = useInfiniteQuery({
    queryKey: ["directChatHistory", chatId],
    queryFn: ({ pageParam = 0 }) => getDirectChatHistory(chatId!, pageParam),
    getNextPageParam: (lastPage) => lastPage && lastPage.number < lastPage.totalPages - 1 ? lastPage.number + 1 : undefined,
    enabled: !!chatId && type === "DIRECT",
    initialPageParam: 0,
  });

  const isLoadingHistory = type === "PROJECT" ? isLoadingProject : isLoadingDirect;
  const hasMore = type === "PROJECT" ? hasNextProjectPage : hasNextDirectPage;
  const isLoadingMore = type === "PROJECT" ? isFetchingNextProjectPage : isFetchingNextDirectPage;

  const loadMore = useCallback(() => {
    if (type === "PROJECT" && hasNextProjectPage && !isFetchingNextProjectPage) {
      fetchNextProjectPage();
    } else if (type === "DIRECT" && hasNextDirectPage && !isFetchingNextDirectPage) {
      fetchNextDirectPage();
    }
  }, [type, hasNextProjectPage, isFetchingNextProjectPage, hasNextDirectPage, isFetchingNextDirectPage, fetchNextProjectPage, fetchNextDirectPage]);

  useEffect(() => {
    if (type === "PROJECT" && projectHistory) {
      const allMessages = projectHistory.pages.flatMap(page => page?.content || []);
      // Remove duplicates based on ID (to avoid issues when new messages arrive while scrolling)
      const uniqueMsgs = Array.from(new Map(allMessages.map(m => [m.id, m])).values());
      setMessages([...uniqueMsgs].reverse().map(m => ({
        id: m.id, senderId: m.senderId, senderName: (m as any).senderName || "User", senderAvatar: (m as any).senderAvatar || null, content: m.content, createdAt: m.createdAt
      })));
    } else if (type === "DIRECT" && directHistory) {
      const allMessages = directHistory.pages.flatMap(page => page?.content || []);
      const uniqueMsgs = Array.from(new Map(allMessages.map(m => [m.id, m])).values());
      setMessages([...uniqueMsgs].reverse().map(m => ({
        id: m.id, senderId: m.senderId, senderName: (m as any).senderName || "User", senderAvatar: (m as any).senderAvatar || null, content: m.content, createdAt: m.createdAt
      })));
    } else {
      setMessages([]);
    }
  }, [projectHistory, directHistory, type, chatId]);

  useEffect(() => {
    if (!token) return;

    const client = new Client({
      brokerURL: "ws://localhost:8080/ws",
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        setIsConnected(true);
        
        // Always subscribe to personal queue for DMs
        client.subscribe(`/user/queue/messages`, (message) => {
          if (message.body) {
            const newMsg = JSON.parse(message.body) as DirectMessageDto;
            // Only add if it belongs to the currently active direct chat
            if (type === "DIRECT" && (newMsg.senderId === chatId || newMsg.recipientId === chatId)) {
               setMessages(prev => {
                 if (prev.some(m => m.id === newMsg.id)) return prev;
                 return [...prev, { id: newMsg.id, senderId: newMsg.senderId, senderName: (newMsg as any).senderName || "User", senderAvatar: (newMsg as any).senderAvatar || null, content: newMsg.content, createdAt: newMsg.createdAt }];
               });
            }
            // Trigger inbox refresh if we get a DM (simplified by just letting React Query handle polling or manual invalidate later)
          }
        });

        // Subscribe to project topic if active
        if (type === "PROJECT" && chatId) {
          client.subscribe(`/topic/projects/${chatId}`, (message) => {
            if (message.body) {
              const newMsg = JSON.parse(message.body) as ProjectChatMessage;
              setMessages(prev => {
                if (prev.some(m => m.id === newMsg.id)) return prev;
                return [...prev, { id: newMsg.id, senderId: newMsg.senderId, senderName: (newMsg as any).senderName || "User", senderAvatar: (newMsg as any).senderAvatar || null, content: newMsg.content, createdAt: newMsg.createdAt }];
              });
            }
          });
        }
      },
      onWebSocketClose: () => setIsConnected(false)
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
      setIsConnected(false);
    };
  }, [chatId, type, token]);

  const sendMessage = useCallback((content: string) => {
    if (clientRef.current && isConnected && chatId && type) {
      const destination = type === "PROJECT" 
        ? `/app/projects/${chatId}/chat` 
        : `/app/direct/${chatId}`;
      
      clientRef.current.publish({
        destination,
        body: JSON.stringify({ content, isRead: false })
      });
    }
  }, [chatId, type, isConnected]);

  return { messages, isConnected, isLoadingHistory, hasMore, isLoadingMore, loadMore, sendMessage };
}
