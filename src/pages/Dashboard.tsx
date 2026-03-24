import { useState } from "react";
import { useProfile } from "@/context/ProfileContext";
import { useNavigate } from "react-router-dom";
import { BarChart3, TrendingDown, FileText, CalendarDays, MapPin, Zap, Clock, BookOpen } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import ProgressMilestones from "@/components/dashboard/ProgressMilestones";
import PainJournal from "@/components/dashboard/PainJournal";

function getReliefBadge(pct: number) {
  if (pct >= 76) return { label: "⭐ Excellent", border: "border-green-500", bg: "bg-green-50", text: "text-green-700" };
  if (pct >= 51) return { label: "✅ Good", border: "border-green-400", bg: "bg-green-50", text: "text-green-700" };
  if (pct >= 26) return { label: "🟡 Moderate", border: "border-amber-400", bg: "bg-amber-50", text: "text-amber-700" };
  if (pct >= 0) return { label: "🔴 Mild", border: "border-red-400", bg: "bg-red-50", text: "text-red-600" };
  return { label: "⚠️ Increased", border: "border-red-600", bg: "bg-red-50", text: "text-red-700" };
}

type TabKey = "summary" | "history" | "charts" | "journal";

export default function Dashboard() {
  const { activeProfile } = useProfile();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>("summary");

  const sessions = activeProfile?.sessionHistory || [];
  const totalSessions = sessions.length;
  const avgReduction = totalSessions > 0
    ? (sessions.reduce((sum, s) => sum + (s.initialPain - s.finalPain), 0) / totalSessions).toFixed(1)
    : "—";

  const chartData = sessions.map((s) => ({
    name: new Date(s.date).toLocaleDateString(),
    "Initial Pain": s.initialPain,
    "Final Pain": s.finalPain,
  }));

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

  const tabs: { key: TabKey; icon: React.ElementType; label: string }[] = [
    { key: "summary", icon: BarChart3, label: "Summary" },
    { key: "history", icon: Clock, label: "History" },
    { key: "charts", icon: TrendingDown, label: "Charts" },
    { key: "journal", icon: BookOpen, label: "Journal" },
  ];

  return (
    <div className="container max-w-4xl py-6 sm:py-10 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm">{activeProfile.name}'s therapy overview</p>
        </div>
        <button
          onClick={() => navigate("/report")}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl gradient-medical-bg text-primary-foreground font-semibold hover:opacity-90 transition text-sm"
        >
          <FileText className="h-4 w-4" /> Export Report
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
        <StatCard icon={BarChart3} label="Total Sessions" value={String(totalSessions)} />
        <StatCard icon={TrendingDown} label="Avg Reduction" value={avgReduction + " pts"} />
        <StatCard
          icon={CalendarDays}
          label="Last Session"
          value={sessions.length > 0 ? new Date(sessions[sessions.length - 1].date).toLocaleDateString() : "—"}
        />
      </div>

      {/* Therapy Insights */}
      {sessions.length > 0 && (
        <div className="medical-card-elevated mb-4 sm:mb-6">
          <h2 className="font-display text-base sm:text-lg font-bold mb-3 sm:mb-4">Therapy Insights</h2>
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-white/40">
              <div className="p-2 sm:p-2.5 rounded-lg bg-[var(--surface-tint)] text-primary"><MapPin className="h-4 w-4 sm:h-5 sm:w-5" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Most Treated</p>
                <p className="text-sm sm:text-base font-display font-bold text-foreground">{mostTreatedLocation}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-white/40">
              <div className="p-2 sm:p-2.5 rounded-lg bg-[var(--surface-tint)] text-accent"><Zap className="h-4 w-4 sm:h-5 sm:w-5" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Best Mode</p>
                <p className="text-sm sm:text-base font-display font-bold text-foreground">{mostEffectiveMode}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Milestones */}
      <ProgressMilestones sessions={sessions} />

      {/* Tab bar */}
      <div className="flex border-b border-white/40 mb-4 sm:mb-6 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-1 px-3 sm:px-4 py-2 text-sm font-medium border-b-2 transition whitespace-nowrap ${
              activeTab === t.key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <t.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "summary" && (
        <>
          {chartData.length > 0 && (
            <div className="medical-card-elevated mb-6 sm:mb-8">
              <h2 className="font-display text-base sm:text-lg font-bold mb-3 sm:mb-4">Pain Trend</h2>
              <div className="h-48 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.4)" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#7a90a8" />
                    <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} stroke="#7a90a8" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Initial Pain" stroke="#dc2626" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="Final Pain" stroke="#4a8fc4" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
          {/* Quick session list */}
          <div className="medical-card-elevated">
            <h2 className="font-display text-base sm:text-lg font-bold mb-3 sm:mb-4">Recent Sessions</h2>
            {sessions.length === 0 ? (
              <p className="text-muted-foreground text-sm">No sessions recorded yet.</p>
            ) : (
              <div className="space-y-2">
                {[...sessions].reverse().slice(0, 3).map((s, i) => {
                  const pct = s.painReductionPercentage ?? 0;
                  const tier = getReliefBadge(pct);
                  const arrow = pct > 0 ? "↓" : pct < 0 ? "↑" : "→";
                  return (
                    <div key={i} className="p-3 rounded-xl border border-white/40 bg-white/30 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{new Date(s.date).toLocaleDateString()}</span>
                      <span className="text-foreground">📍 {s.placement}</span>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium border ${tier.border} ${tier.bg} ${tier.text}`}>
                        {arrow}{pct}% · {tier.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === "history" && (
        <div className="medical-card-elevated">
          <h2 className="font-display text-base sm:text-lg font-bold mb-3 sm:mb-4">Session History</h2>
          {sessions.length === 0 ? (
            <p className="text-muted-foreground text-sm">No sessions recorded yet.</p>
          ) : (
            <>
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/40 text-left">
                      <th className="pb-3 font-medium text-muted-foreground">Date</th>
                      <th className="pb-3 font-medium text-muted-foreground">Location</th>
                      <th className="pb-3 font-medium text-muted-foreground">Type</th>
                      <th className="pb-3 font-medium text-muted-foreground">Before</th>
                      <th className="pb-3 font-medium text-muted-foreground">After</th>
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
                        <tr key={i} className="border-b border-white/30 last:border-0">
                          <td className="py-3 text-foreground">{new Date(s.date).toLocaleDateString()}</td>
                          <td className="py-3 text-foreground">📍 {s.placement}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.painType === "Acute" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"}`}>
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
              <div className="sm:hidden space-y-2">
                {[...sessions].reverse().map((s, i) => {
                  const pct = s.painReductionPercentage ?? 0;
                  const tier = getReliefBadge(pct);
                  const arrow = pct > 0 ? "↓" : pct < 0 ? "↑" : "→";
                  return (
                    <div key={i} className="p-3 rounded-xl border border-white/40 bg-white/30">
                      <div className="flex flex-wrap items-center gap-2 text-xs mb-2">
                        <span className="text-muted-foreground">{new Date(s.date).toLocaleDateString()}</span>
                        <span className={`px-2 py-0.5 rounded-full font-medium ${s.painType === "Acute" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"}`}>
                          {s.painType === "Acute" ? "🦴 Musculoskeletal" : "⚡ Neuropathic"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                        <span className="text-muted-foreground">📍 {s.placement}</span>
                        <span className="text-foreground">Pain: {s.initialPain} → {s.finalPain}</span>
                      </div>
                      <div className="mt-2">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium border ${tier.border} ${tier.bg} ${tier.text}`}>
                          {arrow}{pct}% · {tier.label}
                        </span>
                      </div>
                      {s.patientNotes && <p className="text-xs text-muted-foreground mt-1 truncate">{s.patientNotes}</p>}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === "charts" && (
        <div className="medical-card-elevated">
          <h2 className="font-display text-base sm:text-lg font-bold mb-3 sm:mb-4">Pain Trend Chart</h2>
          {chartData.length === 0 ? (
            <p className="text-muted-foreground text-sm">No data to chart yet.</p>
          ) : (
            <div className="h-48 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.4)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#7a90a8" />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} stroke="#7a90a8" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Initial Pain" stroke="#dc2626" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="Final Pain" stroke="#4a8fc4" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {activeTab === "journal" && (
        <PainJournal />
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="medical-card flex items-center gap-2 sm:gap-4 p-3 sm:p-6">
      <div className="p-2 sm:p-3 rounded-xl bg-[var(--surface-tint)] text-primary">
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg sm:text-xl font-display font-bold text-foreground stat-number">{value}</p>
      </div>
    </div>
  );
}
