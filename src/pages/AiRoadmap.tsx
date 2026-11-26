import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRepeat,
  ArrowRight,
  ChatDots,
  CheckCircleFill,
  Circle,
  ListTask,
  Send,
  SignpostSplit,
  Stars,
} from "react-bootstrap-icons";
import {
  generateCustomRoadmap,
  Roadmap,
  CustomRoadmapPayload,
  chatWithRoadmap,
  getActiveRoadmap,
} from "@/features/roadmap/api";
import { getMyTodos, updateTodoStatus, toggleSubtask } from "@/features/todo/api";
import { normalizeError } from "@/lib/api/errors";
import { toast } from "sonner";

export function AiRoadmap() {
  const queryClient = useQueryClient();
  const [targetRole, setTargetRole] = useState("");
  const [currentKnowledge, setCurrentKnowledge] = useState("");
  const [knowledgeGaps, setKnowledgeGaps] = useState("");
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);

  // Chat state
  const [chatMessages, setChatMessages] = useState<
    { role: "user" | "ai"; content: string }[]
  >([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  const { data: activeRoadmap, isLoading: isActiveRoadmapLoading } = useQuery({
    queryKey: ["activeRoadmap"],
    queryFn: getActiveRoadmap,
  });

  useEffect(() => {
    if (activeRoadmap) {
      setRoadmap(activeRoadmap);
    }
  }, [activeRoadmap]);

  // No polling: mutations and roadmap generation invalidate this query.
  const { data: todos, isLoading: isTodosLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: () => getMyTodos(),
  });

  const generateMutation = useMutation({
    mutationFn: generateCustomRoadmap,
    onSuccess: (data) => {
      setRoadmap(data);
      toast.success("Your personalized AI roadmap is ready!");
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      // Todo generation is event-driven on the backend; refresh once after it
      // has had time to finish instead of polling every few seconds.
      window.setTimeout(
        () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
        2500
      );
    },
    onError: (error) => {
      console.error("Roadmap generation failed:", error);
      toast.error(normalizeError(error).message);
    },
  });

  const todoMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateTodoStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast.success("Task updated!");
    },
  });

  const subtaskMutation = useMutation({
    mutationFn: ({ todoId, subtaskId }: { todoId: string; subtaskId: string }) =>
      toggleSubtask(todoId, subtaskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
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
    if (!chatInput.trim() || !roadmap) return;

    const userMsg = chatInput.trim();
    setChatMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const reply = await chatWithRoadmap(roadmap.id, userMsg);
      setChatMessages((prev) => [...prev, { role: "ai", content: reply }]);
    } catch (error) {
      toast.error(normalizeError(error).message);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="dash-page">
      <header className="dash-page-head">
        <div className="dash-page-heading">
          <p className="dash-eyebrow">Career roadmap</p>
          <h1 className="dash-title">
            A path <em>built for you.</em>
          </h1>
          <p className="dash-sub">
            Get a personalized learning path, break it into tasks, and ask the
            assistant when you get stuck.
          </p>
        </div>
      </header>

      {isActiveRoadmapLoading && !roadmap ? (
        <div className="dash-page-loader" role="status" aria-label="Loading roadmap">
          <span className="dash-spinner" aria-hidden="true" />
          <span>Finding your roadmap</span>
        </div>
      ) : (
        <div className="dash-roadmap-layout">
          <div className="dash-roadmap-main">
            {!roadmap && (
              <section className="dash-panel">
                <div className="dash-panel-head">
                  <div className="dash-panel-heading">
                    <p className="dash-panel-kicker">Plan your next move</p>
                    <h2 className="dash-panel-title">
                      Tell us where you are, and where you want to go.
                    </h2>
                    <p className="dash-panel-sub">
                      Leave the target role blank if you want the AI to recommend
                      a path for you.
                    </p>
                  </div>
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
                          style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}
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

            {roadmap && (
              <section className="dash-panel">
                <div className="dash-panel-head">
                  <div className="dash-panel-heading">
                    <p className="dash-panel-kicker">Your path</p>
                    <h2 className="dash-panel-title">{roadmap.title}</h2>
                    <p className="dash-panel-sub">{roadmap.description}</p>
                  </div>
                  <span className="dash-badge dash-badge-ai">
                    <Stars size={9} aria-hidden="true" />
                    AI generated
                  </span>
                </div>

                <div className="dash-panel-body">
                  <ol className="dash-timeline">
                    {roadmap.checkpoints
                      ?.sort((a, b) => a.orderIndex - b.orderIndex)
                      .map((checkpoint, index) => (
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
                            {index !== roadmap.checkpoints.length - 1 && (
                              <span className="dash-timeline-line" aria-hidden="true" />
                            )}
                          </div>
                          <div className="dash-timeline-card">
                            <p className="dash-timeline-kicker">Step {index + 1}</p>
                            <h3 className="dash-timeline-title">{checkpoint.title}</h3>
                            <p className="dash-timeline-text">
                              {checkpoint.description}
                            </p>
                          </div>
                        </li>
                      ))}
                  </ol>
                </div>

                <div className="dash-panel-foot">
                  <span>Tasks were added to your to-do list automatically.</span>
                  <button
                    type="button"
                    className="dash-btn dash-btn-ghost dash-btn-sm"
                    onClick={() => setRoadmap(null)}
                  >
                    Generate new roadmap
                  </button>
                </div>
              </section>
            )}

            {roadmap && (
              <section className="dash-panel dash-chat">
                <div className="dash-panel-head">
                  <div className="dash-panel-heading">
                    <p className="dash-panel-kicker">Ask the assistant</p>
                    <h2 className="dash-panel-title">Roadmap assistant</h2>
                    <p className="dash-panel-sub">
                      Stuck on a topic? Ask the AI for help.
                    </p>
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
                        className={`dash-chat-msg ${
                          msg.role === "user" ? "is-user" : "is-ai"
                        }`}
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
                    {roadmap?.currentTopic
                      ? `Topic: ${roadmap.currentTopic}`
                      : "My to-do list"}
                  </h2>
                  <p className="dash-panel-sub">
                    Roadmap milestones and the tasks beneath them.
                  </p>
                </div>
                <ListTask size={15} color="#8a5a3f" aria-hidden="true" />
              </div>

              <div className="dash-panel-body" style={{ maxHeight: 620, overflowY: "auto" }}>
                {isTodosLoading ? (
                  <div className="dash-loader-row" role="status" style={{ minHeight: 120 }}>
                    <span className="dash-spinner" aria-hidden="true" />
                  </div>
                ) : !todos || todos.length === 0 ? (
                  <div className="dash-empty-inline">
                    <CheckCircleFill size={20} color="#8f8d6e" aria-hidden="true" />
                    <h4>All caught up</h4>
                    <p>Generate a roadmap to get new tasks.</p>
                  </div>
                ) : (
                  <ul className="dash-todo-list">
                    {todos
                      // Filter to only show tasks belonging to the current topic
                      .filter((todo) => {
                        if (!roadmap?.currentTopic) return true;
                        return todo.sourceTitle?.includes(roadmap.currentTopic);
                      })
                      // Sort by dueDate to ensure they appear in chronological order
                      .sort((a, b) => {
                        if (!a.dueDate) return 1;
                        if (!b.dueDate) return -1;
                        return (
                          new Date(a.dueDate).getTime() -
                          new Date(b.dueDate).getTime()
                        );
                      })
                      .map((todo) => (
                        <li
                          key={todo.id}
                          className={`dash-todo${
                            todo.status === "COMPLETED" ? " is-done" : ""
                          }`}
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
                              {todo.sourceTitle && (
                                <span className="dash-todo-source">
                                  {todo.sourceTitle}
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
                                  className={`dash-subtask${
                                    subtask.completed ? " is-done" : ""
                                  }`}
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
      )}
    </div>
  );
}
