import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, authMessage } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    const state = authMessage ? { reason: authMessage, from: location.pathname } : { from: location.pathname };
    return <Navigate to="/login" replace state={state} />;
  }

  return children;
}
