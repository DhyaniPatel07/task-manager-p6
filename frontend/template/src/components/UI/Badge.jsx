// Priority + status badges
const PRIORITY_COLOR = { High: "red", Medium: "orange", Low: "green" };
const STATUS_COLOR   = { Completed: "green", "In Progress": "blue", Pending: "grey" };

export function PriorityBadge({ value }) {
  const c = PRIORITY_COLOR[value] ?? "grey";
  return <span className={`badge badge--${c}`}>{value ?? "Medium"}</span>;
}

export function StatusBadge({ value }) {
  const c = STATUS_COLOR[value] ?? "grey";
  return <span className={`badge badge--${c}`}>{value ?? "Pending"}</span>;
}

