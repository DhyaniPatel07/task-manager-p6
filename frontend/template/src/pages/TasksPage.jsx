import { useState } from "react";
import { useTasks } from "../hooks/useTasks";
import { StatusBadge, PriorityBadge } from "../components/UI/Badge";
import Modal from "../components/UI/Modal";
import Spinner from "../components/UI/Spinner";
import EmptyState from "../components/UI/EmptyState";
import Toast, { useToast } from "../components/UI/Toast";

const STATUSES  = ["Pending", "In Progress", "Completed"];
const PRIORITIES = ["Low", "Medium", "High"];

const EMPTY_FORM = { title: "", description: "", status: "Pending", priority: "Medium", dueDate: "" };

export default function TasksPage() {
  const { tasks, loading, error, createTask, updateTask, deleteTask } = useTasks();
  const { toasts, notify, remove } = useToast();

  // UI state
  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState("All");
  const [sort,    setSort]    = useState("newest");
  const [view,    setView]    = useState("list"); // "list" | "card"

  // Modal state
  const [showCreate, setShowCreate] = useState(false);
  const [editTask,   setEditTask]   = useState(null);   // task object being edited
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [saving,     setSaving]     = useState(false);

  // ── Derived list ──────────────────────────────────────────────────────────
  const visible = tasks
    .filter(t => filter === "All" || t.status === filter)
    .filter(t =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.description || "").toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sort === "title")  return a.title.localeCompare(b.title);
      if (sort === "priority") {
        const order = { High: 0, Medium: 1, Low: 2 };
        return (order[a.priority] ?? 1) - (order[b.priority] ?? 1);
      }
      return 0;
    });

  // ── Handlers ──────────────────────────────────────────────────────────────
  const openCreate = () => { setForm(EMPTY_FORM); setShowCreate(true); };
  const openEdit   = (t) => {
    setEditTask(t);
    setForm({
      title:       t.title,
      description: t.description || "",
      status:      t.status,
      priority:    t.priority || "Medium",
      dueDate:     t.dueDate ? t.dueDate.slice(0, 10) : "",
    });
  };

  const handleFormChange = (e) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { notify("Title is required", "error"); return; }
    setSaving(true);
    try {
      await createTask(form);
      setShowCreate(false);
      notify("Task created successfully!");
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { notify("Title is required", "error"); return; }
    setSaving(true);
    try {
      await updateTask(editTask._id, form);
      setEditTask(null);
      notify("Task updated!");
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await deleteTask(id);
      notify("Task deleted.");
    } catch (err) {
      notify(err.message, "error");
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="page">
      {/* Toasts */}
      <div className="toast-stack">
        {toasts.map(t => (
          <Toast key={t.id} message={t.message} type={t.type} onDone={() => remove(t.id)} />
        ))}
      </div>

      {/* Page header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Tasks</h2>
          <p className="page-sub">{tasks.length} task{tasks.length !== 1 ? "s" : ""} total</p>
        </div>
        <button className="btn btn--primary" onClick={openCreate}>+ New Task</button>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <input
          className="toolbar-search"
          placeholder="Search tasks…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="toolbar-select" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="All">All statuses</option>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <select className="toolbar-select" value={sort} onChange={e => setSort(e.target.value)}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="title">A → Z</option>
          <option value="priority">Priority</option>
        </select>
        <div className="view-toggle">
          <button
            className={`view-btn ${view === "list" ? "view-btn--active" : ""}`}
            onClick={() => setView("list")} title="List view"
          >☰</button>
          <button
            className={`view-btn ${view === "card" ? "view-btn--active" : ""}`}
            onClick={() => setView("card")} title="Card view"
          >⊞</button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <Spinner />
      ) : error ? (
        <EmptyState icon="⚠️" heading="Connection error" sub={error} />
      ) : visible.length === 0 ? (
        <EmptyState
          icon="📭"
          heading={search || filter !== "All" ? "No matching tasks" : "No tasks yet"}
          sub={search || filter !== "All"
            ? "Try changing your search or filter."
            : "Click + New Task to create your first task."}
        />
      ) : view === "list" ? (
        <div className="task-list">
          {visible.map(t => (
            <div key={t._id} className="task-row">
              <div className="task-row-main">
                <div className="task-row-title">{t.title}</div>
                {t.description && <div className="task-row-desc">{t.description}</div>}
              </div>
              <div className="task-row-meta">
                <PriorityBadge value={t.priority} />
                <StatusBadge   value={t.status}   />
                {t.dueDate && (
                  <span className="task-due">
                    📅 {new Date(t.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
              <div className="task-row-actions">
                <button className="btn btn--sm btn--outline" onClick={() => openEdit(t)}>Edit</button>
                <button className="btn btn--sm btn--danger"  onClick={() => handleDelete(t._id, t.title)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="task-cards">
          {visible.map(t => (
            <div key={t._id} className="task-card">
              <div className="task-card-header">
                <PriorityBadge value={t.priority} />
                <StatusBadge   value={t.status}   />
              </div>
              <div className="task-card-title">{t.title}</div>
              {t.description && <div className="task-card-desc">{t.description}</div>}
              {t.dueDate && (
                <div className="task-card-due">
                  📅 Due: {new Date(t.dueDate).toLocaleDateString()}
                </div>
              )}
              <div className="task-card-actions">
                <button className="btn btn--sm btn--outline" onClick={() => openEdit(t)}>Edit</button>
                <button className="btn btn--sm btn--danger"  onClick={() => handleDelete(t._id, t.title)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <Modal title="New Task" onClose={() => setShowCreate(false)}>
          <TaskForm
            form={form}
            onChange={handleFormChange}
            onSubmit={handleCreate}
            onCancel={() => setShowCreate(false)}
            saving={saving}
            submitLabel="Create Task"
          />
        </Modal>
      )}

      {/* Edit Modal */}
      {editTask && (
        <Modal title="Edit Task" onClose={() => setEditTask(null)}>
          <TaskForm
            form={form}
            onChange={handleFormChange}
            onSubmit={handleUpdate}
            onCancel={() => setEditTask(null)}
            saving={saving}
            submitLabel="Save Changes"
          />
        </Modal>
      )}
    </div>
  );
}

// ── Shared form ───────────────────────────────────────────────────────────────
function TaskForm({ form, onChange, onSubmit, onCancel, saving, submitLabel }) {
  return (
    <form className="task-form" onSubmit={onSubmit}>
      <label className="form-label">
        Title *
        <input
          className="form-input"
          name="title"
          value={form.title}
          onChange={onChange}
          placeholder="Task title"
          required
        />
      </label>
      <label className="form-label">
        Description
        <textarea
          className="form-input form-textarea"
          name="description"
          value={form.description}
          onChange={onChange}
          placeholder="Optional description…"
          rows={3}
        />
      </label>
      <div className="form-row">
        <label className="form-label">
          Status
          <select className="form-input" name="status" value={form.status} onChange={onChange}>
            {["Pending", "In Progress", "Completed"].map(s => <option key={s}>{s}</option>)}
          </select>
        </label>
        <label className="form-label">
          Priority
          <select className="form-input" name="priority" value={form.priority} onChange={onChange}>
            {["Low", "Medium", "High"].map(p => <option key={p}>{p}</option>)}
          </select>
        </label>
      </div>
      <label className="form-label">
        Due Date
        <input
          className="form-input"
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={onChange}
        />
      </label>
      <div className="form-actions">
        <button type="button" className="btn btn--outline" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
        <button type="submit" className="btn btn--primary" disabled={saving}>
          {saving ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}

