import { SessionRecord } from "@/context/ProfileContext";

interface Milestone {
  emoji: string;
  title: string;
  earned: boolean;
  detail?: string;
}

function hasConsecutiveDays(sessions: SessionRecord[], days: number): boolean {
  if (sessions.length < days) return false;
  const uniqueDates = [...new Set(sessions.map(s => new Date(s.date).toDateString()))].sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );
  let streak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    const diff = (new Date(uniqueDates[i]).getTime() - new Date(uniqueDates[i - 1]).getTime()) / 86400000;
    if (diff === 1) { streak++; if (streak >= days) return true; }
    else streak = 1;
  }
  return false;
}

export default function ProgressMilestones({ sessions }: { sessions: SessionRecord[] }) {
  const avgReduction = sessions.length > 0
    ? sessions.reduce((sum, s) => sum + (s.painReductionPercentage ?? 0), 0) / sessions.length
    : 0;
  const bestSession = sessions.length > 0
    ? Math.max(...sessions.map(s => s.painReductionPercentage ?? 0))
    : 0;

  const milestones: Milestone[] = [
    { emoji: "🎉", title: "First Session", earned: sessions.length >= 1 },
    { emoji: "🏅", title: "5 Sessions", earned: sessions.length >= 5 },
    { emoji: "🏆", title: "10 Sessions", earned: sessions.length >= 10 },
    { emoji: "📈", title: "50% Avg Relief", earned: avgReduction >= 50, detail: `${avgReduction.toFixed(0)}% avg` },
    { emoji: "⭐", title: "Best Session", earned: sessions.length >= 1, detail: `${bestSession}% relief` },
    { emoji: "🔥", title: "7-Day Streak", earned: hasConsecutiveDays(sessions, 7) },
  ];

  return (
    <div className="medical-card-elevated mb-6 sm:mb-8">
      <h2 className="font-display text-base sm:text-lg font-bold text-foreground mb-3 sm:mb-4">🏆 Progress Milestones</h2>
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {milestones.map((m) => (
          <div
            key={m.title}
            className={`rounded-xl border p-3 text-center text-xs min-w-[5.5rem] ${
              m.earned
                ? "medical-card border-primary/20"
                : "bg-muted/30 border-border opacity-50"
            }`}
          >
            <div className="text-2xl mb-1">{m.emoji}</div>
            <div className="font-semibold text-foreground">{m.title}</div>
            {m.earned && m.detail && (
              <div className="text-muted-foreground mt-0.5">{m.detail}</div>
            )}
            {!m.earned && <div className="text-muted-foreground mt-0.5">🔒 Locked</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
