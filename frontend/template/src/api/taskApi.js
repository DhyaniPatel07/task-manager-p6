// Central API module — all fetch() calls in one place
// Preserves P9 caching (server handles it; we just read X-Cache-Status from headers)

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  // Expose cache header for debugging (P9)
  const cacheStatus = res.headers.get("X-Cache-Status");
  if (cacheStatus) console.log(`[API] X-Cache-Status: ${cacheStatus}  ${path}`);
  return res.json();
}

export const taskApi = {
  getAll:    ()           => request("/tasks"),
  getStats:  ()           => request("/tasks/stats"),
  create:    (data)       => request("/tasks", { method: "POST", body: JSON.stringify(data) }),
  update:    (id, data)   => request(`/tasks/${id}`, { method: "PUT",  body: JSON.stringify(data) }),
  remove:    (id)         => request(`/tasks/${id}`, { method: "DELETE" }),
  cacheStats:()           => request("/cache-stats"),
};

