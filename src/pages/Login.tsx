import { FormEvent, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../App.css";
import { login } from "../api/auth";
import { fetchPaths } from "../api/paths";
import { usePaths } from "../context/PathsContext";
import { useAuth } from "../context/AuthContext";
import { demoCredentials } from "../data/mockData";

export default function LoginPage() {
  const [form, setForm] = useState({ identifier: "", password: "", remember: false });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ tone: "error" | "success"; text: string } | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { setPaths, resetPaths } = usePaths();
  const { login: authenticate, authMessage, clearMessage, forceLogout } = useAuth();
  const routeMessage = (location.state as { reason?: string } | null)?.reason;

  useEffect(() => {
    forceLogout();
    resetPaths();
  }, [forceLogout, resetPaths]);

  useEffect(() => {
    if (authMessage) {
      setStatus({ tone: "error", text: authMessage });
      clearMessage();
    } else if (routeMessage) {
      setStatus({ tone: "error", text: routeMessage });
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [authMessage, clearMessage, location.pathname, navigate, routeMessage]);

  const surfaceError = (err: unknown) => {
    if (typeof err === "object" && err !== null && "message" in err) {
      return String((err as { message?: string }).message ?? "Something went wrong");
    }
    return "Unable to reach the server right now.";
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const response = await login({ username: form.identifier.trim(), password: form.password });
      authenticate(response.accessToken, form.identifier.trim());
      const { paths: pathList } = await fetchPaths();
      setPaths(pathList);
      setStatus({ tone: "success", text: "Logged in successfully." });
      if (pathList.length === 0) {
        navigate("/paths/create", {
          state: { notice: "You have no learning paths created. Please create one." }
        });
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setStatus({ tone: "error", text: surfaceError(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="auth-shell-head">
          <Link to="/" className="back-link" aria-label="Back to home">
            ← Back to Home
          </Link>
        </div>
        <h1>Login</h1>
        <p>Enter your credentials to access your learning paths.</p>
        <form onSubmit={handleSubmit}>
          <label>Email or Username</label>
          <input
            type="text"
            placeholder="user@example.com"
            value={form.identifier}
            onChange={(event) => setForm({ ...form, identifier: event.target.value })}
            required
          />
          <div className="field-row">
            <label>Password</label>
            <Link to="/forgot" className="inline-link">
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            required
          />
          <label className="checkbox-field">
            <input
              type="checkbox"
              checked={form.remember}
              onChange={(event) => setForm({ ...form, remember: event.target.checked })}
            />
            <span>Remember me</span>
          </label>
          {status && (
            <p className={`form-status ${status.tone === "error" ? "error" : "success"}`}>{status.text}</p>
          )}
          <button type="submit" className="primary-button full-width" disabled={loading}>
            Login
          </button>
        </form>
        <p className="auth-footnote">
          Don&apos;t have an account?
          <Link to="/register" className="inline-link">
            Register
          </Link>
        </p>
        <section className="demo-accounts">
          <div className="demo-accounts-headline">
            <h2>Demo Accounts</h2>
            <p>Use any of these if the backend is offline.</p>
          </div>
          <div className="demo-accounts-grid">
            {demoCredentials.map((account) => (
              <article key={account.id} className="demo-account-card">
                <p className="demo-account-label">{account.label}</p>
                <p className="demo-account-username">{account.username}</p>
                <p className="demo-account-password">
                  Password: <span>{account.password}</span>
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
