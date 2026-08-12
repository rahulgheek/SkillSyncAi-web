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
    <div className="bg-gray-50 p-4 md:p-6 min-h-[calc(100vh-4rem)]">
      <div className="flex h-[calc(100vh-8rem)] max-w-6xl mx-auto bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        {/* Sidebar Inbox */}
        <div className="w-80 border-r border-gray-100 flex flex-col h-full shrink-0 bg-white">
          <div className="p-6 border-b border-gray-100 shrink-0 flex items-center justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight">My <span className="font-handwriting text-primary text-4xl inline-block -rotate-2">Messages</span></h2>
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
                className={`p-4 border-b border-gray-50 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors ${activeId === item.id ? "bg-primary/5 border-r-4 border-r-primary" : "border-r-4 border-r-transparent"}`}
              >
                <Avatar className="w-12 h-12 shrink-0 border-2 border-white shadow-sm">
                  <AvatarImage src={item.avatarUrl || ""} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {item.type === "PROJECT" ? <Hash className="w-5 h-5"/> : <User className="w-5 h-5"/>}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold text-sm text-foreground truncate">{item.name}</h4>
                    {item.lastMessageAt && (
                      <span className="text-[10px] font-bold text-muted-foreground shrink-0 ml-2">
                        {format(new Date(item.lastMessageAt), "MMM d")}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-muted-foreground truncate">{item.lastMessage || "No messages yet"}</p>
                </div>
                {item.unreadCount > 0 && (
                  <span className="shrink-0 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm shadow-primary/20">
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
            <div className="p-5 border-b border-gray-100 bg-white flex justify-between items-center shrink-0 shadow-sm z-10 relative">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12 shrink-0 border-2 border-white shadow-sm">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {activeType === "PROJECT" ? <Hash className="w-6 h-6"/> : <User className="w-6 h-6"/>}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-black text-lg text-foreground">{inbox?.find(i => i.id === activeId)?.name || "Loading..."}</h3>
                  <span className="text-xs font-bold text-muted-foreground">
                    {activeType === "PROJECT" ? "Team Chat" : "Direct Message"}
                  </span>
                </div>
              </div>
              <div className="text-xs font-bold bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                {isConnected ? (
                  <span className="text-green-500 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/> Connected</span>
                ) : (
                  <span className="text-amber-500 flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin"/> Connecting</span>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
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
                        <div className={`px-5 py-3 text-base shadow-md ${isMe ? "bg-primary text-white rounded-[1.5rem] rounded-tr-sm shadow-primary/20" : "bg-white border border-gray-100 text-foreground rounded-[1.5rem] rounded-tl-sm shadow-gray-200/50"}`}>
                          {msg.content}
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground mt-1.5 mx-1">
                          {format(new Date(msg.createdAt), "h:mm a")}
                        </span>
                      </div>
                    </div>
                  );
                })}
                </>
              )}
            </div>

            <div className="p-5 bg-white border-t border-gray-100 shrink-0">
              <form onSubmit={handleSend} className="flex gap-3 max-w-4xl mx-auto">
                <Input 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 h-12 px-6 rounded-full bg-gray-50 border-gray-200 focus-visible:ring-primary/20 text-base shadow-inner font-medium"
                  disabled={!isConnected}
                />
                <Button type="submit" size="icon" disabled={!content.trim() || !isConnected} className="rounded-full shrink-0 h-12 w-12 bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20">
                  <Send className="w-5 h-5 ml-0.5" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-gray-50/50">
            <div className="p-6 bg-white rounded-full shadow-xl shadow-gray-200/50 mb-6">
              <MessageSquare className="w-12 h-12 text-primary/50" />
            </div>
            <h3 className="text-2xl font-black text-foreground">Your Messages</h3>
            <p className="text-base font-medium mt-2">Select a conversation from the sidebar to start chatting.</p>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
