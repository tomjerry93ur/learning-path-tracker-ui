import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import { fetchPaths } from "../api/paths";
import { usePaths } from "../context/PathsContext";
import { getOverviewStats, mockedActivity } from "../data/mockData";
import AppHeader from "../components/AppHeader";

const pathVisuals = [
  "https://i.imgur.com/ylrC5bN.png",
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=60",
  "https://i.imgur.com/R1t8jCF.png",
  "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=800&q=60",
  "https://i.imgur.com/uP7uYgx.png"
];

export default function DashboardPage() {
  const overviewStats = getOverviewStats();
  const { paths, setPaths } = usePaths();
  const [loading, setLoading] = useState(false);

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
    if (paths.length === 0) {
      load().catch(() => setLoading(false));
    }
  }, [paths.length, setPaths]);

  return (
    <div className="dashboard-shell">
      <AppHeader chipLabel="Homepage" />

      <main className="dashboard-body">
        <section className="welcome-card">
          <div>
            <h1>Welcome back, John Doe!</h1>
            <p className="welcome-copy">
              Continue your learning journey and track your progress across all your personalized paths.
            </p>
            <Link to="/paths/create" className="primary-button large">
              Create New Path
            </Link>
          </div>
        </section>

        <section className="stats-section">
          <h2>Overview Statistics</h2>
          <div className="stats-row">
            {overviewStats.map((stat, index) => (
              <article key={stat.label} className="stat-card exact">
                <div className="stat-card-top">
                  <p className="stat-label">{stat.label}</p>
                  <span className="stat-icon">{["▣", "⋯", "⌘", "⌂"][index] ?? "•"}</span>
                </div>
                <p className="stat-value prominent">{stat.value}</p>
                <p className="stat-note subtle">{stat.note}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="paths-and-activity">
          <div className="path-column">
            <div className="section-heading stacked">
              <h2>Your Learning Paths</h2>
              <div className="filter-block">
                <label>Filter:</label>
                <button className="ghost-button pill">All ▾</button>
              </div>
            </div>
            <div className="search-input">
              <span>🔍</span>
              <input placeholder="Search paths..." />
            </div>
            {paths.length === 0 && !loading && (
              <div className="empty-state">
                <p>You have no learning paths created. Please create one.</p>
                <Link to="/paths/create" className="primary-button">
                  Create Path
                </Link>
              </div>
            )}
            <div className="path-grid">
              {paths.map((path, idx) => {
                const progress = path.status === "COMPLETED" ? 100 : path.status === "IN_PROGRESS" ? 50 : 10;
                return (
                <article key={path.id ?? idx} className="learning-card">
                  <div className="learning-image" style={{ backgroundImage: `url(${pathVisuals[idx % pathVisuals.length]})` }} />
                  <div className="learning-copy">
                    <h3>{path.title}</h3>
                    <p>{path.description}</p>
                    <div className="path-progress pill">
                      <div className="path-progress-fill" style={{ width: `${progress}%` }} />
                      <span>{progress}%</span>
                    </div>
                  </div>
                  <Link to={`/paths/${path.id}`} className="ghost-button full-width">
                    View Details
                  </Link>
                </article>
              );
              })}
            </div>
          </div>

          <aside className="activity-column">
            <div className="section-heading">
              <h2>Recent Activity</h2>
            </div>
            <div className="activity-list card">
              {mockedActivity.map((item) => (
                <article key={item.id} className="activity-line">
                  <div className="activity-text">
                    <p>{item.description}</p>
                    <span>{item.timeAgo}</span>
                  </div>
                </article>
              ))}
            </div>
          </aside>
        </section>
      </main>

      <footer className="dashboard-footer">© {new Date().getFullYear()} Path Progress. All rights reserved.</footer>
    </div>
  );
}
