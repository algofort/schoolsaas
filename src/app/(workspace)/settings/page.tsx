import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeading } from "@/components/ui/page-heading";
import { requireSchool, getMemberships } from "@/features/school/context";
import { AcademicForm } from "@/features/school/components/academic-form";
import {
  canManageSchool,
  namedRowSchema,
  classRowSchema,
  sectionRowSchema,
  sessionRowSchema,
} from "@/features/school/contracts";
import { switchSchool } from "@/features/school/actions";
export const metadata = { title: "School settings" };

export default async function SettingsPage() {
  const { supabase, schoolId, membership } = await requireSchool();
  const memberships = await getMemberships();
  const responses = await Promise.all([
    supabase.from("branches").select("id,name").eq("school_id", schoolId).order("name"),
    supabase
      .from("academic_sessions")
      .select("id,name,starts_on,ends_on")
      .eq("school_id", schoolId)
      .order("starts_on", { ascending: false }),
    supabase.from("classes").select("id,name,branch_id").eq("school_id", schoolId).order("name"),
    supabase.from("sections").select("id,name,class_id").eq("school_id", schoolId).order("name"),
  ]);
  if (responses.some((x) => x.error)) throw new Error("Academic setup could not be loaded.");
  const branches = namedRowSchema.array().parse(responses[0].data);
  const sessions = sessionRowSchema.array().parse(responses[1].data);
  const classes = classRowSchema.array().parse(responses[2].data);
  const sections = sectionRowSchema.array().parse(responses[3].data);
  const classOptions = classes.map((c) => ({
    ...c,
    name: `${c.name} · ${branches.find((b) => b.id === c.branch_id)?.name || "Campus"}`,
  }));
  const manage = canManageSchool(membership.role);
  const groups = [
    { kind: "branch" as const, title: "Campuses", rows: branches, options: [] },
    {
      kind: "session" as const,
      title: "Academic sessions",
      rows: sessions.map((s) => ({ ...s, name: `${s.name} · ${s.starts_on} — ${s.ends_on}` })),
      options: [],
    },
    { kind: "class" as const, title: "Classes", rows: classOptions, options: branches },
    {
      kind: "section" as const,
      title: "Sections",
      rows: sections.map((s) => ({
        ...s,
        name: `${s.name} · ${classOptions.find((c) => c.id === s.class_id)?.name || "Class"}`,
      })),
      options: classOptions,
    },
  ];
  return (
    <>
      <PageHeading
        eyebrow="SCHOOL SETUP"
        title={membership.schools.name}
        description="Manage the shared academic foundation for your school."
      />
      <div className="school-access-bar">
        <Badge tone="green">Connected school workspace</Badge>
        <span>
          {membership.role} · {membership.schools.currency} · {membership.schools.timezone}
        </span>
      </div>
      {memberships.length > 1 && (
        <Card>
          <h2>Your schools</h2>
          <ul className="setup-list">
            {memberships.map((m) => (
              <li key={m.school_id}>
                <form action={switchSchool}>
                  <input type="hidden" name="school_id" value={m.school_id} />
                  <Button variant="secondary" disabled={m.school_id === schoolId}>
                    {m.schools.name}
                    {m.school_id === schoolId ? " (current)" : ""}
                  </Button>
                </form>
              </li>
            ))}
          </ul>
        </Card>
      )}
      <div className="settings-grid">
        {groups.map((group) => (
          <Card key={group.kind} className="school-setup-card">
            <div className="card-heading">
              <h2>{group.title}</h2>
              <Badge>{group.rows.length}</Badge>
            </div>
            <ul className="setup-list">
              {group.rows.length ? (
                group.rows.map((row) => <li key={row.id}>{row.name}</li>)
              ) : (
                <li>No {group.title.toLowerCase()} added yet.</li>
              )}
            </ul>
            {manage ? (
              <AcademicForm kind={group.kind} options={group.options} />
            ) : (
              <p>School administrators manage this setup.</p>
            )}
          </Card>
        ))}
        <Card className="school-setup-card">
          <h2>Automation & messaging</h2>
          <p className="auth-description">
            n8n, email and WhatsApp are not connected yet. No messages are sent by these setup
            forms.
          </p>
          <Badge>Planned</Badge>
        </Card>
        <Card className="school-setup-card">
          <h2>Team access</h2>
          <p className="auth-description">
            New accounts do not automatically join this school. Invitations and role management will
            be a separate reviewed feature. Student and staff pages still use sample data.
          </p>
          <Badge>Membership enforced</Badge>
        </Card>
      </div>
    </>
  );
}
