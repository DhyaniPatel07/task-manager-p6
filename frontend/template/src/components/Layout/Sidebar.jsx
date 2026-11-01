// Sidebar — dark navy vertical navigation
import { NavLink } from "react-router-dom";

const links = [
  { to: "/",       icon: "⊞", label: "Dashboard" },
  { to: "/tasks",  icon: "✓", label: "Tasks"     },
  { to: "/about",  icon: "ℹ", label: "About"     },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {open && <div className="sb-overlay" onClick={onClose} />}

      <aside className={`sidebar ${open ? "sidebar--open" : ""}`}>
        {/* Logo / brand */}
        <div className="sb-brand">
          <span className="sb-logo">✦</span>
          <span className="sb-name">TaskFlow</span>
        </div>

        <nav className="sb-nav">
          {links.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `sb-link ${isActive ? "sb-link--active" : ""}`
              }
              onClick={onClose}
            >
              <span className="sb-icon">{icon}</span>
              <span className="sb-label">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sb-footer">
          <div className="sb-user">
            <div className="sb-avatar">U</div>
            <div>
              <div className="sb-uname">Student User</div>
              <div className="sb-urole">University Project</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

