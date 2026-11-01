export default function AboutPage() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">About</h2>
          <p className="page-sub">Task Manager — University Practical Project</p>
        </div>
      </div>

      <div className="about-grid">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Project Overview</h3>
          </div>
          <p className="about-text">
            A full-stack MERN task management application built for the
            Web Development Fundamentals practical series (P6–P13).
          </p>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Tech Stack</h3>
          </div>
          <ul className="about-list">
            <li><span className="about-tech">MongoDB</span> — document database</li>
            <li><span className="about-tech">Express 5</span> — REST API server</li>
            <li><span className="about-tech">React 19</span> — UI library</li>
            <li><span className="about-tech">Node.js</span> — runtime</li>
            <li><span className="about-tech">Vite 8</span> — build tool</li>
            <li><span className="about-tech">React Router 7</span> — routing</li>
          </ul>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Practicals Implemented</h3>
          </div>
          <ul className="about-list">
            <li>✅ P7 — MERN CRUD API</li>
            <li>✅ P8 — React.lazy() + Suspense (route-based code splitting)</li>
            <li>✅ P9 — In-memory caching with node-cache (TTL 60 s)</li>
            <li>✅ P10 — Event-Driven Architecture (Node.js EventEmitter)</li>
            <li>✅ P11 — Docker Multi-Container Orchestration</li>
            <li>🔜 P12 — GitHub Actions CI/CD</li>
            <li>🔜 P13 — AI task description generation</li>
          </ul>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Docker Architecture (P11)</h3>
          </div>
          <p className="about-text">
            <strong>Frontend:</strong> Multi-stage build served on port 3000 via Nginx with SPA routing.<br /><br />
            <strong>Backend:</strong> Node.js container on port 5000 with healthcheck dependencies.<br /><br />
            <strong>Database:</strong> MongoDB 7.0 container with persistent named volume <code>mongodb_data</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
