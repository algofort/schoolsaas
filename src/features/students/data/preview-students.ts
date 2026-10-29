// Fictional fixtures for layout review. Never import these into a production data adapter.
export type PreviewStudent = {
  id: string;
  name: string;
  guardian: string;
  className: string;
  section: string;
  attendance: number;
  balance: number;
  status: "Active" | "On leave";
  color: "purple" | "orange" | "green" | "blue";
};

export const previewStudents: PreviewStudent[] = [
  {
    id: "ST-001",
    name: "Ayesha Khan",
    guardian: "Imran Khan",
    className: "Grade 8",
    section: "A",
    attendance: 96,
    balance: 0,
    status: "Active",
    color: "purple",
  },
  {
    id: "ST-002",
    name: "Hamza Ahmed",
    guardian: "Farhan Ahmed",
    className: "Grade 7",
    section: "B",
    attendance: 94,
    balance: 2500,
    status: "Active",
    color: "orange",
  },
  {
    id: "ST-003",
    name: "Fatima Ali",
    guardian: "Hassan Ali",
    className: "Grade 8",
    section: "A",
    attendance: 98,
    balance: 0,
    status: "Active",
    color: "green",
  },
  {
    id: "ST-004",
    name: "Zain Malik",
    guardian: "Omar Malik",
    className: "Grade 6",
    section: "A",
    attendance: 89,
    balance: 4000,
    status: "On leave",
    color: "blue",
  },
  {
    id: "ST-005",
    name: "Maryam Noor",
    guardian: "Salman Noor",
    className: "Grade 7",
    section: "B",
    attendance: 97,
    balance: 0,
    status: "Active",
    color: "purple",
  },
];
