import { Check, CircleDashed, Database, Mail, Workflow, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeading } from "@/components/ui/page-heading";
export const metadata = { title: "Settings" };

export default function SettingsPage() {
  const supabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
  const integrations = [
    {
      title: "Database & authentication",
      icon: Database,
      description: "Supabase / PostgreSQL. No school database or sign-in flow is connected yet.",
      status: supabaseConfigured ? "Environment present · Not verified" : "Not configured",
    },
    {
      title: "Automation workflows",
      icon: Workflow,
      description: "n8n will process queued communication events through server-side integrations.",
      status: "Not connected",
    },
    {
      title: "Email & messaging",
      icon: Mail,
      description:
        "Resend and WhatsApp Cloud API will be configured per the communication architecture.",
      status: "Not connected",
    },
    {
      title: "School access controls",
      icon: ShieldCheck,
      description:
        "School membership, guardian links and database policies are part of the next foundation phase.",
      status: "Not implemented",
    },
  ];
  return (
    <>
      <PageHeading
        eyebrow="WORKSPACE SETUP"
        title="A solid place to start."
        description="What's ready, what's next, and how the pieces fit together."
      />
      <div className="settings-grid">
        <Card>
          <div className="card-heading">
            <div>
              <h2>Foundation checklist</h2>
              <p>Local development setup</p>
            </div>
            <Badge tone="green">Ready</Badge>
          </div>
          <ul className="foundation-list">
            {[
              "Next.js App Router and strict TypeScript",
              "Akademi styling with React-owned interactions",
              "Responsive shared workspace layout",
              "Reusable UI and feature folders",
              "Lint, typecheck and production build scripts",
              "Environment template and team workflow",
            ].map((item) => (
              <li key={item}>
                <Check size={17} />
                {item}
              </li>
            ))}
          </ul>
          <div className="settings-note">
            <strong>Try your workspace appearance</strong>
            <p>
              Use the moon/sun button in the header. This preference is saved in this browser only.
            </p>
          </div>
        </Card>
        <Card>
          <div className="card-heading">
            <div>
              <h2>Connection status</h2>
              <p>Explicitly disconnected until configured</p>
            </div>
          </div>
          <div className="integration-list">
            {integrations.map(({ title, icon: Icon, description, status }) => (
              <div className="integration-item" key={title}>
                <span className="integration-icon">
                  <Icon size={21} />
                </span>
                <div>
                  <strong>{title}</strong>
                  <p>{description}</p>
                  <span className="integration-status">
                    <CircleDashed size={13} />
                    {status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
