import { getDemoPaths, addDemoPath } from "../data/demoStore";
import {
  PathPayload,
  PathResponse,
  SectionPayload,
  SectionResponse,
  TaskPayload,
  TaskResponse,
  LearningPathDashboard,
  Identifier
} from "../types/paths";
import { apiClient } from "./client";

function simulateDelay<T>(value: T, timeout = 400) {
  return new Promise<T>((resolve) => setTimeout(() => resolve(value), timeout));
}

type PathCollectionResponse = PathResponse[] | LearningPathDashboard | undefined;

export interface FetchPathsResult {
  paths: PathResponse[];
  analytics?: LearningPathDashboard;
}

function normalizePathCollection(data: PathCollectionResponse): PathResponse[] {
  if (!data) {
    return [];
  }
  if (Array.isArray(data)) {
    return data;
  }
  if (Array.isArray(data.learningPaths)) {
    return data.learningPaths;
  }
  return [];
}

function extractAnalytics(data: PathCollectionResponse): LearningPathDashboard | undefined {
  if (!data || Array.isArray(data)) {
    return undefined;
  }
  return data;
}

function buildPathUrl(pathId: Identifier) {
  return `/paths/${pathId}`;
}

function buildSectionUrl(pathId: Identifier, sectionId?: Identifier) {
  return sectionId ? `${buildPathUrl(pathId)}/sections/${sectionId}` : `${buildPathUrl(pathId)}/sections`;
}

function buildTaskUrl(pathId: Identifier, sectionId: Identifier, taskId?: Identifier) {
  const base = `${buildSectionUrl(pathId, sectionId)}/tasks`;
  return taskId ? `${base}/${taskId}` : base;
}

export async function createPath(payload: PathPayload): Promise<PathResponse> {
  try {
    const response = await apiClient.post<PathResponse>("/paths", payload);
    return response.data;
  } catch (error) {
    console.warn("createPath falling back to demo data. Reason:", error);
    return simulateDelay(addDemoPath(payload));
  }
}

export async function fetchPaths(): Promise<FetchPathsResult> {
  try {
    const response = await apiClient.get<PathCollectionResponse>("/paths");
    return {
      paths: normalizePathCollection(response.data),
      analytics: extractAnalytics(response.data)
    };
  } catch (error) {
    console.warn("fetchPaths falling back to demo data. Reason:", error);
    return simulateDelay({ paths: getDemoPaths(), analytics: undefined });
  }
}

export async function getPath(pathId: Identifier): Promise<PathResponse> {
  const response = await apiClient.get<PathResponse>(buildPathUrl(pathId));
  return response.data;
}

export async function updatePath(pathId: Identifier, payload: PathPayload): Promise<PathResponse> {
  const response = await apiClient.put<PathResponse>(buildPathUrl(pathId), payload);
  return response.data;
}

export async function deletePath(pathId: Identifier): Promise<void> {
  await apiClient.delete(buildPathUrl(pathId));
}

export async function createSection(pathId: Identifier, payload: SectionPayload): Promise<SectionResponse> {
  const response = await apiClient.post<SectionResponse>(buildSectionUrl(pathId), payload);
  return response.data;
}

export async function updateSection(
  pathId: Identifier,
  sectionId: Identifier,
  payload: SectionPayload
): Promise<SectionResponse> {
  const response = await apiClient.put<SectionResponse>(buildSectionUrl(pathId, sectionId), payload);
  return response.data;
}

export async function deleteSection(pathId: Identifier, sectionId: Identifier): Promise<void> {
  await apiClient.delete(buildSectionUrl(pathId, sectionId));
}

export async function createTask(
  pathId: Identifier,
  sectionId: Identifier,
  payload: TaskPayload
): Promise<TaskResponse> {
  const response = await apiClient.post<TaskResponse>(buildTaskUrl(pathId, sectionId), payload);
  return response.data;
}

export async function updateTask(
  pathId: Identifier,
  sectionId: Identifier,
  taskId: Identifier,
  payload: TaskPayload
): Promise<TaskResponse> {
  const response = await apiClient.put<TaskResponse>(buildTaskUrl(pathId, sectionId, taskId), payload);
  return response.data;
}

export async function deleteTask(pathId: Identifier, sectionId: Identifier, taskId: Identifier): Promise<void> {
  await apiClient.delete(buildTaskUrl(pathId, sectionId, taskId));
}
