import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getInbox, ChatInboxItemDto } from "../api";
import { useChat } from "../hooks/useChat";
import { useAuth } from "@/features/auth/context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Send, Loader2, MessageSquare, User, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Messages() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeProjectId = searchParams.get("projectId");
  const activeUserId = searchParams.get("userId");
  
  const activeId = activeProjectId || activeUserId;
  const activeType = searchParams.get("projectId") ? "PROJECT" : searchParams.get("userId") ? "DIRECT" : null;

  const urlName = searchParams.get("name");

  const { data: inbox, isLoading: isInboxLoading } = useQuery({
    queryKey: ["inbox"],
    queryFn: getInbox,
    refetchInterval: 5000, // Poll every 5s for now to keep inbox fresh
  });

  const chatName = useMemo(() => {
    if (activeType === "PROJECT") {
      return inbox?.find(i => i.id === activeId)?.name || "Loading...";
    }
    // DIRECT
    return urlName || inbox?.find(i => i.id === activeId)?.name || "User";
  }, [inbox, activeId, activeType, urlName]);

  const { messages, isConnected, isLoadingHistory, hasMore, isLoadingMore, loadMore, sendMessage } = useChat(activeId, activeType);
  const { user } = useAuth();
  const [content, setContent] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && isConnected) {
      sendMessage(content.trim());
      setContent("");
    }
  };

  const handleSelectChat = (item: ChatInboxItemDto) => {
    if (item.type === "PROJECT") {
      setSearchParams({ projectId: item.id });
    } else {
      setSearchParams({ userId: item.id });
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      {/* Sidebar Inbox */}
      <div className="w-80 border-r flex flex-col h-full shrink-0">
        <div className="p-4 border-b shrink-0 flex items-center justify-between">
          <h2 className="text-xl font-bold">Messages</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {isInboxLoading ? (
            <div className="p-4 text-center text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin mx-auto"/></div>
          ) : inbox?.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p className="text-sm">No messages yet.</p>
            </div>
          ) : (
            inbox?.map(item => (
              <div 
                key={item.id} 
                onClick={() => handleSelectChat(item)}
                className={`p-3 border-b flex items-start gap-3 cursor-pointer hover:bg-muted/50 transition-colors ${activeId === item.id ? "bg-muted" : ""}`}
              >
                <Avatar className="w-10 h-10 shrink-0">
                  <AvatarImage src={item.avatarUrl || ""} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {item.type === "PROJECT" ? <Hash className="w-4 h-4"/> : <User className="w-4 h-4"/>}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                    {item.lastMessageAt && (
                      <span className="text-[10px] text-muted-foreground shrink-0 ml-2">
                        {format(new Date(item.lastMessageAt), "MMM d")}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{item.lastMessage || "No messages yet"}</p>
                </div>
                {item.unreadCount > 0 && (
                  <span className="shrink-0 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {item.unreadCount}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        {activeId ? (
          <>
            <div className="p-4 border-b bg-card flex justify-between items-center shrink-0 shadow-sm">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {activeType === "PROJECT" ? <Hash className="w-5 h-5"/> : <User className="w-5 h-5"/>}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{inbox?.find(i => i.id === activeId)?.name || "Loading..."}</h3>
                  <span className="text-xs text-muted-foreground">
                    {activeType === "PROJECT" ? "Team Chat" : "Direct Message"}
                  </span>
                </div>
              </div>
              <div className="text-xs font-medium">
                {isConnected ? (
                  <span className="text-emerald-500 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/> Connected</span>
                ) : (
                  <span className="text-amber-500 flex items-center gap-1.5"><Loader2 className="w-3 h-3 animate-spin"/> Connecting</span>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-muted/20">
              {isLoadingHistory ? (
                <div className="flex justify-center items-center h-full"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground"/></div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-full text-muted-foreground">
                  <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                <>
                  {hasMore && (
                    <div className="flex justify-center pb-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={loadMore} 
                        disabled={isLoadingMore}
                        className="text-xs"
                      >
                        {isLoadingMore ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : null}
                        Load previous messages
                      </Button>
                    </div>
                  )}
                  {messages.map((msg, i) => {
                  const isMe = msg.senderId.toLowerCase() === user?.id?.toLowerCase();
                  const showAvatar = i === 0 || messages[i - 1].senderId !== msg.senderId;

                  return (
                    <div key={msg.id} className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}>
                      <div className="w-8 shrink-0 flex flex-col items-center">
                        {!isMe && showAvatar && (
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={msg.senderAvatar || undefined} />
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                              {msg.senderName?.charAt(0).toUpperCase() || "?"}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                      <div className={`flex flex-col max-w-[75%] ${isMe ? "items-end" : "items-start"}`}>
                        {!isMe && showAvatar && (
                          <span className="text-xs text-muted-foreground ml-1 mb-1 font-medium">
                            {msg.senderName}
                          </span>
                        )}
                        <div className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm ${isMe ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-card text-card-foreground border rounded-tl-sm"}`}>
                          {msg.content}
                        </div>
                        <span className="text-[10px] text-muted-foreground mt-1 mx-1">
                          {format(new Date(msg.createdAt), "h:mm a")}
                        </span>
                      </div>
                    </div>
                  );
                })}
                </>
              )}
            </div>

            <div className="p-4 bg-background border-t shrink-0">
              <form onSubmit={handleSend} className="flex gap-2 max-w-4xl mx-auto">
                <Input 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 rounded-full bg-muted/50 focus-visible:ring-1"
                  disabled={!isConnected}
                />
                <Button type="submit" size="icon" disabled={!content.trim() || !isConnected} className="rounded-full shrink-0 h-10 w-10">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <MessageSquare className="w-16 h-16 mb-4 opacity-10" />
            <h3 className="text-lg font-medium text-foreground">Your Messages</h3>
            <p className="text-sm mt-1">Select a conversation from the sidebar to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
}
