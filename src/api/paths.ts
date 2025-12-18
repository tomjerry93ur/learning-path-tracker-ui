import { apiClient } from "./client";

export type PathStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

export interface PathResponse {
  id?: number;
  title: string;
  description: string;
  startDate: string;
  targetEndDate: string;
  status: PathStatus;
}

export interface PathPayload {
  title: string;
  description: string;
  startDate: string;
  targetEndDate: string;
}

export async function createPath(payload: PathPayload): Promise<PathResponse> {
  const response = await apiClient.post<PathResponse>("/paths", payload);
  return response.data;
}

export async function fetchPaths(): Promise<PathResponse[]> {
  const response = await apiClient.get<PathResponse[]>("/paths");
  return response.data;
}
