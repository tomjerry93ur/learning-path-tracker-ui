import { FormEvent, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../App.css";
import AppHeader from "../components/AppHeader";

export default function CreateTaskPage() {
  const { id, sectionId } = useParams();
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "To Do",
    day: "",
    hours: ""
  });
  const [message, setMessage] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setMessage({ tone: "success", text: "Task saved. Wire to API when ready." });
      navigate(`/paths/${id}`);
    }, 800);
  };

  return (
    <div className="dashboard-shell">
      <AppHeader chipLabel="Create Task" />

      <main className="dashboard-body">
        <section className="create-path-card">
          <div className="create-header">
            <h1>Create Task</h1>
            <p>Add a new task to this section.</p>
          </div>
          <form id="create-task-form" className="create-form" onSubmit={handleSubmit}>
            <label>
              Task Title <span className="required">*</span>
              <input
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
                placeholder="e.g., Setup development environment"
                required
              />
            </label>
            <label>
              Description
              <input
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                placeholder="What should happen in this task?"
              />
            </label>
            <div className="field-row">
              <label>
                Day #
                <input
                  type="number"
                  value={form.day}
                  onChange={(event) => setForm({ ...form, day: event.target.value })}
                  placeholder="e.g., 2"
                />
              </label>
              <label>
                Estimated Hours
                <input
                  type="number"
                  value={form.hours}
                  onChange={(event) => setForm({ ...form, hours: event.target.value })}
                  placeholder="e.g., 1.5"
                />
              </label>
            </div>
            <label>
              Status
              <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
                <option>To Do</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>
            </label>
            {message && <p className={`form-status ${message.tone === "error" ? "error" : "success"}`}>{message.text}</p>}
          </form>
          <div className="create-actions">
            <Link to={`/paths/${id}`} className="ghost-button">
              Cancel
            </Link>
            <button className="primary-button large" type="submit" form="create-task-form" disabled={loading}>
              {loading ? "Saving..." : "Create Task"}
            </button>
          </div>
        </section>
      </main>

      <footer className="dashboard-footer">© {new Date().getFullYear()} Path Progress. All rights reserved.</footer>
    </div>
  );
}
