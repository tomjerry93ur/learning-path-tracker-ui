import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../App.css";
import { createPath } from "../api/paths";
import { usePaths } from "../context/PathsContext";
import AppHeader from "../components/AppHeader";

export default function CreatePathPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    difficulty: "Beginner",
    startDate: "",
    targetEndDate: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { setPaths } = usePaths();
  const notice = typeof location.state === "object" && location.state && "notice" in location.state ? String(location.state.notice) : null;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.startDate || !form.targetEndDate) {
      setMessage({ tone: "error", text: "Please provide both start and target dates." });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const created = await createPath({
        title: form.title.trim(),
        description: form.description.trim(),
        startDate: form.startDate,
        targetEndDate: form.targetEndDate
      });
      setPaths((prev) => [...prev, created]);
      setMessage({ tone: "success", text: "Path created successfully!" });
      if (created.id) {
        navigate(`/paths/${created.id}`);
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      const text =
        typeof error === "object" && error !== null && "message" in error
          ? String((error as { message?: string }).message ?? "Unable to create path right now.")
          : "Unable to create path right now.";
      setMessage({ tone: "error", text });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-shell">
      <AppHeader chipLabel="Create Path" />

      <main className="dashboard-body">
        <section className="create-path-card">
          {notice && <div className="notice-banner">{notice}</div>}
          <div className="create-header">
            <h1>Create New Path</h1>
            <p>Define the core details of your learning or project path.</p>
          </div>
          <form id="create-path-form" className="create-form" onSubmit={handleSubmit}>
            <label>
              Path Name <span className="required">*</span>
              <input
                placeholder="e.g., Learn React Basics"
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
                required
              />
            </label>
            <label>
              Short Description
              <input
                placeholder="A concise summary of what this path covers."
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
              />
            </label>
            <div className="field-row">
              <label>
                Difficulty Level <span className="optional">(Optional)</span>
                <select
                  value={form.difficulty}
                  onChange={(event) => setForm({ ...form, difficulty: event.target.value })}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </label>
              <label>
                Start Date
                <input type="date" value={form.startDate} onChange={(event) => setForm({ ...form, startDate: event.target.value })} />
              </label>
              <label>
                Target Date
                <input
                  type="date"
                  value={form.targetEndDate}
                  onChange={(event) => setForm({ ...form, targetEndDate: event.target.value })}
                />
              </label>
            </div>

            <label>
              Cover Image <span className="optional">(Optional)</span>
              <div className="dropzone">
                <div className="dropzone-icon">⬆</div>
                <p>
                  Drag & drop your cover image here, or <button type="button">browse files</button>
                </p>
              </div>
            </label>
            {message && (
              <p className={`form-status ${message.tone === "error" ? "error" : "success"}`}>{message.text}</p>
            )}
          </form>

          <div className="create-actions">
            <Link to="/dashboard" className="ghost-button">
              Cancel
            </Link>
            <button className="primary-button large" type="submit" form="create-path-form" disabled={loading}>
              {loading ? "Creating..." : "Create Path"}
            </button>
          </div>
        </section>
      </main>

      <footer className="dashboard-footer">© {new Date().getFullYear()} Path Progress. All rights reserved.</footer>
    </div>
  );
}
