import { demoCredentials } from "../data/mockData";
import { apiClient } from "./client";

const DEMO_DELAY = 400;

function simulateDelay<T>(value: T) {
  return new Promise<T>((resolve) => setTimeout(() => resolve(value), DEMO_DELAY));
}

function isServerResponseError(error: unknown): error is { response?: unknown } {
  return typeof error === "object" && error !== null && "response" in error;
}

export interface AuthPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export async function login(payload: AuthPayload): Promise<LoginResponse> {
  const normalizedUsername = payload.username.trim().toLowerCase();
  const demoUser = demoCredentials.find(
    (cred) => cred.username.toLowerCase() === normalizedUsername && cred.password === payload.password
  );

  if (demoUser) {
    return simulateDelay({ token: demoUser.token });
  }

  try {
    const response = await apiClient.post<LoginResponse>("/auth/login", payload);
    return response.data;
  } catch (error) {
    if (isServerResponseError(error)) {
      throw error;
    }
    throw new Error("Unable to reach the auth service. Use one of the demo accounts listed on the login page.");
  }
}

export type RegisterResponseData =
  | string
  | { response?: string; message?: string };

export async function register(payload: AuthPayload): Promise<string> {
  try {
    const response = await apiClient.post<RegisterResponseData>("/auth/register", payload);
    const data = response.data;

    if (typeof data === "string") {
      return data;
    }
    return data.message ?? data.response ?? "Successfully registered. Please log in.";
  } catch (error) {
    if (isServerResponseError(error)) {
      throw error;
    }
    return simulateDelay("Demo registration complete! Use the credentials shown on the login page to continue.");
  }
}
