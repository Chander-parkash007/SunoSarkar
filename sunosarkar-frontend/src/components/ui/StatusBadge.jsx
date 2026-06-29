import { STATUS_LABELS, PRIORITY_LABELS } from '../../lib/auth';

export function StatusBadge({ status }) {
  if (!status) return null;
  const key = status.toLowerCase().replace(' ', '_');
  return (
    <span className={`badge badge-${key}`}>
      <span className="badge-dot" />
      {STATUS_LABELS[status] || status}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  if (!priority) return null;
  const icons = { NORMAL: '', URGENT: '⚡ ', EMERGENCY: '🚨 ' };
  return (
    <span className={`badge badge-${priority.toLowerCase()}`}>
      {icons[priority]}{PRIORITY_LABELS[priority] || priority}
    </span>
  );
}
