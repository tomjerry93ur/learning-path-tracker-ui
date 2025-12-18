import { FormEvent, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../App.css";
import AppHeader from "../components/AppHeader";

export default function CreateSectionPage() {
  const { id } = useParams();
  const [form, setForm] = useState({
    title: "",
    description: "",
    targetDays: "",
    plannedHours: ""
  });
  const [message, setMessage] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setMessage({ tone: "success", text: "Section saved. Hook up API when ready." });
      navigate(`/paths/${id}`);
    }, 800);
  };

  return (
    <div className="dashboard-shell">
      <AppHeader chipLabel="Create Section" />

      <main className="dashboard-body">
        <section className="create-path-card">
          <div className="create-header">
            <h1>Create Section</h1>
            <p>Add a new section to this path.</p>
          </div>
          <form id="create-section-form" className="create-form" onSubmit={handleSubmit}>
            <label>
              Section Name <span className="required">*</span>
              <input
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
                placeholder="e.g., React Fundamentals"
                required
              />
            </label>
            <label>
              Description
              <input
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                placeholder="What will this section cover?"
              />
            </label>
            <div className="field-row">
              <label>
                Target Days
                <input
                  type="number"
                  value={form.targetDays}
                  onChange={(event) => setForm({ ...form, targetDays: event.target.value })}
                  placeholder="e.g., 4"
                />
              </label>
              <label>
                Planned Hours
                <input
                  type="number"
                  value={form.plannedHours}
                  onChange={(event) => setForm({ ...form, plannedHours: event.target.value })}
                  placeholder="e.g., 8"
                />
              </label>
            </div>
            {message && <p className={`form-status ${message.tone === "error" ? "error" : "success"}`}>{message.text}</p>}
          </form>
          <div className="create-actions">
            <Link to={`/paths/${id}`} className="ghost-button">
              Cancel
            </Link>
            <button className="primary-button large" type="submit" form="create-section-form" disabled={loading}>
              {loading ? "Saving..." : "Create Section"}
            </button>
          </div>
        </section>
      </main>

      <footer className="dashboard-footer">© {new Date().getFullYear()} Path Progress. All rights reserved.</footer>
    </div>
  );
}
