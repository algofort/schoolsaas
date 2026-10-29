import { PageHeading } from "@/components/ui/page-heading";
import { Badge } from "@/components/ui/badge";
import { StudentDirectory } from "@/features/students/components/student-directory";
export const metadata = { title: "Students" };
export default function StudentsPage() {
  return (
    <>
      <PageHeading
        eyebrow="SCHOOL MANAGEMENT"
        title="Every student, in one place."
        description="A shared directory design for admissions, profiles and guardian relationships."
        action={<Badge tone="orange">Sample data · Read only</Badge>}
      />
      <StudentDirectory />
    </>
  );
}
