import { useProfile } from "@/context/ProfileContext";
import { useNavigate } from "react-router-dom";
import { Printer, ArrowLeft } from "lucide-react";

export default function Report() {
  const { activeProfile } = useProfile();
  const navigate = useNavigate();

  if (!activeProfile) {
    return (
      <div className="container max-w-xl py-20 text-center">
        <p className="text-muted-foreground">No active profile selected.</p>
        <button onClick={() => navigate("/settings")} className="mt-4 px-5 py-2.5 rounded-xl gradient-medical-bg text-primary-foreground font-semibold">
          Go to Settings
        </button>
      </div>
    );
  }

  const sessions = activeProfile.sessionHistory || [];
  const totalSessions = sessions.length;
  const avgReduction = totalSessions > 0
    ? (sessions.reduce((sum, s) => sum + (s.initialPain - s.finalPain), 0) / totalSessions).toFixed(1)
    : "0";
  const avgReductionPct = totalSessions > 0
    ? (sessions.reduce((sum, s) => sum + (s.painReductionPercentage ?? 0), 0) / totalSessions).toFixed(0)
    : "0";

  return (
    <div className="container max-w-3xl py-10">
      {/* Controls - hidden when printing */}
      <div className="no-print flex items-center justify-between mb-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-medical-bg text-primary-foreground font-semibold hover:opacity-90 transition"
        >
          <Printer className="h-4 w-4" /> Print Report
        </button>
      </div>

      {/* Printable Content */}
      <div className="bg-card rounded-xl border border-border p-8 print:border-0 print:shadow-none print:p-0">
        <h1 className="font-display text-2xl font-bold text-foreground mb-1">TensPilot+ — Doctor's Report</h1>
        <p className="text-sm text-muted-foreground mb-6">Generated: {new Date().toLocaleDateString()}</p>

        <hr className="border-border mb-6" />

        {/* Patient Summary */}
        <section className="mb-8">
          <h2 className="font-display text-lg font-bold text-foreground mb-3">Patient Summary</h2>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <div className="text-muted-foreground">Name</div>
            <div className="text-foreground font-medium">{activeProfile.name}</div>
            <div className="text-muted-foreground">Primary Condition</div>
            <div className="text-foreground font-medium">{activeProfile.primaryCondition}</div>
            <div className="text-muted-foreground">Current Medications</div>
            <div className="text-foreground font-medium">
              {activeProfile.medications.length > 0 ? activeProfile.medications.join(", ") : "None listed"}
            </div>
          </div>
        </section>

        {/* Analytics Summary */}
        <section className="mb-8">
          <h2 className="font-display text-lg font-bold text-foreground mb-3">Analytics Summary</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-secondary border border-border text-center">
              <p className="text-2xl font-display font-bold text-foreground">{totalSessions}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Sessions</p>
            </div>
            <div className="p-4 rounded-xl bg-secondary border border-border text-center">
              <p className="text-2xl font-display font-bold text-foreground">{avgReduction} pts</p>
              <p className="text-xs text-muted-foreground mt-1">Avg Pain Reduction</p>
            </div>
            <div className="p-4 rounded-xl bg-secondary border border-border text-center">
              <p className="text-2xl font-display font-bold text-foreground">{avgReductionPct}%</p>
              <p className="text-xs text-muted-foreground mt-1">Avg Relief %</p>
            </div>
          </div>
        </section>

        {/* Session History Table */}
        <section>
          <h2 className="font-display text-lg font-bold text-foreground mb-3">Session History</h2>
          {sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No sessions recorded.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-2 font-medium text-muted-foreground">Date</th>
                    <th className="pb-2 font-medium text-muted-foreground">Location</th>
                    <th className="pb-2 font-medium text-muted-foreground">Type</th>
                    <th className="pb-2 font-medium text-muted-foreground">Freq</th>
                    <th className="pb-2 font-medium text-muted-foreground">Before</th>
                    <th className="pb-2 font-medium text-muted-foreground">After</th>
                    <th className="pb-2 font-medium text-muted-foreground">Relief</th>
                    <th className="pb-2 font-medium text-muted-foreground">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((s, i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      <td className="py-2 text-foreground">{new Date(s.date).toLocaleDateString()}</td>
                      <td className="py-2 text-foreground">{s.placement}</td>
                      <td className="py-2 text-foreground">{s.painType}</td>
                      <td className="py-2 text-foreground">{s.parameters.frequency} Hz</td>
                      <td className="py-2 text-foreground">{s.initialPain}/10</td>
                      <td className="py-2 text-foreground">{s.finalPain}/10</td>
                      <td className="py-2 text-foreground">{s.painReductionPercentage ?? "—"}%</td>
                      <td className="py-2 text-muted-foreground max-w-[180px] truncate">{s.patientNotes || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}