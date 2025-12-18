import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { setAuthToken } from "../api/client";
import { setUnauthorizedHandler } from "../utils/authEvents";

type AuthContextValue = {
  token: string | null;
  user: { username: string } | null;
  login: (token: string, username: string) => void;
  logout: (reason?: string) => void;
  forceLogout: () => void;
  isAuthenticated: boolean;
  authMessage: string | null;
  clearMessage: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = "pp_token";
const USER_KEY = "pp_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<{ username: string } | null>(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });
  const [authMessage, setAuthMessage] = useState<string | null>(null);

  useEffect(() => {
    setAuthToken(token);
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      logout("Session expired. Please log in again.");
    });
    return () => {
      setUnauthorizedHandler(null);
    };
  }, []);

  const login = useCallback((newToken: string, username: string) => {
    setToken(newToken);
    setUser({ username });
    setAuthMessage(null);
  }, []);

  const logout = useCallback((reason?: string) => {
    setToken(null);
    setUser(null);
    if (reason) {
      setAuthMessage(reason);
    } else {
      setAuthMessage(null);
    }
  }, []);

  const forceLogout = useCallback(() => {
    setToken(null);
    setUser(null);
    setAuthMessage(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      login,
      logout,
      forceLogout,
      isAuthenticated: Boolean(token),
      authMessage,
      clearMessage: () => setAuthMessage(null)
    }),
    [token, user, authMessage, login, logout, forceLogout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
