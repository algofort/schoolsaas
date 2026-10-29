import { Compass } from "lucide-react";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
export default function NotFound() {
  return (
    <Card>
      <EmptyState
        icon={Compass}
        title="This page isn't here"
        description="Choose a module from the sidebar to return to your workspace."
      />
    </Card>
  );
}
