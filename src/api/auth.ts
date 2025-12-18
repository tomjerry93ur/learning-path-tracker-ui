import { apiClient } from "./client";

export interface AuthPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export async function login(payload: AuthPayload): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>("/auth/login", payload);
  return response.data;
}

export type RegisterResponseData =
  | string
  | { response?: string; message?: string };

export async function register(payload: AuthPayload): Promise<string> {
  const response = await apiClient.post<RegisterResponseData>("/auth/register", payload);
  const data = response.data;

  if (typeof data === "string") {
    return data;
  }
  return data.message ?? data.response ?? "Successfully registered. Please log in.";
}
