import { WorkspaceShell } from "@/components/layout/workspace-shell";
import { requireSchool } from "@/features/school/context";

export default async function SchoolLayout({ children }: { children: React.ReactNode }) {
  const { membership } = await requireSchool();
  return (
    <WorkspaceShell schoolName={membership.schools.name} role={membership.role}>
      {children}
    </WorkspaceShell>
  );
}
