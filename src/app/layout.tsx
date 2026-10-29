import type { Metadata } from "next";
import { WorkspaceShell } from "@/components/layout/workspace-shell";
import "@/styles/akademi.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "./globals.css";
import "@/styles/typography.css";
import "@/styles/form-controls.css";

export const metadata: Metadata = {
  title: { default: "School Workspace", template: "%s | School Workspace" },
  description:
    "School management workspace foundation built with Next.js and the Akademi visual system.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <WorkspaceShell>{children}</WorkspaceShell>
      </body>
    </html>
  );
}
