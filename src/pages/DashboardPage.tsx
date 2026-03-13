import { Users, Send, Heart, AlertTriangle, Clock } from "lucide-react";
import { useApp } from "@/context/AppContext";

const urgencyColors: Record<string, string> = {
  low: "bg-success/10 text-success",
  medium: "bg-warning/10 text-warning",
  high: "bg-primary/10 text-primary",
  critical: "bg-primary text-primary-foreground animate-pulse-emergency",
};

export default function DashboardPage() {
  const { donors, requests } = useApp();

  const activeRequests = requests.filter((r) => r.status === "active").length;

  const stats = [
    { label: "Total Donors", value: donors.length, icon: Users, color: "text-primary" },
    { label: "Active Requests", value: activeRequests, icon: Send, color: "text-warning" },
    { label: "Recent Donations", value: donors.filter((d) => d.available).length, icon: Heart, color: "text-success" },
  ];

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Overview of Blood Bridge network</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <p className="text-2xl font-heading font-bold">{s.value}</p>
            <p className="text-muted-foreground text-sm">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Requests */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-card">
          <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            Active Requests
          </h2>
          <div className="space-y-3">
            {requests.filter((r) => r.status === "active").map((r) => (
              <div key={r.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex items-center gap-3">
                  <span className="emergency-badge bg-accent text-accent-foreground font-bold">
                    {r.bloodGroup}
                  </span>
                  <div>
                    <p className="font-medium text-sm">{r.requesterName}</p>
                    <p className="text-muted-foreground text-xs">{r.location}</p>
                  </div>
                </div>
                <span className={`emergency-badge ${urgencyColors[r.urgency]}`}>
                  {r.urgency}
                </span>
              </div>
            ))}
            {requests.filter((r) => r.status === "active").length === 0 && (
              <p className="text-muted-foreground text-sm text-center py-4">No active requests</p>
            )}
          </div>
        </div>

        {/* Recent Donors */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-card">
          <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Recent Donors
          </h2>
          <div className="space-y-3">
            {donors.slice(0, 5).map((d) => (
              <div key={d.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex items-center gap-3">
                  <span className="emergency-badge bg-accent text-accent-foreground font-bold">
                    {d.bloodGroup}
                  </span>
                  <div>
                    <p className="font-medium text-sm">{d.name}</p>
                    <p className="text-muted-foreground text-xs">{d.city}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium ${d.available ? "text-success" : "text-muted-foreground"}`}>
                  {d.available ? "Available" : "Unavailable"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
