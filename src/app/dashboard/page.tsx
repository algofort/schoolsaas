import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ClipboardCheck,
  GraduationCap,
  Layers3,
  Sparkles,
  UsersRound,
  Wallet,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeading } from "@/components/ui/page-heading";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { previewStudents } from "@/features/students/data/preview-students";
import { initials } from "@/lib/utils";

export const metadata = { title: "Overview" };
const stats = [
  {
    label: "Total students",
    value: "1,248",
    detail: "+24 this month",
    icon: UsersRound,
    color: "purple",
  },
  {
    label: "Teaching staff",
    value: "64",
    detail: "Across 24 classes",
    icon: GraduationCap,
    color: "orange",
  },
  {
    label: "Attendance today",
    value: "94.2%",
    detail: "+2.4% from last week",
    icon: ClipboardCheck,
    color: "green",
  },
  {
    label: "Fees collected",
    value: "Rs 842k",
    detail: "82% of monthly target",
    icon: Wallet,
    color: "blue",
  },
];

export default function Dashboard() {
  return (
    <>
      <PageHeading
        eyebrow="YOUR SCHOOL, CONNECTED"
        title="A good day starts here."
        description="A little clarity for everything happening across your school."
        action={
          <span className="session-pill">
            <CalendarDays size={17} />
            Academic session 2026–27
          </span>
        }
      />
      <div className="preview-notice">
        <span>
          <Sparkles size={17} />
          <strong>Foundation preview</strong>
          <span>Explore the layout with fictional sample data.</span>
        </span>
        <Link href="/settings">
          View setup status <ArrowRight size={15} />
        </Link>
      </div>
      <div className="stat-grid">
        {stats.map(({ label, value, detail, icon: Icon, color }) => (
          <Card className="stat-card" key={label}>
            <span className={`stat-icon avatar-${color}`}>
              <Icon size={25} strokeWidth={1.8} />
            </span>
            <div>
              <p>{label}</p>
              <h2>{value}</h2>
              <small>{detail}</small>
            </div>
          </Card>
        ))}
      </div>
      <div className="dashboard-columns">
        <div className="dashboard-primary">
          <Card className="performance-card">
            <div className="card-heading">
              <div>
                <h2>School overview</h2>
                <p>Small steps. Steady progress.</p>
              </div>
              <Badge tone="neutral">Sample term</Badge>
            </div>
            <div className="chart-legend">
              <span>
                <i className="legend-dot purple" />
                Attendance
              </span>
              <span>
                <i className="legend-dot orange" />
                Fee collection
              </span>
            </div>
            <OverviewChart />
            <div className="chart-insight">
              <span className="insight-icon">
                <ArrowUpRight size={19} />
              </span>
              <p>
                <strong>Progress worth celebrating</strong>
                <span>Illustrative trends — live reports will appear after data integration.</span>
              </p>
            </div>
          </Card>
          <Card>
            <div className="card-heading">
              <div>
                <h2>Student directory</h2>
                <p>A familiar face behind every record.</p>
              </div>
              <Link className="text-link" href="/students">
                View all <ArrowUpRight size={16} />
              </Link>
            </div>
            <div className="table-scroll">
              <table className="school-table">
                <caption className="visually-hidden">
                  Fictional students used to preview the dashboard
                </caption>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Class</th>
                    <th>Attendance</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {previewStudents.slice(0, 4).map((student) => (
                    <tr key={student.id}>
                      <td>
                        <div className="person-cell">
                          <span className={`person-avatar avatar-${student.color}`}>
                            {initials(student.name)}
                          </span>
                          <span>
                            <strong>{student.name}</strong>
                            <small>{student.id}</small>
                          </span>
                        </div>
                      </td>
                      <td>
                        {student.className} <span className="muted">/ {student.section}</span>
                      </td>
                      <td>
                        <span className="attendance-cell">
                          <span className="mini-track">
                            <i style={{ width: `${student.attendance}%` }} />
                          </span>
                          {student.attendance}%
                        </span>
                      </td>
                      <td>
                        <Badge tone={student.status === "Active" ? "green" : "orange"}>
                          {student.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
        <aside className="dashboard-secondary" aria-label="Workspace highlights">
          <Card className="setup-card">
            <span className="setup-symbol">
              <Layers3 size={25} />
            </span>
            <Badge>WORKSPACE FOUNDATION</Badge>
            <h2>
              Built together.
              <br />
              Ready to grow.
            </h2>
            <p>A shared starting point for your school, your workflows and your team.</p>
            <div className="setup-checks">
              <span>
                <Check size={15} /> Next.js & TypeScript
              </span>
              <span>
                <Check size={15} /> Akademi design system
              </span>
              <span>
                <Check size={15} /> Shared React components
              </span>
            </div>
            <Link className="school-button school-button--primary" href="/settings">
              Explore setup <ArrowRight size={17} />
            </Link>
          </Card>
          <Card>
            <div className="card-heading">
              <div>
                <h2>On the calendar</h2>
                <p>Sample school-day agenda</p>
              </div>
              <CalendarDays size={19} className="muted" />
            </div>
            <div className="agenda-list">
              {[
                {
                  day: "12",
                  month: "NOV",
                  title: "Parent–teacher meeting",
                  time: "09:00 AM · Main campus",
                  color: "purple",
                },
                {
                  day: "16",
                  month: "NOV",
                  title: "Science exhibition",
                  time: "10:30 AM · School hall",
                  color: "orange",
                },
                {
                  day: "20",
                  month: "NOV",
                  title: "Monthly assessments",
                  time: "All classes",
                  color: "green",
                },
              ].map((event) => (
                <div className="agenda-item" key={event.title}>
                  <span className={`date-tile avatar-${event.color}`}>
                    <strong>{event.day}</strong>
                    <small>{event.month}</small>
                  </span>
                  <span>
                    <strong>{event.title}</strong>
                    <small>{event.time}</small>
                  </span>
                </div>
              ))}
            </div>
            <Link className="quiet-link" href="/calendar">
              Open calendar <ArrowRight size={15} />
            </Link>
          </Card>
          <div className="next-step-card">
            <span>
              <ArrowDownLeft size={20} />
            </span>
            <div>
              <strong>One foundation, many possibilities.</strong>
              <p>School data, portals and automations come next.</p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
