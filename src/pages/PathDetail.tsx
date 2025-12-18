import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../App.css";
import { usePaths } from "../context/PathsContext";
import { fetchPaths } from "../api/paths";
import { mockedPaths } from "../data/mockData";
import AppHeader from "../components/AppHeader";

export default function PathDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { paths, setPaths } = usePaths();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const path = useMemo(() => paths.find((p) => String(p.id) === id), [paths, id]);
  const pathId = path?.id ?? "";

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const result = await fetchPaths();
        setPaths(result);
      } finally {
        setLoading(false);
      }
    };
    if (!path) {
      load().catch(() => setLoading(false));
    }
  }, [path, setPaths]);

  const sectionData = useMemo(() => {
    const targetId = path?.id ?? id;
    const matched = mockedPaths.find((mockPath) => String(mockPath.id) === String(targetId));
    return matched?.sections ?? mockedPaths[0]?.sections ?? [];
  }, [id, path?.id]);

  if (!path && loading) {
    return <div className="dashboard-shell">Loading...</div>;
  }

  if (!path && !loading) {
    return (
      <div className="dashboard-shell">
        <AppHeader chipLabel="Path Detail" />
        <main className="dashboard-body detail-layout">
          <p>Unable to find the requested path.</p>
          <Link to="/dashboard" className="primary-button">
            Back to dashboard
          </Link>
        </main>
        <footer className="dashboard-footer">© {new Date().getFullYear()} Path Progress. All rights reserved.</footer>
      </div>
    );
  }

  return (
    <div className="dashboard-shell">
      <AppHeader chipLabel="Path Detail" />

      <main className="dashboard-body detail-layout">
        <section className="welcome-card path-hero">
          <div className="path-hero-headline">
            <div>
              <h1>{path?.title}</h1>
              <p>{path?.description}</p>
            </div>
            <div className="hero-actions">
              <Link to={`/paths/${pathId}/sections/create`} className="primary-button soft button-link">
                <span>＋</span> Add Section
              </Link>
              <Link to="/paths/create" state={{ edit: true, id: pathId }} className="outline-button button-link">
                ✏ Edit Path
              </Link>
              <button className="danger-button pill">🗑 Delete Path</button>
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `25%` }} />
          </div>
          <div className="progress-footer">
            <span> </span>
            <span className="progress-label">25% Complete</span>
          </div>
        </section>

        <section className="sections-stack">
          {sectionData.map((section) => (
            <article key={section.id} className="section-panel">
              <header className="section-header">
                <div className="section-title">
                  <h2>{section.title}</h2>
                  <div className="section-progress meter">
                    <div className="section-progress-track">
                      <div className="section-progress-bar" style={{ width: `${section.progress * 100}%` }} />
                    </div>
                    <span>{Math.round(section.progress * 100)}% Complete</span>
                  </div>
                </div>
                <div className="section-actions">
                  <Link to={`/paths/${pathId}/sections/${section.id}/tasks/create`} className="section-action-text button-link">
                    <span>+</span> Task
                  </Link>
                  <button className="section-icon-button" aria-label="Edit section">
                    ✏
                  </button>
                  <button className="section-icon-button" aria-label="Delete section">
                    🗑
                  </button>
                  <button className="section-icon-button" aria-label="Reorder section">
                    ☰
                  </button>
                  <button className="section-icon-button" aria-label="Collapse section">
                    ︿
                  </button>
                </div>
              </header>

              <div className="tasks-list">
                {section.tasks.map((task) => (
                  <div key={task.id} className="task-row">
                    <div className="task-info">
                      <input type="checkbox" checked={task.status === "Done"} readOnly />
                      <div>
                        <p>{task.title}</p>
                        <span className={`status-pill ${task.status.replace(" ", "").toLowerCase()}`}>{task.status}</span>
                      </div>
                    </div>
                    <div className="task-controls">
                      <button className="task-chip">Start</button>
                      <button className="task-chip success">End</button>
                      <button className="task-icon-button">✏</button>
                      <button className="task-icon-button">🗑</button>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>
      </main>

      <footer className="dashboard-footer">© {new Date().getFullYear()} Path Progress. All rights reserved.</footer>
    </div>
  );
}
