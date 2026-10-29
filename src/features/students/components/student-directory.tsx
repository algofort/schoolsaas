"use client";

import { useState } from "react";
import { Search, UsersRound } from "lucide-react";
import { previewStudents } from "@/features/students/data/preview-students";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { initials } from "@/lib/utils";

export function StudentDirectory() {
  const [query, setQuery] = useState("");
  const [className, setClassName] = useState("all");
  const students = previewStudents.filter(
    (student) =>
      (className === "all" || student.className === className) &&
      `${student.name} ${student.id} ${student.guardian}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  return (
    <Card>
      <div className="directory-toolbar">
        <div className="field-search">
          <Search size={18} />
          <input
            aria-label="Search sample students"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, guardian or student ID…"
          />
        </div>
        <div className="select-label">
          <label htmlFor="student-class-filter">Class</label>
          <Select
            id="student-class-filter"
            label="Filter by class"
            value={className}
            onValueChange={setClassName}
            options={[
              { value: "all", label: "All classes" },
              ...["Grade 6", "Grade 7", "Grade 8"].map((grade) => ({ value: grade, label: grade })),
            ]}
          />
        </div>
      </div>
      <div className="directory-count">
        <UsersRound size={16} />
        {students.length} sample student{students.length === 1 ? "" : "s"}
      </div>
      <div className="table-scroll">
        <table className="school-table">
          <caption className="visually-hidden">Searchable fictional student directory</caption>
          <thead>
            <tr>
              <th>Student</th>
              <th>Guardian</th>
              <th>Class</th>
              <th>Attendance</th>
              <th>Balance</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {students.length ? (
              students.map((student) => (
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
                  <td>{student.guardian}</td>
                  <td>
                    {student.className} / {student.section}
                  </td>
                  <td>{student.attendance}%</td>
                  <td>
                    {student.balance ? (
                      `Rs ${student.balance.toLocaleString("en-PK")}`
                    ) : (
                      <span className="paid-label">Cleared</span>
                    )}
                  </td>
                  <td>
                    <Badge tone={student.status === "Active" ? "green" : "orange"}>
                      {student.status}
                    </Badge>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="no-results">
                  No students match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="table-footnote">
        Preview records are read-only. Admissions and persistence will be connected in the students
        module.
      </p>
    </Card>
  );
}
