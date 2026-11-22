import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  ArrowRepeat,
  ChatDots,
  ChatLeftTextFill,
  ChevronLeft,
  Hash,
  PersonFill,
  SendFill,
} from "react-bootstrap-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/features/auth/context";
import { getInbox, ChatInboxItemDto } from "../api";
import { useChat } from "../hooks/useChat";

export default function Messages() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeProjectId = searchParams.get("projectId");
  const activeUserId = searchParams.get("userId");

  const activeId = activeProjectId || activeUserId;
  const activeType = searchParams.get("projectId")
    ? "PROJECT"
    : searchParams.get("userId")
      ? "DIRECT"
      : null;

  const urlName = searchParams.get("name");

  // No polling: useChat invalidates this query when a message arrives or is sent.
  const { data: inbox, isLoading: isInboxLoading } = useQuery({
    queryKey: ["inbox"],
    queryFn: getInbox,
  });

  const chatName = useMemo(() => {
    if (activeType === "PROJECT") {
      return inbox?.find((item) => item.id === activeId)?.name || "Loading...";
    }
    // DIRECT
    return urlName || inbox?.find((item) => item.id === activeId)?.name || "User";
  }, [inbox, activeId, activeType, urlName]);

  const {
    messages,
    isConnected,
    isLoadingHistory,
    hasMore,
    isLoadingMore,
    loadMore,
    sendMessage,
  } = useChat(activeId, activeType);
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

  const totalUnread = inbox?.reduce((sum, item) => sum + (item.unreadCount || 0), 0) ?? 0;

  return (
    <div className="dash-page">
      <header className="dash-page-head">
        <div className="dash-page-heading">
          <p className="dash-eyebrow">Messages</p>
          <h1 className="dash-title">
            Keep the conversation <em>moving.</em>
          </h1>
          <p className="dash-sub">
            Direct messages and team channels, gathered in one quiet corner.
          </p>
        </div>
        <div className="dash-head-actions">
          <span className="dash-badge dash-badge-soft">
            {totalUnread > 0 ? `${totalUnread} unread` : "All caught up"}
          </span>
        </div>
      </header>

      <div className="dash-messages">
        {/* Inbox. On mobile it is the master view. */}
        <aside className={`dash-inbox${activeId ? " is-hidden-mobile" : ""}`}>
          <div className="dash-inbox-head">
            <div>
              <p className="dash-eyebrow" style={{ marginBottom: 4 }}>
                Inbox
              </p>
              <h2 className="dash-inbox-title">Conversations</h2>
            </div>
            <span className="dash-badge dash-badge-soft">{inbox?.length ?? 0}</span>
          </div>

          <div className="dash-inbox-list">
            {isInboxLoading ? (
              <div className="dash-loader-row" role="status" style={{ minHeight: 140 }}>
                <span className="dash-spinner" aria-hidden="true" />
              </div>
            ) : !inbox || inbox.length === 0 ? (
              <div className="dash-empty-inline" style={{ minHeight: 220 }}>
                <ChatDots size={20} color="#8f8d6e" aria-hidden="true" />
                <h4>No conversations yet</h4>
                <p>Start a chat from a project or a profile to see it here.</p>
              </div>
            ) : (
              inbox.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => handleSelectChat(item)}
                  className={`dash-convo${activeId === item.id ? " is-active" : ""}`}
                >
                  <Avatar className="dash-avatar-sm">
                    <AvatarImage src={item.avatarUrl || undefined} />
                    <AvatarFallback className="dash-avatar-fallback">
                      {item.type === "PROJECT" ? (
                        <Hash size={12} aria-hidden="true" />
                      ) : (
                        <PersonFill size={12} aria-hidden="true" />
                      )}
                    </AvatarFallback>
                  </Avatar>

                  <span className="dash-convo-copy">
                    <span className="dash-convo-top">
                      <span className="dash-convo-name">{item.name}</span>
                      {item.lastMessageAt && (
                        <span className="dash-convo-time">
                          {format(new Date(item.lastMessageAt), "MMM d")}
                        </span>
                      )}
                    </span>
                    <span className="dash-convo-preview">
                      {item.lastMessage || "No messages yet"}
                    </span>
                  </span>

                  {item.unreadCount > 0 && (
                    <span className="dash-convo-badge">{item.unreadCount}</span>
                  )}
                </button>
              ))
            )}
          </div>
        </aside>

        {/* Chat pane. On mobile it is the detail view. */}
        <section className={`dash-chat-pane${activeId ? "" : " is-hidden-mobile"}`}>
          {activeId ? (
            <>
              <header className="dash-chat-pane-head">
                <button
                  type="button"
                  className="dash-icon-btn-sm dash-back-mobile"
                  onClick={() => setSearchParams({})}
                  aria-label="Back to conversations"
                >
                  <ChevronLeft size={12} aria-hidden="true" />
                </button>

                <Avatar className="dash-avatar-sm">
                  <AvatarFallback className="dash-avatar-fallback">
                    {activeType === "PROJECT" ? (
                      <Hash size={12} aria-hidden="true" />
                    ) : (
                      <PersonFill size={12} aria-hidden="true" />
                    )}
                  </AvatarFallback>
                </Avatar>

                <div className="dash-chat-pane-title">
                  <strong>{chatName}</strong>
                  <span>
                    {activeType === "PROJECT" ? "Team channel" : "Direct message"}
                  </span>
                </div>

                <span className={`dash-connection${isConnected ? " is-live" : ""}`}>
                  <span className="dash-connection-dot" aria-hidden="true" />
                  {isConnected ? "Live" : "Connecting"}
                </span>
              </header>

              <div className="dash-thread">
                {isLoadingHistory ? (
                  <div className="dash-loader-row" role="status">
                    <span className="dash-spinner" aria-hidden="true" />
                    <span>Loading messages</span>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="dash-chat-placeholder">
                    <span className="dash-chat-placeholder-icon">
                      <ChatLeftTextFill size={18} aria-hidden="true" />
                    </span>
                    <h3>A blank page</h3>
                    <p>No messages yet. Say hello and start the conversation.</p>
                  </div>
                ) : (
                  <>
                    {hasMore && (
                      <div style={{ display: "flex", justifyContent: "center" }}>
                        <button
                          type="button"
                          className="dash-btn dash-btn-ghost dash-btn-sm"
                          onClick={loadMore}
                          disabled={isLoadingMore}
                        >
                          {isLoadingMore && (
                            <ArrowRepeat
                              size={11}
                              className="dash-icon-spin"
                              aria-hidden="true"
                            />
                          )}
                          Load previous messages
                        </button>
                      </div>
                    )}

                    {messages.map((msg, index) => {
                      const isMe =
                        msg.senderId.toLowerCase() === user?.id?.toLowerCase();
                      const showAvatar =
                        index === 0 || messages[index - 1].senderId !== msg.senderId;

                      return (
                        <div
                          key={msg.id}
                          className={`dash-msg${isMe ? " is-me" : ""}`}
                        >
                          {!isMe && showAvatar && (
                            <Avatar className="dash-avatar-sm">
                              <AvatarImage src={msg.senderAvatar || undefined} />
                              <AvatarFallback className="dash-avatar-fallback">
                                {msg.senderName?.charAt(0).toUpperCase() || "?"}
                              </AvatarFallback>
                            </Avatar>
                          )}

                          <div className="dash-msg-body">
                            {!isMe && showAvatar && (
                              <span className="dash-msg-name">{msg.senderName}</span>
                            )}
                            <div className="dash-msg-bubble">{msg.content}</div>
                            <span className="dash-msg-time">
                              {format(new Date(msg.createdAt), "h:mm a")}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>

              <form className="dash-composer" onSubmit={handleSend}>
                <input
                  className="dash-input"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={
                    isConnected ? "Write a message..." : "Reconnecting to the conversation..."
                  }
                  disabled={!isConnected}
                  aria-label="Message"
                />
                <button
                  type="submit"
                  className="dash-chat-send"
                  disabled={!content.trim() || !isConnected}
                  aria-label="Send message"
                >
                  <SendFill size={13} aria-hidden="true" />
                </button>
              </form>
            </>
          ) : (
            <div className="dash-chat-placeholder">
              <span className="dash-chat-placeholder-icon">
                <ChatDots size={18} aria-hidden="true" />
              </span>
              <h3>Your messages</h3>
              <p>Select a conversation from the inbox to start chatting.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
