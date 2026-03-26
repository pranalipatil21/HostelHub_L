import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import API from "@/api";

export default function LeaveApproval() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchLeaves();
  }, []);

  // ✅ FORMAT DATE
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // ✅ STATUS BADGE (CLEAN)
  const getStatusClass = (status: string) => {
    switch (status) {
      case "Approved":
        return "px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20";
      case "Rejected":
        return "px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20";
      case "Pending":
        return "px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20";
      default:
        return "px-3 py-1 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400";
    }
  };

  const fetchLeaves = async () => {
    try {
      const res = await API.get("/warden/leave");

      const formatted = res.data.map((l: any) => {
        const start = new Date(l.startDate);
        const end = new Date(l.endDate);

        const duration = Math.ceil(
          (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
        );

        return {
          id: l.id,
          student: l.Student?.name,
          room: l.Student?.room || "N/A",
          startDate: l.startDate,
          endDate: l.endDate,
          dates: `${formatDate(l.startDate)} → ${formatDate(l.endDate)}`,
          duration: `${duration} days`,
          reason: l.reason,
          status: l.status,
        };
      });

      setRequests(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    await API.put(`/warden/leave/${id}`, { status });
    fetchLeaves();
  };

  const pending = requests.filter((r: any) => r.status === "Pending").length;

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Leave Requests</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Review and approve student leave applications
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
            <Clock className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 text-sm font-medium">
              {pending} Pending
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Pending", count: requests.filter((r: any) => r.status === "Pending").length, color: "text-yellow-400", border: "border-yellow-500/20" },
            { label: "Approved", count: requests.filter((r: any) => r.status === "Approved").length, color: "text-green-400", border: "border-green-500/20" },
            { label: "Rejected", count: requests.filter((r: any) => r.status === "Rejected").length, color: "text-red-400", border: "border-red-500/20" },
          ].map((s) => (
            <div key={s.label} className={`card-elevated rounded-xl p-4 ${s.border}`}>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                {s.label}
              </p>
              <p className={`text-3xl font-bold mt-1 ${s.color}`}>
                {s.count}
              </p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="card-elevated rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="font-semibold text-foreground">All Leave Applications</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">

              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["Student", "Room", "Dates", "Duration", "Reason", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {requests.length > 0 ? (
                  requests.map((r: any) => (
                    <tr
                      key={r.id}
                      className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-foreground">{r.student}</p>
                        <p className="text-xs text-muted-foreground">{r.id}</p>
                      </td>

                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {r.room}
                      </td>

                      {/* ✅ CLEAN DATES */}
                      <td className="px-6 py-4 text-sm text-foreground">
                        {r.dates}
                      </td>

                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {r.duration}
                      </td>

                      <td className="px-6 py-4 text-sm text-muted-foreground max-w-xs truncate">
                        {r.reason}
                      </td>

                      {/* ✅ CLEAN BADGE */}
                      <td className="px-6 py-4">
                        <span className={getStatusClass(r.status)}>
                          {r.status}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {r.status === "Pending" ? (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => updateStatus(r.id, "Approved")}
                              className="bg-primary h-7 px-3 text-xs"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" /> Approve
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateStatus(r.id, "Rejected")}
                              className="h-7 px-3 text-xs"
                            >
                              <XCircle className="w-3 h-3 mr-1" /> Reject
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">
                            Actioned
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  // ✅ EMPTY STATE
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-sm text-muted-foreground">
                      No leave requests available 📭
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