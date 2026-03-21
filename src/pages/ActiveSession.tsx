import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { StopCircle, Clock, Pause, Play } from "lucide-react";
import { useProfile } from "@/context/ProfileContext";

function getReliefTier(pct: number) {
  if (pct >= 76) return { label: "⭐ Excellent Relief", border: "border-green-500", bg: "bg-green-50", text: "text-green-700" };
  if (pct >= 51) return { label: "✅ Good Relief", border: "border-green-400", bg: "bg-green-50", text: "text-green-700" };
  if (pct >= 26) return { label: "🟡 Moderate Relief", border: "border-amber-400", bg: "bg-amber-50", text: "text-amber-700" };
  if (pct >= 0) return { label: "🔴 Mild Relief", border: "border-red-400", bg: "bg-red-50", text: "text-red-600" };
  return { label: "⚠️ Pain Increased", border: "border-red-600", bg: "bg-red-50", text: "text-red-700" };
}

export default function ActiveSession() {
  const navigate = useNavigate();
  const { activeProfile, addSession } = useProfile();

  const configRaw = sessionStorage.getItem("tens-active-session");
  const config = configRaw ? JSON.parse(configRaw) : null;

  const totalSeconds = (config?.duration || 30) * 60;
  const [remaining, setRemaining] = useState(totalSeconds);
  const [running, setRunning] = useState(true);
  const [paused, setPaused] = useState(false);
  const [showPost, setShowPost] = useState(false);
  const [postPainLevel, setPostPainLevel] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const stopSession = useCallback(() => {
    setRunning(false);
    setPaused(false);
    clearInterval(intervalRef.current);
    setShowPost(true);
  }, []);

  const togglePause = () => {
    setPaused((p) => !p);
  };

  useEffect(() => {
    if (!running || paused) {
      clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          stopSession();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running, paused, stopSession]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const elapsed = Math.round((totalSeconds - remaining) / 60);

  // Breathing cycle — only when paused
  const [breathPhase, setBreathPhase] = useState("Inhale");
  useEffect(() => {
    if (!running || !paused) return;
    const phases = ["Inhale", "Hold", "Exhale", "Hold"];
    let i = 0;
    const t = setInterval(() => {
      i = (i + 1) % 4;
      setBreathPhase(phases[i]);
    }, 2000);
    return () => clearInterval(t);
  }, [running, paused]);

  const reductionPct =
    config?.initialPain > 0 && postPainLevel !== null
      ? ((config.initialPain - postPainLevel) / config.initialPain) * 100
      : 0;

  const relief = getReliefTier(reductionPct);

  const arrow = reductionPct > 0 ? "↓" : reductionPct < 0 ? "↑" : "→";

  const saveSession = () => {
    if (!config || !activeProfile || postPainLevel === null) {
      navigate("/dashboard");
      return;
    }
    addSession({
      date: new Date().toISOString(),
      painType: config.painType,
      placement: config.placement,
      parameters: {
        frequency: config.frequency,
        pulseWidth: config.pulseWidth,
        intensity: config.intensity,
        duration: config.duration,
      },
      initialPain: config.initialPain,
      finalPain: postPainLevel,
      duration: config.duration,
      painReductionPercentage: Math.max(0, Math.round(reductionPct)),
      patientNotes: notes,
    });
    sessionStorage.removeItem("tens-active-session");
    navigate("/dashboard");
  };

  if (!config) {
    return (
      <div className="container max-w-xl py-20 text-center">
        <p className="text-muted-foreground">No active session. Please start from Session Setup.</p>
        <button
          onClick={() => navigate("/session-setup")}
          className="mt-4 px-5 py-2.5 rounded-xl gradient-medical-bg text-primary-foreground font-semibold"
        >
          Go to Setup
        </button>
      </div>
    );
  }

  /* ── Post-Session Screen ── */
  if (showPost) {
    return (
      <div className="container max-w-lg py-16">
        <div className="medical-card-elevated text-center">
          {/* Header */}
          <div className="flex justify-center mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 border-2 border-green-500">
              <span className="text-green-600 text-2xl">✓</span>
            </div>
          </div>
          <h2 className="font-display text-xl font-bold text-foreground mb-1">Session Complete!</h2>
          <p className="text-muted-foreground text-sm mb-1">{elapsed} minutes of therapy completed</p>
          <p className="text-sm text-muted-foreground mb-8">
            {config.frequency} Hz · {config.pulseWidth} µs
          </p>

          {/* Pain Picker */}
          <div className="mb-6">
            <p className="text-sm font-medium text-foreground mb-3">How do you feel now? 🩺</p>
            <div className="flex flex-wrap justify-center gap-2">
              {Array.from({ length: 11 }, (_, i) => i).map((n) => (
                 <button
                  key={n}
                  onClick={() => setPostPainLevel(n)}
                  className={`w-10 h-10 rounded-full border-2 text-sm pain-btn ${
                    postPainLevel === n
                      ? "pain-btn-selected"
                      : "border-border bg-card text-foreground"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Live Reduction Badge */}
          {postPainLevel !== null && (
            <div className={`rounded-xl border-2 p-4 text-center transition-all mb-6 ${relief.border} ${relief.bg}`}>
              <div className={`text-3xl font-bold tabular-nums ${relief.text}`}>
                {arrow}{Math.abs(reductionPct).toFixed(1)}%
              </div>
              <div className={`text-sm font-semibold mt-1 ${relief.text}`}>{relief.label}</div>
              <div className="text-xs text-muted-foreground mt-1">(pre − post) ÷ pre × 100</div>
            </div>
          )}

          {/* Notes */}
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any side effects or notes..."
            rows={3}
            className="w-full rounded-xl border border-border p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring mb-6"
          />

          {/* Save */}
          <button
            onClick={saveSession}
            disabled={postPainLevel === null}
            className="w-full py-3 rounded-xl gradient-medical-bg text-primary-foreground font-semibold hover:opacity-90 transition disabled:opacity-40"
          >
            Save & Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  /* ── Active Session Screen ── */
  return (
    <div className="container max-w-lg py-16 pb-20">
      <div className="medical-card-elevated text-center">
        <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
          <Clock className="h-4 w-4" />
          <span className="text-sm font-medium">🔋 Session Running — {config.placement} • {config.painType}</span>
        </div>
        <div className="text-7xl md:text-8xl font-display font-extrabold text-foreground tabular-nums tracking-tight">
          {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {config.frequency} Hz · {config.pulseWidth} μs · {config.intensity} mA
        </p>

        {/* Breathing circle — only when paused */}
        {paused && (
          <div className="mt-10 mb-8 flex flex-col items-center">
            <p className="text-sm text-muted-foreground mb-2">{breathPhase}</p>
            <div className="w-24 h-24 rounded-full gradient-medical-bg flex items-center justify-center breathing-circle">
              <span className="text-primary-foreground font-semibold text-sm">
                {breathPhase}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-3">Box Breathing — follow the rhythm</p>
          </div>
        )}

        <div className="mt-10">
          <button
            onClick={togglePause}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-border text-foreground font-semibold text-base hover:bg-muted transition mb-3"
          >
            {paused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
            {paused ? "▶️ Resume Session" : "⏸ Pause Session"}
          </button>

          <button
            onClick={stopSession}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-destructive text-destructive-foreground font-bold text-lg hover:opacity-90 transition"
          >
            <StopCircle className="h-6 w-6" />
            🛑 Emergency Stop
          </button>
        </div>
      </div>

      {/* Bottom status bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 py-3 px-4 text-center text-sm font-medium ${
          paused
            ? "bg-amber-500 text-white"
            : "bg-green-600 text-white"
        }`}
      >
        {paused
          ? "⏸ Session Paused"
          : `● Session Active — ${elapsed}:${String(secs).padStart(2, "0")} therapy completed`}
      </div>
    </div>
  );
}