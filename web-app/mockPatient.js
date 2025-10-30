// src/data/mockPatient.js
export const patient = {
  id: "P01",
  name: "Janaka Perera",
  age: 72,
  bloodGroup: "O+",
  allergies: ["Penicillin"],
  conditions: ["Hypertension", "Type 2 Diabetes"],
  phone: "+94 77 123 4567",
  reports: [
    { id: 1, name: "Blood Test.pdf", date: "2025-09-01", url: "#" },
    { id: 2, name: "Chest X-Ray.png", date: "2025-09-10", url: "#" }
  ],
  appointments: [
    { id: 1, date: "2025-10-03", note: "Follow-up", status: "upcoming" },
    { id: 2, date: "2025-09-10", note: "BP review", status: "done" }
  ],
  timeline: [
    { date: "2025-09-10", text: "X-Ray uploaded" },
    { date: "2025-09-01", text: "Blood test uploaded" }
  ],
  trends: [
    { date: "2025-09-01", compliance: 0.9 },
    { date: "2025-09-08", compliance: 0.8 },
    { date: "2025-09-15", compliance: 0.95 }
  ],
  notes: [
    { text: "Continue current BP medication", createdAt: "2025-09-10T09:00:00Z" }
  ]
};

