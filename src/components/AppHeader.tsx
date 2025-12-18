import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePaths } from "../context/PathsContext";

export default function AppHeader({ chipLabel }: { chipLabel: string }) {
  const { user, logout } = useAuth();
  const { resetPaths } = usePaths();
  const navigate = useNavigate();

  const handleLogout = () => {
    resetPaths();
    logout("You have been logged out.");
    navigate("/login", { replace: true, state: { reason: "You have been logged out." } });
  };

  return (
    <header className="app-bar">
      <div className="brand-block">
        <Link to="/dashboard" className="brand-link">
          Path Progress
        </Link>
        <span className="brand-chip-muted">{chipLabel}</span>
      </div>
      <div className="bar-actions">
        <div className="user-chip">{user?.username?.slice(0, 2).toUpperCase() ?? "JD"}</div>
        <button className="ghost-button logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
