import { useState, useEffect } from "react";
import StatCard from "../components/UI/StatCard";
import Spinner from "../components/UI/Spinner";
import EmptyState from "../components/UI/EmptyState";
import { StatusBadge, PriorityBadge } from "../components/UI/Badge";
import { taskApi } from "../api/taskApi";

export default function DashboardPage() {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    taskApi.getStats()
      .then(setStats)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  if (error) return (
    <EmptyState
      icon="⚠️"
      heading="Could not load statistics"
      sub={`${error} — make sure the backend is running on port 5000.`}
    />
  );

  const { total, completed, pending, inProgress, completionRate, recent } = stats;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Dashboard</h2>
          <p className="page-sub">Welcome back — here's your task overview.</p>
        </div>
      </div>

      {/* KPI cards */}
      <div className="stat-grid">
        <StatCard icon="📋" label="Total Tasks"     value={total}          accent="blue"   />
        <StatCard icon="✅" label="Completed"        value={completed}      accent="green"  />
        <StatCard icon="⏳" label="Pending"          value={pending}        accent="orange" />
        <StatCard icon="🔄" label="In Progress"      value={inProgress}     accent="purple" />
      </div>

      {/* Completion bar */}
      <div className="progress-card">
        <div className="progress-header">
          <span className="progress-label">Overall Completion</span>
          <span className="progress-pct">{completionRate}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${completionRate}%` }} />
        </div>
      </div>

      {/* Recent activity */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent Activity</h3>
          <span className="card-sub">Last 5 tasks created</span>
        </div>
        {recent && recent.length > 0 ? (
          <table className="activity-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {recent.map(t => (
                <tr key={t._id}>
                  <td className="activity-title">{t.title}</td>
                  <td><PriorityBadge value={t.priority} /></td>
                  <td><StatusBadge  value={t.status}   /></td>
                  <td className="activity-date">
                    {t.createdAt
                      ? new Date(t.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState icon="📭" heading="No tasks yet" sub="Create your first task to see activity here." />
        )}
      </div>
    </div>
  );
}

