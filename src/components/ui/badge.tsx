import type { ReactNode } from "react";

export function Badge({
  children,
  tone = "purple",
}: {
  children: ReactNode;
  tone?: "purple" | "green" | "orange" | "neutral";
}) {
  return <span className={`school-badge school-badge--${tone}`}>{children}</span>;
}
