import { notFound } from "next/navigation";
import { modules } from "@/config/modules";
import { PageHeading } from "@/components/ui/page-heading";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

const planned = modules.filter(
  (item) => !["dashboard", "students", "settings"].includes(item.slug),
);
export function generateStaticParams() {
  return planned.map(({ slug }) => ({ module: slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ module: string }> }) {
  const { module: slug } = await params;
  return { title: planned.find((item) => item.slug === slug)?.label || "Not found" };
}
export default async function ModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module: slug } = await params;
  const definition = planned.find((item) => item.slug === slug);
  if (!definition) notFound();
  return (
    <>
      <PageHeading
        eyebrow="SCHOOL WORKSPACE"
        title={definition.label}
        description={definition.description}
        action={<Badge tone="neutral">Planned module</Badge>}
      />
      <Card>
        <EmptyState
          icon={definition.icon}
          title="A foundation for what's next."
          description="This route is reserved for the module implementation. The shared layout is ready; business logic, permissions and live data will be added in a separate feature branch."
        />
      </Card>
    </>
  );
}
