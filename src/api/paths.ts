import { getDemoPaths, addDemoPath } from "../data/demoStore";
import { PathPayload, PathResponse } from "../types/paths";
import { apiClient } from "./client";

function simulateDelay<T>(value: T, timeout = 400) {
  return new Promise<T>((resolve) => setTimeout(() => resolve(value), timeout));
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

export async function fetchPaths(): Promise<PathResponse[]> {
  try {
    const response = await apiClient.get<PathResponse[]>("/paths");
    return response.data;
  } catch (error) {
    console.warn("fetchPaths falling back to demo data. Reason:", error);
    return simulateDelay(getDemoPaths());
  }
}
