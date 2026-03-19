import { useProfile } from "@/context/ProfileContext";
import { BarChart3, TrendingDown, FileText, CalendarDays } from "lucide-react";
import { useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const { activeProfile } = useProfile();
  const printRef = useRef<HTMLDivElement>(null);

  const sessions = activeProfile?.sessionHistory || [];
  const totalSessions = sessions.length;
  const avgReduction =
    totalSessions > 0
      ? (
          sessions.reduce((sum, s) => sum + (s.initialPain - s.finalPain), 0) / totalSessions
        ).toFixed(1)
      : "—";

  const chartData = sessions.map((s, i) => ({
    name: new Date(s.date).toLocaleDateString(),
    "Initial Pain": s.initialPain,
    "Final Pain": s.finalPain,
    index: i,
  }));

  const handleExport = () => {
    window.print();
  };

  if (!activeProfile) {
    return (
      <div className="container max-w-xl py-20 text-center">
        <p className="text-muted-foreground">Please create a patient profile in Settings first.</p>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-10" ref={printRef}>
      <div className="flex items-center justify-between mb-8 no-print">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">{activeProfile.name}'s therapy overview</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-medical-bg text-primary-foreground font-semibold hover:opacity-90 transition"
        >
          <FileText className="h-4 w-4" /> Export Doctor's Report
        </button>
      </div>

      {/* Print header */}
      <div className="hidden print:block mb-6">
        <h1 className="text-2xl font-bold">TENS Companion — Doctor's Report</h1>
        <p>Patient: {activeProfile.name} | Condition: {activeProfile.primaryCondition}</p>
        <p>Medications: {activeProfile.medications.join(", ") || "None listed"}</p>
        <p>Generated: {new Date().toLocaleDateString()}</p>
        <hr className="my-4" />
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon={BarChart3} label="Total Sessions" value={String(totalSessions)} />
        <StatCard icon={TrendingDown} label="Avg Pain Reduction" value={avgReduction + " pts"} />
        <StatCard
          icon={CalendarDays}
          label="Last Session"
          value={
            sessions.length > 0
              ? new Date(sessions[sessions.length - 1].date).toLocaleDateString()
              : "—"
          }
        />
      </div>

      {/* Pain Trend Chart */}
      {chartData.length > 0 && (
        <div className="medical-card-elevated mb-8">
          <h2 className="font-display text-lg font-bold text-foreground mb-4">Pain Trend</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(210 18% 90%)" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(210 10% 50%)" />
                <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} stroke="hsl(210 10% 50%)" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Initial Pain"
                  stroke="hsl(0 72% 51%)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="Final Pain"
                  stroke="hsl(173 58% 39%)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Session History */}
      <div className="medical-card-elevated">
        <h2 className="font-display text-lg font-bold text-foreground mb-4">Session History</h2>
        {sessions.length === 0 ? (
          <p className="text-muted-foreground text-sm">No sessions recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 font-medium text-muted-foreground">Date</th>
                  <th className="pb-3 font-medium text-muted-foreground">Location</th>
                  <th className="pb-3 font-medium text-muted-foreground">Type</th>
                  <th className="pb-3 font-medium text-muted-foreground">Pain Before</th>
                  <th className="pb-3 font-medium text-muted-foreground">Pain After</th>
                  <th className="pb-3 font-medium text-muted-foreground">Notes</th>
                </tr>
              </thead>
              <tbody>
                {[...sessions].reverse().map((s, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="py-3 text-foreground">{new Date(s.date).toLocaleDateString()}</td>
                    <td className="py-3 text-foreground">{s.placement}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        s.painType === "Acute" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
                      }`}>
                        {s.painType}
                      </span>
                    </td>
                    <td className="py-3 text-foreground">{s.initialPain}/10</td>
                    <td className="py-3 text-foreground">{s.finalPain}/10</td>
                    <td className="py-3 text-muted-foreground max-w-[200px] truncate">{s.patientNotes || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="medical-card flex items-center gap-4">
      <div className="p-3 rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-xl font-display font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}
