import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wrench } from "lucide-react";
import API from "@/api";

const staff = ["Raj Singh", "Mohan Das", "Suresh Kumar", "Amit Verma"];

// ✅ CLEAN STATUS BADGES
const getStatusClass = (status: string) => {
  switch (status) {
    case "Open":
      return "px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20";
    case "In Progress":
      return "px-3 py-1 rounded-full text-xs font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20";
    case "Resolved":
      return "px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20";
    default:
      return "px-3 py-1 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400";
  }
};

// ✅ CATEGORY COLORS
const getCategoryColor = (category: string) => {
  switch (category) {
    case "Electrical":
      return "text-yellow-400";
    case "Water":
      return "text-blue-400";
    case "Internet":
      return "text-purple-400";
    case "Cleaning":
      return "text-green-400";
    default:
      return "text-muted-foreground";
  }
};

export default function WardenComplaints() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    const res = await API.get("/warden/complaints");

    const formatted = res.data.map((c: any) => ({
      id: c.id,
      student: c.Student?.name,
      room: c.Student?.room || "N/A",
      category: c.category,
      desc: c.description,
      status: c.status,
      assignedStaff: "",
    }));

    setComplaints(formatted);
  };

  const assignStaff = (id: number, staffMember: string) => {
    setComplaints((prev: any) =>
      prev.map((c: any) =>
        c.id === id
          ? { ...c, assignedStaff: staffMember, status: "In Progress" }
          : c
      )
    );
  };

  const updateStatus = async (id: number, status: string) => {
    await API.put(`/warden/complaints/${id}`, { status });
    fetchComplaints();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Complaint Management
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Assign and track maintenance complaints
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Open",
              count: complaints.filter((c: any) => c.status === "Open").length,
              cls: "text-blue-400",
              border: "border-blue-500/20",
            },
            {
              label: "In Progress",
              count: complaints.filter((c: any) => c.status === "In Progress").length,
              cls: "text-orange-400",
              border: "border-orange-500/20",
            },
            {
              label: "Resolved",
              count: complaints.filter((c: any) => c.status === "Resolved").length,
              cls: "text-green-400",
              border: "border-green-500/20",
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`card-elevated rounded-xl p-4 ${s.border}`}
            >
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                {s.label}
              </p>
              <p className={`text-3xl font-bold mt-1 ${s.cls}`}>
                {s.count}
              </p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="card-elevated rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center gap-2">
            <Wrench className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-foreground">
              All Complaints
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">

              {/* ✅ HEADER FIX */}
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["Student", "Category", "Description", "Status", "Assign", "Action"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {complaints.length > 0 ? (
                  complaints.map((c: any) => (
                    <tr
                      key={c.id}
                      className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                    >
                      {/* Student */}
                      <td className="px-6 py-4 text-sm font-medium text-foreground">
                        {c.student}
                      </td>

                      {/* Category */}
                      <td className={`px-6 py-4 text-sm font-medium ${getCategoryColor(c.category)}`}>
                        {c.category}
                      </td>

                      {/* Description */}
                      <td className="px-6 py-4 text-sm text-muted-foreground max-w-xs truncate">
                        {c.desc}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={getStatusClass(c.status)}>
                          {c.status}
                        </span>
                      </td>

                      {/* Assign */}
                      <td className="px-6 py-4">
                        <Select onValueChange={(val) => assignStaff(c.id, val)}>
                          <SelectTrigger className="h-8 text-xs w-36">
                            <SelectValue placeholder="Assign staff" />
                          </SelectTrigger>
                          <SelectContent>
                            {staff.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4">
                        {c.status === "In Progress" ? (
                          <Button
                            size="sm"
                            onClick={() => updateStatus(c.id, "Resolved")}
                          >
                            Resolve
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">
                            —
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  // ✅ EMPTY STATE
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-10 text-center text-sm text-muted-foreground"
                    >
                      No complaints available 🛠️
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}