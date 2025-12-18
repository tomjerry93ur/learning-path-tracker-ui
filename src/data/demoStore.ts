import { PathPayload, PathResponse, PathStatus } from "../types/paths";
import { mockedPaths } from "./mockData";

const DEMO_STORAGE_KEY = "demo_paths";

const fallbackPaths: PathResponse[] = mockedPaths.map((path, index) => {
  const start = offsetFromToday(index * -10);
  const end = offsetFromToday(index * -10 + 30);
  return {
    id: path.id,
    title: path.name,
    description: path.description,
    startDate: formatDate(start),
    targetEndDate: formatDate(end),
    status: deriveStatus(path.overallProgress)
  };
});

function deriveStatus(progress: number): PathStatus {
  if (progress >= 1) {
    return "COMPLETED";
  }
  if (progress > 0) {
    return "IN_PROGRESS";
  }
  return "NOT_STARTED";
}

function offsetFromToday(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

function formatDate(date: Date) {
  return date.toISOString().split("T")[0] ?? "";
}

function readStoredPaths(): PathResponse[] | null {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return null;
  }
  const raw = localStorage.getItem(DEMO_STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    // ignore JSON parse issues and reset the store
  }
  return null;
}

function persist(paths: PathResponse[]) {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return;
  }
  localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(paths));
}

function getCurrentPaths(): PathResponse[] {
  const stored = readStoredPaths();
  if (stored && stored.length > 0) {
    return stored;
  }
  persist(fallbackPaths);
  return fallbackPaths;
}

export function getDemoPaths(): PathResponse[] {
  return getCurrentPaths();
}

export function addDemoPath(payload: PathPayload): PathResponse {
  const nextPath: PathResponse = {
    id: `demo-${Date.now()}`,
    title: payload.title,
    description: payload.description || "No description yet.",
    startDate: payload.startDate || formatDate(new Date()),
    targetEndDate: payload.targetEndDate || payload.startDate || formatDate(offsetFromToday(30)),
    status: "NOT_STARTED"
  };
  const existing = getCurrentPaths();
  const updated = [...existing, nextPath];
  persist(updated);
  return nextPath;
}

export function resetDemoPaths() {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return;
  }
  localStorage.removeItem(DEMO_STORAGE_KEY);
}
