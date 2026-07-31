import React, { useState, useRef, useEffect } from "react";
import { useProjectChat } from "../hooks/useProjectChat";
import { useAuth } from "@/features/auth/context";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { getProjectMembers } from "@/features/projects/api";
import { useQuery } from "@tanstack/react-query";

interface ProjectChatProps {
  projectId: string;
}

export default function ProjectChat({ projectId }: ProjectChatProps) {
  const { messages, isConnected, isLoadingHistory, sendMessage } = useProjectChat(projectId);
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: members } = useQuery({
    queryKey: ["projectMembers", projectId],
    queryFn: () => getProjectMembers(projectId),
    enabled: !!projectId,
  });

  const getMember = (userId: string) => members?.find(m => m.userId === userId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && isConnected) {
      sendMessage(content.trim());
      setContent("");
    }
  };

  return (
    <div className="flex flex-col h-full bg-background border rounded-lg overflow-hidden shadow-sm">
      <div className="bg-muted px-4 py-3 border-b flex justify-between items-center shrink-0">
        <h3 className="font-semibold text-sm">Team Chat</h3>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Connected
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-500">
              <Loader2 className="w-3 h-3 animate-spin" />
              Connecting...
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoadingHistory ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm">
            <p>No messages yet.</p>
            <p>Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMe = msg.senderId === user?.id;
            const senderInfo = getMember(msg.senderId);
            const showAvatar = i === 0 || messages[i - 1].senderId !== msg.senderId;

            return (
              <div key={msg.id} className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}>
                {/* Avatar */}
                <div className="w-8 shrink-0">
                  {!isMe && showAvatar && (
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={senderInfo?.profilePictureUrl || ""} />
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {senderInfo?.name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`flex flex-col max-w-[75%] ${isMe ? "items-end" : "items-start"}`}>
                  {!isMe && showAvatar && (
                    <span className="text-xs text-muted-foreground mb-1 ml-1">
                      {senderInfo?.name || "Unknown"}
                    </span>
                  )}
                  <div 
                    className={`px-4 py-2.5 rounded-2xl text-sm ${
                      isMe 
                        ? "bg-primary text-primary-foreground rounded-tr-sm" 
                        : "bg-muted text-foreground rounded-tl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-1 mx-1">
                    {format(new Date(msg.createdAt), "h:mm a")}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-background border-t shrink-0">
        <form onSubmit={handleSend} className="flex gap-2">
          <Input 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-full bg-muted/50 border-transparent focus-visible:ring-1 focus-visible:bg-background"
            disabled={!isConnected}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!content.trim() || !isConnected}
            className="rounded-full shrink-0 h-10 w-10"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
