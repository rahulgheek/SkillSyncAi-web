import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRepeat,
  ArrowRight,
  ChatDots,
  CheckCircleFill,
  Circle,
  ListTask,
  PlusLg,
  Send,
  SignpostSplit,
  Stars,
} from "react-bootstrap-icons";
import {
  createRoadmapSession,
  chatWithRoadmap,
  getRecentRoadmapSession,
  getRoadmapSession,
  getRoadmapSessions,
} from "@/features/roadmap/api";
import type { RoadmapDetail, CustomRoadmapPayload } from "@/features/roadmap/api";
import { updateTodoStatus, toggleSubtask } from "@/features/todo/api";
import { normalizeError } from "@/lib/api/errors";
import { toast } from "sonner";

export function AiRoadmap() {
  const queryClient = useQueryClient();
  const [targetRole, setTargetRole] = useState("");
  const [currentKnowledge, setCurrentKnowledge] = useState("");
  const [knowledgeGaps, setKnowledgeGaps] = useState("");
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [showGenerator, setShowGenerator] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const syncTimeoutRef = useRef<number | null>(null);

  // Chat state
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "ai"; content: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  const sessionsQuery = useQuery({
    queryKey: ["roadmapSessions"],
    queryFn: getRoadmapSessions,
  });

  const recentSessionQuery = useQuery({
    queryKey: ["roadmapSessions", "recent"],
    queryFn: getRecentRoadmapSession,
  });

  const sessions = sessionsQuery.data ?? [];
  const recentSessionId =
    recentSessionQuery.data?.status === "FAILED" ? null : recentSessionQuery.data?.id;
  const fallbackSessionId =
    recentSessionId ??
    sessions.find((session) => session.status !== "FAILED")?.id ??
    sessions[0]?.id ??
    null;
  const activeSessionId = selectedSessionId ?? fallbackSessionId;

  const startSync = useCallback((durationMs = 25000) => {
    setIsSyncing(true);
    if (syncTimeoutRef.current !== null) {
      window.clearTimeout(syncTimeoutRef.current);
    }
    syncTimeoutRef.current = window.setTimeout(() => {
      setIsSyncing(false);
      syncTimeoutRef.current = null;
    }, durationMs);
  }, []);

  useEffect(
    () => () => {
      if (syncTimeoutRef.current !== null) {
        window.clearTimeout(syncTimeoutRef.current);
      }
    },
    [],
  );

  const sessionQuery = useQuery({
    queryKey: ["roadmapSession", activeSessionId],
    queryFn: () => getRoadmapSession(activeSessionId as string),
    enabled: Boolean(activeSessionId),
    // The backend advances the roadmap and generates the next topic after a
    // task is completed. Poll only while that hand-off is in progress.
    refetchInterval: () => (isSyncing ? 2000 : false),
  });

  const session = sessionQuery.data;
  const isInitialLoading =
    sessionsQuery.isLoading ||
    (sessions.length === 0 && recentSessionQuery.isLoading) ||
    (Boolean(activeSessionId) && sessionQuery.isLoading && !session);

  useEffect(() => {
    setChatMessages([]);
    setChatInput("");
  }, [activeSessionId]);

  const roadmaps = useMemo(() => {
    return [...(session?.roadmaps ?? [])].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }, [session?.roadmaps]);

  const primaryRoadmap = roadmaps.length > 0 ? roadmaps[roadmaps.length - 1] : null;
  const chatRoadmap =
    [...roadmaps].reverse().find((roadmap) => roadmap.status === "ACTIVE") ?? primaryRoadmap;

  const sortedTasks = useMemo(() => {
    return [...(session?.tasks ?? [])].sort((a, b) => {
      const aDone = a.status === "COMPLETED";
      const bDone = b.status === "COMPLETED";
      if (aDone !== bDone) return aDone ? 1 : -1;
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      return 0;
    });
  }, [session?.tasks]);

  const checkpointCount = session?.progress.checkpointCount ?? 0;
  const completedCheckpoints = session?.progress.completedCheckpoints ?? 0;
  const completedTasks = sortedTasks.filter((todo) => todo.status === "COMPLETED").length;
  const tasksPending =
    Boolean(session) && checkpointCount > 0 && sortedTasks.length < checkpointCount;

  const waitingForNextTopic = useMemo(() => {
    if (!session || !primaryRoadmap) return false;
    if (primaryRoadmap.status !== "ACTIVE") return false;
    if (primaryRoadmap.curriculum.length === 0) return false;

    const allCheckpointsDone =
      primaryRoadmap.checkpoints.length > 0 &&
      primaryRoadmap.checkpoints.every((checkpoint) => checkpoint.status === "COMPLETED");

    return (
      allCheckpointsDone && primaryRoadmap.completedTopics.length < primaryRoadmap.curriculum.length
    );
  }, [session, primaryRoadmap]);

  useEffect(() => {
    if (tasksPending) startSync(30000);
  }, [session?.id, tasksPending, startSync]);

  useEffect(() => {
    if (waitingForNextTopic) startSync(120000);
  }, [session?.id, waitingForNextTopic, startSync]);

  const refreshRoadmapData = useCallback(() => {
    if (activeSessionId) {
      queryClient.invalidateQueries({
        queryKey: ["roadmapSession", activeSessionId],
      });
    }
    queryClient.invalidateQueries({ queryKey: ["roadmapSessions"] });
  }, [activeSessionId, queryClient]);

  const generateMutation = useMutation({
    mutationFn: createRoadmapSession,
    onSuccess: (data) => {
      setSelectedSessionId(data.id);
      setShowGenerator(false);
      queryClient.setQueryData(["roadmapSession", data.id], data);
      queryClient.invalidateQueries({ queryKey: ["roadmapSessions"] });
      toast.success("Your personalized AI roadmap is ready!");
    },
    onError: (error) => {
      console.error("Roadmap generation failed:", error);
      toast.error(normalizeError(error).message);
    },
  });

  const todoMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateTodoStatus(id, status),
    onSuccess: () => {
      startSync(30000);
      refreshRoadmapData();
      toast.success("Task updated!");
    },
  });

  const subtaskMutation = useMutation({
    mutationFn: ({ todoId, subtaskId }: { todoId: string; subtaskId: string }) =>
      toggleSubtask(todoId, subtaskId),
    onSuccess: () => {
      startSync(30000);
      refreshRoadmapData();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (generateMutation.isPending) return;

    const payload: CustomRoadmapPayload = {
      targetRole: targetRole.trim(),
      currentKnowledge: currentKnowledge.trim(),
      knowledgeGaps: knowledgeGaps.trim(),
    };
    generateMutation.mutate(payload);
  };

  const handleToggleTodo = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "COMPLETED" ? "PENDING" : "COMPLETED";
    todoMutation.mutate({ id, status: newStatus });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !chatRoadmap) return;

    const userMsg = chatInput.trim();
    setChatMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const reply = await chatWithRoadmap(chatRoadmap.id, userMsg);
      setChatMessages((prev) => [...prev, { role: "ai", content: reply }]);
    } catch (error) {
      toast.error(normalizeError(error).message);
    } finally {
      setIsChatLoading(false);
    }
  };

  const sessionStatusClass =
    session?.status === "COMPLETED"
      ? "dash-badge dash-badge-complete"
      : session?.status === "FAILED"
        ? "dash-badge dash-badge-danger"
        : "dash-badge dash-badge-active";

  const sessionFailed = session?.status === "FAILED" || primaryRoadmap?.status === "FAILED";

  const showCreateForm = showGenerator || !session || session.roadmaps.length === 0;

  return (
    <div className="dash-page">
      <header className="dash-page-head">
        <div className="dash-page-heading">
          <p className="dash-eyebrow">Career roadmap</p>
          <h1 className="dash-title">
            A path <em>built for you.</em>
          </h1>
          <p className="dash-sub">
            Get a personalized learning path, break it into tasks, and ask the assistant when you
            get stuck.
          </p>
        </div>
        {session && (
          <div className="dash-head-actions">
            <button
              type="button"
              className="dash-btn dash-btn-solid"
              onClick={() => setShowGenerator(true)}
            >
              <PlusLg size={12} aria-hidden="true" />
              New path
            </button>
          </div>
        )}
      </header>

      {isInitialLoading ? (
        <div className="dash-page-loader" role="status" aria-label="Loading roadmap">
          <span className="dash-spinner" aria-hidden="true" />
          <span>Finding your roadmap</span>
        </div>
      ) : (
        <>
          {session && (
            <div className="dash-session-bar">
              <div className="dash-session-picker">
                <label htmlFor="roadmap-session">Roadmap session</label>
                <select
                  id="roadmap-session"
                  className="dash-select dash-session-select"
                  value={activeSessionId ?? ""}
                  onChange={(event) => {
                    setSelectedSessionId(event.target.value);
                    setShowGenerator(false);
                  }}
                >
                  {session && !sessions.some((item) => item.id === session.id) && (
                    <option value={session.id}>{session.title}</option>
                  )}
                  {sessions.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title} · {item.progressPercentage}% ·{" "}
                      {formatSessionDate(item.createdAt)}
                      {item.status !== "ACTIVE" ? ` · ${item.status.toLowerCase()}` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="dash-session-meta">
                <span className={sessionStatusClass}>{session.status}</span>
                <span>
                  {completedCheckpoints}/{checkpointCount} checkpoints
                </span>
                <span>
                  {completedTasks}/{sortedTasks.length} tasks
                </span>
              </div>

              <div
                className="dash-session-progress"
                aria-label={`${session.progress.progressPercentage}% complete`}
              >
                <div className="dash-progress">
                  <span
                    style={{
                      width: `${session.progress.progressPercentage}%`,
                    }}
                  />
                </div>
                <span>{session.progress.progressPercentage}%</span>
              </div>
            </div>
          )}

          {sessionQuery.isError && (
            <section className="dash-panel">
              <div className="dash-empty-inline">
                <SignpostSplit size={20} color="#8a5a3f" aria-hidden="true" />
                <h4>Could not load this roadmap</h4>
                <p>{normalizeError(sessionQuery.error).message}</p>
                <button
                  type="button"
                  className="dash-btn dash-btn-ghost dash-btn-sm"
                  onClick={() => sessionQuery.refetch()}
                >
                  Try again
                </button>
              </div>
            </section>
          )}

          {!activeSessionId && sessionsQuery.isError && (
            <section className="dash-panel">
              <div className="dash-empty-inline">
                <SignpostSplit size={20} color="#8a5a3f" aria-hidden="true" />
                <h4>Could not load your roadmap sessions</h4>
                <p>{normalizeError(sessionsQuery.error).message}</p>
                <button
                  type="button"
                  className="dash-btn dash-btn-ghost dash-btn-sm"
                  onClick={() => sessionsQuery.refetch()}
                >
                  Try again
                </button>
              </div>
            </section>
          )}

          <div className="dash-roadmap-layout">
            <div className="dash-roadmap-main">
              {showCreateForm && (
                <section className="dash-panel">
                  <div className="dash-panel-head">
                    <div className="dash-panel-heading">
                      <p className="dash-panel-kicker">
                        {session ? "Start a new path" : "Plan your next move"}
                      </p>
                      <h2 className="dash-panel-title">
                        Tell us where you are, and where you want to go.
                      </h2>
                      <p className="dash-panel-sub">
                        Leave the target role blank if you want the AI to recommend a path for you.
                      </p>
                    </div>
                    {session && (
                      <button
                        type="button"
                        className="dash-btn dash-btn-ghost dash-btn-sm"
                        onClick={() => setShowGenerator(false)}
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  <div className="dash-panel-body">
                    <form className="dash-form" onSubmit={handleSubmit}>
                      <div className="dash-field">
                        <label className="dash-label" htmlFor="roadmap-role">
                          Target role <small>What I want to know / do</small>
                        </label>
                        <input
                          id="roadmap-role"
                          className="dash-input"
                          placeholder="e.g. Full Stack Developer... (leave blank for recommendations)"
                          value={targetRole}
                          onChange={(e) => setTargetRole(e.target.value)}
                          disabled={generateMutation.isPending}
                        />
                      </div>

                      <div className="dash-field">
                        <label className="dash-label" htmlFor="roadmap-knowledge">
                          Current knowledge <small>What I know</small>
                        </label>
                        <textarea
                          id="roadmap-knowledge"
                          className="dash-textarea"
                          placeholder="e.g. I know basic React and Python, but have never built a full app."
                          value={currentKnowledge}
                          onChange={(e) => setCurrentKnowledge(e.target.value)}
                          rows={3}
                          disabled={generateMutation.isPending}
                        />
                      </div>

                      <div className="dash-field">
                        <label className="dash-label" htmlFor="roadmap-gaps">
                          Knowledge gaps <small>What I don't know</small>
                        </label>
                        <textarea
                          id="roadmap-gaps"
                          className="dash-textarea"
                          placeholder="e.g. I struggle with databases and backend deployment."
                          value={knowledgeGaps}
                          onChange={(e) => setKnowledgeGaps(e.target.value)}
                          rows={3}
                          disabled={generateMutation.isPending}
                        />
                      </div>

                      <div className="dash-form-actions">
                        <button
                          type="submit"
                          className="dash-btn dash-btn-solid dash-btn-lg"
                          disabled={generateMutation.isPending}
                          aria-busy={generateMutation.isPending}
                        >
                          {generateMutation.isPending ? (
                            <>
                              <ArrowRepeat
                                size={13}
                                className="dash-icon-spin"
                                aria-hidden="true"
                              />
                              Generating your roadmap
                            </>
                          ) : targetRole.trim() ? (
                            <>
                              Generate my roadmap
                              <ArrowRight size={13} aria-hidden="true" />
                            </>
                          ) : (
                            <>
                              <Stars size={13} aria-hidden="true" />
                              Recommend a path for me
                            </>
                          )}
                        </button>
                        {generateMutation.isPending && (
                          <p
                            className="dash-help"
                            role="status"
                            aria-live="polite"
                            style={{
                              margin: 0,
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <ArrowRepeat size={11} className="dash-icon-spin" aria-hidden="true" />
                            Building your roadmap. This can take up to a minute...
                          </p>
                        )}
                      </div>
                    </form>
                  </div>
                </section>
              )}

              {session && session.roadmaps.length > 0 && (
                <section className="dash-panel">
                  <div className="dash-panel-head">
                    <div className="dash-panel-heading">
                      <p className="dash-panel-kicker">Your path</p>
                      <h2 className="dash-panel-title">{session.title}</h2>
                      <p className="dash-panel-sub">{session.description}</p>
                    </div>
                  </div>

                  <div className="dash-panel-body">
                    {isSyncing && (
                      <div className="dash-sync-note" role="status">
                        <ArrowRepeat size={12} className="dash-icon-spin" aria-hidden="true" />
                        {waitingForNextTopic
                          ? "Your current topic is complete. Generating the next one..."
                          : "Updating your roadmap and tasks..."}
                      </div>
                    )}

                    {roadmaps.map((roadmap) => (
                      <RoadmapBlock
                        key={roadmap.id}
                        roadmap={roadmap}
                        showTitle={roadmaps.length > 1}
                      />
                    ))}
                  </div>

                  <div className="dash-panel-foot">
                    <span>
                      {sessionFailed
                        ? "This path failed. Generate a new roadmap to continue."
                        : tasksPending
                          ? "Tasks are being added to this session."
                          : "Tasks are generated from these checkpoints."}
                    </span>
                    <button
                      type="button"
                      className="dash-btn dash-btn-ghost dash-btn-sm"
                      onClick={() => setShowGenerator(true)}
                    >
                      Generate new roadmap
                    </button>
                  </div>
                </section>
              )}

              {session && chatRoadmap && !sessionFailed && (
                <section className="dash-panel dash-chat">
                  <div className="dash-panel-head">
                    <div className="dash-panel-heading">
                      <p className="dash-panel-kicker">Ask the assistant</p>
                      <h2 className="dash-panel-title">Roadmap assistant</h2>
                      <p className="dash-panel-sub">Stuck on a topic? Ask the AI for help.</p>
                    </div>
                    <ChatDots size={15} color="#8a5a3f" aria-hidden="true" />
                  </div>

                  <div className="dash-chat-scroll">
                    {chatMessages.length === 0 ? (
                      <div className="dash-chat-placeholder">
                        <span className="dash-chat-placeholder-icon">
                          <ChatDots size={18} aria-hidden="true" />
                        </span>
                        <h3>Ask anything</h3>
                        <p>Your roadmap is the context. Start with the task that feels stuck.</p>
                      </div>
                    ) : (
                      chatMessages.map((msg, index) => (
                        <div
                          key={index}
                          className={`dash-chat-msg ${msg.role === "user" ? "is-user" : "is-ai"}`}
                        >
                          <div className="dash-chat-bubble">{msg.content}</div>
                        </div>
                      ))
                    )}

                    {isChatLoading && (
                      <div className="dash-typing" aria-label="AI is typing">
                        <span />
                        <span />
                        <span />
                      </div>
                    )}
                  </div>

                  <form className="dash-chat-form" onSubmit={handleSendMessage}>
                    <input
                      className="dash-input"
                      placeholder="Type your question..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      disabled={isChatLoading}
                      aria-label="Message the roadmap assistant"
                    />
                    <button
                      type="submit"
                      className="dash-chat-send"
                      disabled={isChatLoading || !chatInput.trim()}
                      aria-label="Send message"
                    >
                      <Send size={13} aria-hidden="true" />
                    </button>
                  </form>
                </section>
              )}
            </div>

            <aside className="dash-roadmap-side">
              <section className="dash-panel">
                <div className="dash-panel-head">
                  <div className="dash-panel-heading">
                    <p className="dash-panel-kicker">Track the work</p>
                    <h2 className="dash-panel-title">
                      {primaryRoadmap?.currentTopic
                        ? `Topic: ${primaryRoadmap.currentTopic}`
                        : "My tasks"}
                    </h2>
                    <p className="dash-panel-sub">
                      Every task in this roadmap session, in due-date order.
                    </p>
                  </div>
                  <div className="dash-panel-actions">
                    <span className="dash-badge dash-badge-soft">
                      {completedTasks}/{sortedTasks.length}
                    </span>
                    <ListTask size={15} color="#8a5a3f" aria-hidden="true" />
                  </div>
                </div>

                <div className="dash-panel-body dash-todo-scroll">
                  {tasksPending && (
                    <div className="dash-sync-note" role="status">
                      <ArrowRepeat size={12} className="dash-icon-spin" aria-hidden="true" />
                      Preparing tasks for this roadmap...
                    </div>
                  )}

                  {sortedTasks.length === 0 ? (
                    <div className="dash-empty-inline">
                      <CheckCircleFill size={20} color="#8f8d6e" aria-hidden="true" />
                      <h4>
                        {sessionFailed
                          ? "No tasks"
                          : tasksPending
                            ? "Preparing tasks"
                            : "No tasks yet"}
                      </h4>
                      <p>
                        {sessionFailed
                          ? "This path failed to generate. Start a new one above."
                          : tasksPending
                            ? "Your roadmap is ready. Tasks will appear here automatically."
                            : "Generate a roadmap to get new tasks."}
                      </p>
                    </div>
                  ) : (
                    <ul className="dash-todo-list">
                      {sortedTasks.map((todo) => (
                        <li
                          key={todo.id}
                          className={`dash-todo${todo.status === "COMPLETED" ? " is-done" : ""}`}
                        >
                          <button
                            type="button"
                            className="dash-todo-head"
                            onClick={() => handleToggleTodo(todo.id, todo.status)}
                            aria-pressed={todo.status === "COMPLETED"}
                          >
                            <span className="dash-todo-check">
                              {todo.status === "COMPLETED" ? (
                                <CheckCircleFill size={14} aria-hidden="true" />
                              ) : (
                                <Circle size={14} aria-hidden="true" />
                              )}
                            </span>
                            <span style={{ minWidth: 0 }}>
                              <span className="dash-todo-title">{todo.title}</span>
                              {formatTaskSource(todo.sourceTitle) && (
                                <span className="dash-todo-source">
                                  {formatTaskSource(todo.sourceTitle)}
                                </span>
                              )}
                            </span>
                          </button>

                          {todo.subtasks && todo.subtasks.length > 0 && (
                            <div className="dash-subtasks">
                              {todo.subtasks.map((subtask) => (
                                <button
                                  type="button"
                                  key={subtask.id}
                                  className={`dash-subtask${subtask.completed ? " is-done" : ""}`}
                                  onClick={() =>
                                    subtaskMutation.mutate({
                                      todoId: todo.id,
                                      subtaskId: subtask.id,
                                    })
                                  }
                                >
                                  {subtask.completed ? (
                                    <CheckCircleFill size={10} aria-hidden="true" />
                                  ) : (
                                    <Circle size={10} aria-hidden="true" />
                                  )}
                                  {subtask.title}
                                </button>
                              ))}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            </aside>
          </div>
        </>
      )}
    </div>
  );
}

function formatSessionDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatTaskSource(sourceTitle?: string) {
  if (!sourceTitle) return "";
  const marker = "| Topic: ";
  const markerIndex = sourceTitle.indexOf(marker);
  return markerIndex >= 0
    ? `Topic: ${sourceTitle.slice(markerIndex + marker.length)}`
    : sourceTitle;
}

function RoadmapBlock({ roadmap, showTitle }: { roadmap: RoadmapDetail; showTitle: boolean }) {
  const checkpoints = useMemo(
    () => [...roadmap.checkpoints].sort((a, b) => a.orderIndex - b.orderIndex),
    [roadmap.checkpoints],
  );
  const completed = checkpoints.filter((checkpoint) => checkpoint.status === "COMPLETED").length;

  const topicLabel =
    roadmap.status === "FAILED"
      ? "Generation failed"
      : roadmap.currentTopic
        ? `Current topic: ${roadmap.currentTopic}`
        : roadmap.status === "COMPLETED"
          ? "All topics completed"
          : roadmap.curriculum.length > 0
            ? "Preparing the next topic"
            : "Learning path";

  return (
    <div className="dash-roadmap-block">
      <div className="dash-roadmap-block-head">
        <div>
          {showTitle && <h3 className="dash-roadmap-block-title">{roadmap.title}</h3>}
          <p className="dash-roadmap-topic">{topicLabel}</p>
        </div>
        <div className="dash-roadmap-block-meta">
          <span className="dash-badge dash-badge-soft">
            {completed}/{checkpoints.length} done
          </span>
          {roadmap.status === "COMPLETED" && (
            <span className="dash-badge dash-badge-complete">Completed</span>
          )}
          {roadmap.status === "FAILED" && (
            <span className="dash-badge dash-badge-danger">Failed</span>
          )}
        </div>
      </div>

      {roadmap.status === "FAILED" ? (
        <div className="dash-empty-inline">
          <SignpostSplit size={20} color="#9a3d25" aria-hidden="true" />
          <h4>This path could not be generated</h4>
          <p>Try again with a different role or a shorter description.</p>
        </div>
      ) : checkpoints.length === 0 ? (
        <div className="dash-empty-inline">
          <SignpostSplit size={20} color="#8f8d6e" aria-hidden="true" />
          <h4>No checkpoints yet</h4>
          <p>This roadmap is still being prepared.</p>
        </div>
      ) : (
        <ol className="dash-timeline">
          {checkpoints.map((checkpoint, index) => (
            <li
              key={checkpoint.id}
              className={`dash-timeline-item${
                checkpoint.status === "COMPLETED" ? " is-complete" : ""
              }`}
            >
              <div className="dash-timeline-rail">
                <span className="dash-timeline-marker">
                  {checkpoint.status === "COMPLETED" ? (
                    <CheckCircleFill size={12} aria-hidden="true" />
                  ) : (
                    index + 1
                  )}
                </span>
                {index !== checkpoints.length - 1 && (
                  <span className="dash-timeline-line" aria-hidden="true" />
                )}
              </div>
              <div className="dash-timeline-card">
                <p className="dash-timeline-kicker">Step {index + 1}</p>
                <h3 className="dash-timeline-title">{checkpoint.title}</h3>
                <p className="dash-timeline-text">{checkpoint.description}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
