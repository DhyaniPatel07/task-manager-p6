import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import "./App.css";

// ---------------------------------------------------------------------------
// Route-based lazy loading with React.lazy()
// Each page is loaded as a separate JS chunk on demand.
// ---------------------------------------------------------------------------
const TaskListPage = lazy(() => import("./pages/TaskListPage"));
const AddTaskPage  = lazy(() => import("./pages/AddTaskPage"));
const AboutPage    = lazy(() => import("./pages/AboutPage"));

// ---------------------------------------------------------------------------
// Loading fallback shown by Suspense while a chunk is being fetched
// ---------------------------------------------------------------------------
function PageLoader() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <p>⏳ Loading page, please wait…</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------
function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <h1>Task Management System</h1>

        {/* Navigation */}
        <nav style={{ marginBottom: "1.5rem" }}>
          <NavLink to="/"        end style={navStyle}>Task List</NavLink>
          <NavLink to="/add"         style={navStyle}>Add Task</NavLink>
          <NavLink to="/about"       style={navStyle}>About</NavLink>
        </nav>

        {/* Suspense wraps all lazy routes so the fallback renders while
            the matching chunk is downloaded. */}
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/"      element={<TaskListPage />} />
            <Route path="/add"   element={<AddTaskPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

// Inline style helper for nav links
function navStyle({ isActive }) {
  return {
    marginRight: "1rem",
    fontWeight: isActive ? "bold" : "normal",
    textDecoration: isActive ? "underline" : "none",
  };
}

export default App;
