import { GraduationCap } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="workspace auth-layout">
      <Card>
        <div className="auth-brand">
          <span className="brand-mark">
            <GraduationCap size={24} />
          </span>
          <strong>School Workspace</strong>
        </div>
        {children}
      </Card>
    </main>
  );
}
