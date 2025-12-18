import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import { register as registerUser } from "../api/auth";

export default function RegisterPage() {
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ tone: "error" | "success"; text: string } | null>(null);
  const navigate = useNavigate();

  const surfaceError = (err: unknown) => {
    if (typeof err === "object" && err !== null && "message" in err) {
      return String((err as { message?: string }).message ?? "Something went wrong");
    }
    return "Unable to reach the server right now.";
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (form.password !== form.confirm) {
      setStatus({ tone: "error", text: "Passwords do not match." });
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      await registerUser({ username: form.username.trim(), password: form.password });
      navigate("/register/success", { state: { username: form.username.trim() } });
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
        <div className="brand-chip">Path Progress</div>
        <h1>Create Your Account</h1>
        <p>Start your journey with PathProgress.</p>
        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            placeholder="Enter your username"
            value={form.username}
            onChange={(event) => setForm({ ...form, username: event.target.value })}
            required
          />
          <label>Email</label>
          <input
            type="email"
            placeholder="your@email.com"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            required
          />
          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            required
          />
          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={form.confirm}
            onChange={(event) => setForm({ ...form, confirm: event.target.value })}
            required
          />
          {status && (
            <p className={`form-status ${status.tone === "error" ? "error" : "success"}`}>{status.text}</p>
          )}
          <button type="submit" className="primary-button full-width" disabled={loading}>
            Create Account
          </button>
        </form>
        <p className="auth-footnote">
          Already have an account?
          <Link to="/login" className="inline-link">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
