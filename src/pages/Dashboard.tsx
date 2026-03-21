import { useProfile } from "@/context/ProfileContext";
import { useNavigate } from "react-router-dom";
import { BarChart3, TrendingDown, FileText, CalendarDays, MapPin, Zap } from "lucide-react";
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

function getReliefBadge(pct: number) {
  if (pct >= 76) return { label: "⭐ Excellent", border: "border-green-500", bg: "bg-green-50", text: "text-green-700" };
  if (pct >= 51) return { label: "✅ Good", border: "border-green-400", bg: "bg-green-50", text: "text-green-700" };
  if (pct >= 26) return { label: "🟡 Moderate", border: "border-amber-400", bg: "bg-amber-50", text: "text-amber-700" };
  if (pct >= 0) return { label: "🔴 Mild", border: "border-red-400", bg: "bg-red-50", text: "text-red-600" };
  return { label: "⚠️ Increased", border: "border-red-600", bg: "bg-red-50", text: "text-red-700" };
}

export default function Dashboard() {
  const { activeProfile } = useProfile();
  const navigate = useNavigate();

  const sessions = activeProfile?.sessionHistory || [];
  const totalSessions = sessions.length;
  const avgReduction =
    totalSessions > 0
      ? (
          sessions.reduce((sum, s) => sum + (s.initialPain - s.finalPain), 0) / totalSessions
        ).toFixed(1)
      : "—";

  const chartData = sessions.map((s) => ({
    name: new Date(s.date).toLocaleDateString(),
    "Initial Pain": s.initialPain,
    "Final Pain": s.finalPain,
  }));

  // Therapy Insights
  const mostTreatedLocation = (() => {
    if (sessions.length === 0) return "—";
    const counts: Record<string, number> = {};
    sessions.forEach((s) => { counts[s.placement] = (counts[s.placement] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  })();

  const mostEffectiveMode = (() => {
    if (sessions.length === 0) return "—";
    const modeStats: Record<string, { total: number; count: number }> = {};
    sessions.forEach((s) => {
      const mode = s.painType === "Acute" ? "Conventional TENS" : "Acupuncture-like TENS";
      if (!modeStats[mode]) modeStats[mode] = { total: 0, count: 0 };
      modeStats[mode].total += (s.painReductionPercentage ?? 0);
      modeStats[mode].count += 1;
    });
    let best = "—";
    let bestAvg = -1;
    Object.entries(modeStats).forEach(([mode, { total, count }]) => {
      const avg = total / count;
      if (avg > bestAvg) { bestAvg = avg; best = mode; }
    });
    return best;
  })();

  if (!activeProfile) {
    return (
      <div className="container max-w-xl py-20 text-center">
        <p className="text-muted-foreground">Please create a patient profile in Settings first.</p>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">{activeProfile.name}'s therapy overview</p>
        </div>
        <button
          onClick={() => navigate("/report")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-medical-bg text-primary-foreground font-semibold hover:opacity-90 transition"
        >
          <FileText className="h-4 w-4" /> Export Doctor's Report
        </button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon={BarChart3} label="Total Sessions" value={String(totalSessions)} accentColor="bg-primary" />
        <StatCard icon={TrendingDown} label="Avg Pain Reduction" value={avgReduction + " pts"} accentColor="bg-green-500" />
        <StatCard
          icon={CalendarDays}
          label="Last Session"
          value={
            sessions.length > 0
              ? new Date(sessions[sessions.length - 1].date).toLocaleDateString()
              : "—"
          }
          accentColor="bg-amber-500"
        />
      </div>

      {/* Therapy Insights */}
      {sessions.length > 0 && (
        <div className="medical-card-elevated mb-8 animate-in">
          <h2 className="font-display text-lg font-bold text-foreground mb-4">Therapy Insights</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary border border-border">
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Most Treated Location</p>
                <p className="text-base font-display font-bold text-foreground">{mostTreatedLocation}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary border border-border">
              <div className="p-2.5 rounded-lg bg-accent/10 text-accent">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Most Effective Mode</p>
                <p className="text-base font-display font-bold text-foreground">{mostEffectiveMode}</p>
              </div>
            </div>
          </div>
        </div>
      )}

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
                <Line type="monotone" dataKey="Initial Pain" stroke="hsl(0 72% 51%)" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Final Pain" stroke="hsl(173 58% 39%)" strokeWidth={2} dot={{ r: 4 }} />
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
                  <th className="pb-3 font-medium text-muted-foreground">Relief</th>
                  <th className="pb-3 font-medium text-muted-foreground">Notes</th>
                </tr>
              </thead>
              <tbody>
                {[...sessions].reverse().map((s, i) => {
                  const pct = s.painReductionPercentage ?? 0;
                  const tier = getReliefBadge(pct);
                  const arrow = pct > 0 ? "↓" : pct < 0 ? "↑" : "→";
                  return (
                    <tr key={i} className="border-b border-border last:border-0">
                      <td className="py-3 text-foreground">{new Date(s.date).toLocaleDateString()}</td>
                      <td className="py-3 text-foreground">📍 {s.placement}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          s.painType === "Acute" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
                        }`}>
                          {s.painType === "Acute" ? "🦴 Musculoskeletal" : "⚡ Neuropathic"}
                        </span>
                      </td>
                      <td className="py-3 text-foreground">{s.initialPain}/10</td>
                      <td className="py-3 text-foreground">{s.finalPain}/10</td>
                      <td className="py-3">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium border ${tier.border} ${tier.bg} ${tier.text}`}>
                          {arrow}{pct}% · {tier.label}
                        </span>
                      </td>
                      <td className="py-3 text-muted-foreground max-w-[200px] truncate">{s.patientNotes || "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, accentColor = "bg-primary" }: { icon: React.ElementType; label: string; value: string; accentColor?: string }) {
  return (
    <div className="medical-card flex items-center gap-4 relative overflow-hidden animate-in">
      <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${accentColor}`} />
      <div className="p-3 rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-xl font-display font-bold text-foreground">{value}</p>
      </div>
      <div className={`absolute top-3 right-3 w-10 h-10 rounded-full ${accentColor} opacity-10`}>
        <Icon className="h-5 w-5 absolute inset-0 m-auto" />
      </div>
    </div>
  );
}