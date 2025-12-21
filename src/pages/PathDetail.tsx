import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../App.css";
import { usePaths } from "../context/PathsContext";
import {
  fetchPaths,
  getPath,
  deletePath as deletePathApi,
  deleteSection,
  deleteTask,
  updatePath,
  updateSection,
  updateTask
} from "../api/paths";
import { mockedPaths } from "../data/mockData";
import AppHeader from "../components/AppHeader";
import { Identifier, PathResponse, SectionResponse, TaskResponse, TaskStatus } from "../types/paths";

type StatusMessage = { tone: "error" | "success"; text: string } | null;

export default function PathDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { paths, setPaths } = usePaths();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pathDetails, setPathDetails] = useState<PathResponse | null>(null);
  const [status, setStatus] = useState<StatusMessage>(null);
  const [deletingPath, setDeletingPath] = useState(false);
  const [deletingSectionId, setDeletingSectionId] = useState<Identifier | null>(null);
  const [deletingTask, setDeletingTask] = useState<{ sectionId: Identifier; taskId: Identifier } | null>(null);
  const [updatingPath, setUpdatingPath] = useState(false);
  const [updatingSectionId, setUpdatingSectionId] = useState<Identifier | null>(null);
  const [updatingTask, setUpdatingTask] = useState<{ sectionId: Identifier; taskId: Identifier } | null>(null);

  const contextPath = useMemo(() => paths.find((p) => String(p.id) === id), [paths, id]);
  const displayPath = pathDetails ?? contextPath ?? null;
  const pathId = displayPath?.id ?? id ?? "";

  useEffect(() => {
    setPathDetails(contextPath ?? null);
  }, [contextPath]);

  useEffect(() => {
    if (contextPath) {
      return;
    }
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const result = await fetchPaths();
        if (!cancelled) {
          setPaths(result.paths);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    load().catch(() => setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [contextPath, setPaths]);

  useEffect(() => {
    if (!id) {
      return;
    }
    let cancelled = false;
    const loadDetails = async () => {
      setLoading(true);
      setStatus(null);
      try {
        const latest = await getPath(id);
        if (cancelled) {
          return;
        }
        const normalized = latest.id ? latest : { ...latest, id };
        setPathDetails(normalized);
        setPaths((prev) => {
          const targetId = normalized.id ?? id;
          if (!targetId) {
            return prev;
          }
          const index = prev.findIndex((p) => String(p.id) === String(targetId));
          if (index === -1) {
            return [...prev, normalized];
          }
          const updated = [...prev];
          updated[index] = { ...prev[index], ...normalized };
          return updated;
        });
      } catch (error) {
        if (!cancelled) {
          setStatus({ tone: "error", text: surfaceError(error) });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    loadDetails();
    return () => {
      cancelled = true;
    };
  }, [id, setPaths]);

  const fallbackMockPath = useMemo(() => {
    const targetId = displayPath?.id ?? id;
    return mockedPaths.find((mock) => String(mock.id) === String(targetId)) ?? mockedPaths[0] ?? null;
  }, [displayPath?.id, id]);

  const fallbackSections = useMemo(() => buildFallbackSections(displayPath?.id ?? id), [displayPath?.id, id]);
  const sections = displayPath?.sections && displayPath.sections.length > 0 ? displayPath.sections : fallbackSections;
  const pathProgress = calculatePathProgress(displayPath, sections);
  const heroTitle = displayPath?.title ?? fallbackMockPath?.name ?? "Learning Path";
  const heroDescription = displayPath?.description ?? fallbackMockPath?.description ?? "";

  if (!displayPath && loading) {
    return <div className="dashboard-shell">Loading...</div>;
  }

  if (!displayPath && !loading) {
    return (
      <div className="dashboard-shell">
        <AppHeader chipLabel="Path Detail" />
        <main className="dashboard-body detail-layout">
          <p>Unable to find the requested path.</p>
          <Link to="/dashboard" className="primary-button">
            Back to dashboard
          </Link>
        </main>
        <footer className="dashboard-footer">Ac {new Date().getFullYear()} Path Progress. All rights reserved.</footer>
      </div>
    );
  }

  const handleDeletePath = async () => {
    if (!pathId || !window.confirm("Delete this learning path? This cannot be undone.")) {
      return;
    }
    setDeletingPath(true);
    setStatus(null);
    try {
      await deletePathApi(pathId);
      setPaths((prev) => prev.filter((p) => String(p.id) !== String(pathId)));
      navigate("/dashboard", { state: { notice: "Path deleted successfully." } });
    } catch (error) {
      setStatus({ tone: "error", text: surfaceError(error) });
    } finally {
      setDeletingPath(false);
    }
  };

  const handleDeleteSection = async (sectionId: Identifier) => {
    if (!pathId || !window.confirm("Delete this section? All tasks in it will be removed.")) {
      return;
    }
    setDeletingSectionId(sectionId);
    setStatus(null);
    try {
      await deleteSection(pathId, sectionId);
      setPathDetails((prev) => (prev ? removeSectionFromPath(prev, sectionId) : prev));
      setPaths((prev) =>
        prev.map((p) => (String(p.id) === String(pathId) ? removeSectionFromPath(p, sectionId) : p))
      );
      setStatus({ tone: "success", text: "Section deleted." });
    } catch (error) {
      setStatus({ tone: "error", text: surfaceError(error) });
    } finally {
      setDeletingSectionId(null);
    }
  };

  const handleDeleteTask = async (sectionId: Identifier, taskId: Identifier) => {
    if (!pathId) {
      return;
    }
    if (!window.confirm("Delete this task?")) {
      return;
    }
    setDeletingTask({ sectionId, taskId });
    setStatus(null);
    try {
      await deleteTask(pathId, sectionId, taskId);
      setPathDetails((prev) => (prev ? removeTaskFromPath(prev, sectionId, taskId) : prev));
      setPaths((prev) =>
        prev.map((p) => (String(p.id) === String(pathId) ? removeTaskFromPath(p, sectionId, taskId) : p))
      );
      setStatus({ tone: "success", text: "Task deleted." });
    } catch (error) {
      setStatus({ tone: "error", text: surfaceError(error) });
    } finally {
      setDeletingTask(null);
    }
  };

  const handleEditPath = async () => {
    if (!pathId || !displayPath) {
      return;
    }
    const nextTitle = window.prompt("Update path title", displayPath.title ?? "");
    if (nextTitle === null || !nextTitle.trim()) {
      return;
    }
    const nextDescription = window.prompt("Update path description", displayPath.description ?? "");
    const nextStartDate = window.prompt(
      "Update start date (YYYY-MM-DD)",
      displayPath.startDate ?? ""
    );
    const nextTargetDate = window.prompt(
      "Update target date (YYYY-MM-DD)",
      displayPath.targetEndDate ?? ""
    );
    setUpdatingPath(true);
    setStatus(null);
    try {
      const updated = await updatePath(pathId, {
        title: nextTitle.trim(),
        description: nextDescription?.trim() || undefined,
        startDate: nextStartDate?.trim() || displayPath.startDate,
        targetEndDate: nextTargetDate?.trim() || displayPath.targetEndDate
      });
      setPathDetails((prev) => (prev ? { ...prev, ...updated } : updated));
      setPaths((prev) =>
        prev.map((p) => (String(p.id) === String(pathId) ? { ...p, ...updated } : p))
      );
      setStatus({ tone: "success", text: "Path updated." });
    } catch (error) {
      setStatus({ tone: "error", text: surfaceError(error) });
    } finally {
      setUpdatingPath(false);
    }
  };

  const handleEditSection = async (section: SectionResponse) => {
    if (!pathId) {
      return;
    }
    const titleInput = window.prompt("Update section title", section.title ?? "");
    if (titleInput === null || !titleInput.trim()) {
      return;
    }
    const descriptionInput = window.prompt("Update section description", section.description ?? "");
    const orderInput = window.prompt(
      "Order index",
      section.orderIndex !== undefined ? String(section.orderIndex) : ""
    );
    const daysInput = window.prompt(
      "Estimated days",
      section.estimatedDays !== undefined ? String(section.estimatedDays) : ""
    );
    setUpdatingSectionId(section.id);
    setStatus(null);
    try {
      const updated = await updateSection(pathId, section.id, {
        title: titleInput.trim(),
        description: descriptionInput?.trim() || undefined,
        orderIndex: orderInput ? Number(orderInput) : section.orderIndex,
        estimatedDays: daysInput ? Number(daysInput) : section.estimatedDays
      });
      setPathDetails((prev) => (prev ? replaceSectionOnPath(prev, updated) : prev));
      setPaths((prev) =>
        prev.map((p) => (String(p.id) === String(pathId) ? replaceSectionOnPath(p, updated) : p))
      );
      setStatus({ tone: "success", text: "Section updated." });
    } catch (error) {
      setStatus({ tone: "error", text: surfaceError(error) });
    } finally {
      setUpdatingSectionId(null);
    }
  };

  const handleEditTask = async (section: SectionResponse, task: TaskResponse) => {
    if (!pathId) {
      return;
    }
    if (!Array.isArray(section.tasks)) {
      setStatus({ tone: "error", text: "Tasks not loaded from the server yet. Please retry later." });
      return;
    }
    const titleInput = window.prompt("Update task title", task.title ?? "");
    if (titleInput === null || !titleInput.trim()) {
      return;
    }
    const statusInput = window.prompt(
      "Update task status (NOT_STARTED, IN_PROGRESS, COMPLETED, SKIPPED)",
      task.status ?? "NOT_STARTED"
    );
    const durationInput = window.prompt(
      "Estimated minutes",
      task.estimatedMinutes !== undefined ? String(task.estimatedMinutes) : ""
    );
    if (!statusInput) {
      return;
    }
    const normalizedStatus = statusInput.trim().toUpperCase() as TaskStatus;
    const nextStatus: TaskStatus = ["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "SKIPPED"].includes(
      normalizedStatus
    )
      ? normalizedStatus
      : "NOT_STARTED";
    setUpdatingTask({ sectionId: section.id, taskId: task.id });
    setStatus(null);
    try {
      const updated = await updateTask(pathId, section.id, task.id, {
        title: titleInput.trim(),
        description: task.description,
        status: nextStatus,
        type: nextStatus,
        estimatedMinutes: durationInput ? Number(durationInput) : task.estimatedMinutes
      });
      setPathDetails((prev) => (prev ? replaceTaskOnPath(prev, section.id, updated) : prev));
      setPaths((prev) =>
        prev.map((p) => (String(p.id) === String(pathId) ? replaceTaskOnPath(p, section.id, updated) : p))
      );
      setStatus({ tone: "success", text: "Task updated." });
    } catch (error) {
      setStatus({ tone: "error", text: surfaceError(error) });
    } finally {
      setUpdatingTask(null);
    }
  };

  const handleTaskStatusChange = async (
    section: SectionResponse,
    task: TaskResponse,
    nextStatus: TaskStatus
  ) => {
    if (!pathId) {
      return;
    }
    if (!Array.isArray(section.tasks)) {
      setStatus({ tone: "error", text: "Tasks not loaded from the server yet. Please retry later." });
      return;
    }
    if (task.status === nextStatus) {
      return;
    }
    setUpdatingTask({ sectionId: section.id, taskId: task.id });
    setStatus(null);
    try {
      const updated = await updateTask(pathId, section.id, task.id, {
        title: task.title,
        description: task.description,
        status: nextStatus,
        type: nextStatus,
        estimatedMinutes: task.estimatedMinutes
      });
      setPathDetails((prev) => (prev ? replaceTaskOnPath(prev, section.id, updated) : prev));
      setPaths((prev) =>
        prev.map((p) => (String(p.id) === String(pathId) ? replaceTaskOnPath(p, section.id, updated) : p))
      );
      const message = nextStatus === "COMPLETED" ? "Task completed." : "Task started.";
      setStatus({ tone: "success", text: message });
    } catch (error) {
      setStatus({ tone: "error", text: surfaceError(error) });
    } finally {
      setUpdatingTask(null);
    }
  };

  return (
    <div className="dashboard-shell">
      <AppHeader chipLabel="Path Detail" />

      <main className="dashboard-body detail-layout">
        {status && <p className={`form-status ${status.tone === "error" ? "error" : "success"}`}>{status.text}</p>}

        <section className="welcome-card path-hero">
          <div className="path-hero-headline">
            <div>
              <h1>{heroTitle}</h1>
              <p>{heroDescription}</p>
            </div>
            <div className="hero-actions">
              <Link to={`/paths/${pathId}/sections/create`} className="primary-button soft button-link">
                <span>+</span> Add Section
              </Link>
              <button
                className="outline-button button-link"
                type="button"
                onClick={handleEditPath}
                disabled={updatingPath}
              >
                {updatingPath ? "Saving..." : "Edit Path"}
              </button>
              <button className="danger-button pill" onClick={handleDeletePath} disabled={deletingPath}>
                {deletingPath ? "Deleting..." : "Delete Path"}
              </button>
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${Math.round(pathProgress * 100)}%` }} />
          </div>
          <div className="progress-footer">
            <span> </span>
            <span className="progress-label">{Math.round(pathProgress * 100)}% Complete</span>
          </div>
        </section>

        <section className="sections-stack">
          {sections.map((section) => {
            const sectionProgress = calculateSectionProgress(section);
            const editingSection = String(updatingSectionId ?? "") === String(section.id);
            return (
              <article key={section.id} className="section-panel">
                <header className="section-header">
                  <div className="section-title">
                    <h2>{section.title}</h2>
                    <div className="section-progress meter">
                      <div className="section-progress-track">
                        <div className="section-progress-bar" style={{ width: `${Math.round(sectionProgress * 100)}%` }} />
                      </div>
                      <span>{Math.round(sectionProgress * 100)}% Complete</span>
                    </div>
                  </div>
                  <div className="section-actions">
                    <Link
                      to={`/paths/${pathId}/sections/${section.id}/tasks/create`}
                      className="section-action-text button-link"
                    >
                      <span>+</span> Task
                    </Link>
                    <button
                      className="section-icon-button"
                      aria-label="Edit section"
                      onClick={() => handleEditSection(section)}
                      disabled={editingSection}
                    >
                      {editingSection ? "..." : "Edit"}
                    </button>
                    <button
                      className="section-icon-button"
                      aria-label="Delete section"
                      onClick={() => handleDeleteSection(section.id)}
                      disabled={String(deletingSectionId ?? "") === String(section.id)}
                    >
                      {String(deletingSectionId ?? "") === String(section.id) ? "..." : "Delete"}
                    </button>
                    <button className="section-icon-button" aria-label="Reorder section">
                      Reorder
                    </button>
                    <button className="section-icon-button" aria-label="Collapse section">
                      Collapse
                    </button>
                  </div>
                </header>

                <div className="tasks-list">
                  {(Array.isArray(section.tasks) ? section.tasks : []).map((task) => {
                    const friendlyStatus = formatTaskStatus(task.status);
                    const deletingCurrentTask =
                      deletingTask &&
                      String(deletingTask.sectionId) === String(section.id) &&
                      String(deletingTask.taskId) === String(task.id);
                    const editingCurrentTask =
                      updatingTask &&
                      String(updatingTask.sectionId) === String(section.id) &&
                      String(updatingTask.taskId) === String(task.id);
                    return (
                      <div key={task.id} className="task-row">
                        <div className="task-info">
                          <input type="checkbox" checked={task.status === "COMPLETED"} readOnly />
                          <div>
                            <p>{task.title}</p>
                            <span className={`status-pill ${friendlyStatus.replace(" ", "").toLowerCase()}`}>
                              {friendlyStatus}
                            </span>
                          </div>
                        </div>
                        <div className="task-controls">
                          <button
                            className="task-chip"
                            onClick={() => handleTaskStatusChange(section, task, "IN_PROGRESS")}
                            disabled={editingCurrentTask || task.status === "IN_PROGRESS" || task.status === "COMPLETED"}
                          >
                            {editingCurrentTask ? "..." : "Start"}
                          </button>
                          <button
                            className="task-chip success"
                            onClick={() => handleTaskStatusChange(section, task, "COMPLETED")}
                            disabled={editingCurrentTask || task.status === "COMPLETED"}
                          >
                            {editingCurrentTask ? "..." : "End"}
                          </button>
                          <button
                            className="task-icon-button"
                            onClick={() => handleEditTask(section, task)}
                            disabled={editingCurrentTask}
                          >
                            {editingCurrentTask ? "..." : "Edit"}
                          </button>
                          <button
                            className="task-icon-button"
                            onClick={() => handleDeleteTask(section.id, task.id)}
                            disabled={deletingCurrentTask}
                          >
                            {deletingCurrentTask ? "..." : "Delete"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </section>
      </main>

      <footer className="dashboard-footer">Ac {new Date().getFullYear()} Path Progress. All rights reserved.</footer>
    </div>
  );
}

function surfaceError(error: unknown) {
  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message?: string }).message ?? "Something went wrong.");
  }
  return "Unable to complete that action right now.";
}

function buildFallbackSections(targetId?: Identifier | string | null): SectionResponse[] {
  const mockPath = mockedPaths.find((mock) => String(mock.id) === String(targetId)) ?? mockedPaths[0];
  if (!mockPath) {
    return [];
  }
  return mockPath.sections.map<SectionResponse>((section) => ({
    id: section.id,
    title: section.title,
    description: "",
    orderIndex: section.plannedHours,
    estimatedDays: section.targetDays,
    status: "IN_PROGRESS",
    tasks: section.tasks.map((task) => ({
      id: task.id,
      title: task.title,
      status: mockStatusToApiStatus(task.status),
      type: mockStatusToApiStatus(task.status),
      estimatedMinutes: Math.round(task.estimatedHours * 60)
    }))
  }));
}

function mockStatusToApiStatus(status: "Done" | "In Progress" | "To Do"): TaskStatus {
  switch (status) {
    case "Done":
      return "COMPLETED";
    case "In Progress":
      return "IN_PROGRESS";
    default:
      return "NOT_STARTED";
  }
}

function calculateSectionProgress(section: SectionResponse): number {
  const tasks = Array.isArray(section.tasks) ? section.tasks : [];
  if (tasks.length === 0) {
    return 0;
  }
  const completed = tasks.filter((task) => task.status === "COMPLETED").length;
  return completed / tasks.length;
}

function calculatePathProgress(path: PathResponse | null, sections: SectionResponse[]): number {
  if (sections.length === 0) {
    if (!path) {
      return 0;
    }
    if (path.status === "COMPLETED") {
      return 1;
    }
    if (path.status === "IN_PROGRESS") {
      return 0.5;
    }
    return 0.1;
  }
  const allTasks = sections.flatMap((section) => (Array.isArray(section.tasks) ? section.tasks : []));
  if (allTasks.length === 0) {
    return 0;
  }
  const completed = allTasks.filter((task) => task.status === "COMPLETED").length;
  return completed / allTasks.length;
}

function replaceSectionOnPath(path: PathResponse, updatedSection: SectionResponse) {
  const sections = path.sections ?? [];
  const index = sections.findIndex((section) => String(section.id) === String(updatedSection.id));
  if (index === -1) {
    return { ...path, sections: [...sections, updatedSection] };
  }
  const next = [...sections];
  next[index] = { ...sections[index], ...updatedSection };
  return { ...path, sections: next };
}

function replaceTaskOnPath(path: PathResponse, sectionId: Identifier, updatedTask: TaskResponse) {
  const sections = (path.sections ?? []).map((section) => {
    if (String(section.id) !== String(sectionId)) {
      return section;
    }
    const tasks = Array.isArray(section.tasks) ? section.tasks : [];
    const taskIndex = tasks.findIndex((task) => String(task.id) === String(updatedTask.id));
    if (taskIndex === -1) {
      return { ...section, tasks: [...tasks, updatedTask] };
    }
    const nextTasks = [...tasks];
    nextTasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask };
    return { ...section, tasks: nextTasks };
  });
  return { ...path, sections };
}

function removeSectionFromPath(path: PathResponse, sectionId: Identifier) {
  const remaining = (path.sections ?? []).filter((section) => String(section.id) !== String(sectionId));
  return { ...path, sections: remaining };
}

function removeTaskFromPath(path: PathResponse, sectionId: Identifier, taskId: Identifier) {
  const updatedSections = (path.sections ?? []).map((section) => {
    if (String(section.id) !== String(sectionId)) {
      return section;
    }
    const tasks = Array.isArray(section.tasks) ? section.tasks : [];
    const remainingTasks = tasks.filter((task) => String(task.id) !== String(taskId));
    return { ...section, tasks: remainingTasks };
  });
  return { ...path, sections: updatedSections };
}

function formatTaskStatus(status?: TaskStatus) {
  switch (status) {
    case "COMPLETED":
      return "Done";
    case "IN_PROGRESS":
      return "In Progress";
    case "SKIPPED":
      return "Skipped";
    default:
      return "To Do";
  }
}
