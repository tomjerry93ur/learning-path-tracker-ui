import axios from "axios";
import { notifyUnauthorized } from "../utils/authEvents";

export const apiClient = axios.create({
  // baseURL: "https://path-tracker-production.up.railway.app/api",
  baseURL: "http://localhost:9090/api",
  timeout: 5000
});

let currentToken: string | null = null;

export function setAuthToken(token: string | null) {
  currentToken = token;

  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
}

export function getAuthToken() {
  return currentToken;
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      notifyUnauthorized();
    }
    return Promise.reject(error);
  }
);
