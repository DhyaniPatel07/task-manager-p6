import { lazy, Suspense, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";

import Sidebar from "./components/Layout/Sidebar";
import TopBar  from "./components/Layout/TopBar";
import Spinner from "./components/UI/Spinner";

// ── P8: Route-based lazy loading with React.lazy() ───────────────────────────
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const TasksPage     = lazy(() => import("./pages/TasksPage"));
const AboutPage     = lazy(() => import("./pages/AboutPage"));

// Map route paths → page titles shown in TopBar
const PAGE_TITLES = {
  "/":       "Dashboard",
  "/tasks":  "Tasks",
  "/about":  "About",
};

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] ?? "TaskFlow";

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="app-main">
        <TopBar title={title} onMenuClick={() => setSidebarOpen(o => !o)} />

        {/* P8: Suspense fallback while lazy chunk downloads */}
        <Suspense fallback={
          <div className="page-loading">
            <Spinner size={48} />
            <p>Loading page…</p>
          </div>
        }>
          <Routes>
            <Route path="/"      element={<DashboardPage />} />
            <Route path="/tasks" element={<TasksPage />}     />
            <Route path="/about" element={<AboutPage />}     />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
