// Top bar — page title + mobile menu toggle
export default function TopBar({ title, onMenuClick }) {
  return (
    <header className="topbar">
      <button className="topbar-menu-btn" onClick={onMenuClick} aria-label="Menu">
        ☰
      </button>
      <h1 className="topbar-title">{title}</h1>
    </header>
  );
}
