// Empty state placeholder
export default function EmptyState({ icon = "📋", heading, sub }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <div className="empty-heading">{heading}</div>
      {sub && <div className="empty-sub">{sub}</div>}
    </div>
  );
}

