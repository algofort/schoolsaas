import type { LucideIcon } from "lucide-react";
import Link from "next/link";

export function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Icon size={30} />
      </span>
      <h2>{title}</h2>
      <p>{description}</p>
      <Link className="text-link" href="/dashboard">
        Back to overview →
      </Link>
    </div>
  );
}
