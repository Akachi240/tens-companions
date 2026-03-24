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
      <div className="container max-w-lg py-10 sm:py-16 px-4">
        <div className="medical-card-elevated text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-green-100 border-2 border-green-500">
              <span className="text-green-600 text-xl sm:text-2xl">✓</span>
            </div>
          </div>
          <h2 className="font-display text-lg sm:text-xl font-bold mb-1">Session Complete!</h2>
          <p className="text-muted-foreground text-sm mb-1">{elapsed} minutes of therapy completed</p>
          <p className="text-sm text-muted-foreground mb-6 sm:mb-8">
            {config.frequency} Hz · {config.pulseWidth} µs
          </p>

          <div className="mb-5 sm:mb-6">
            <p className="text-sm font-medium text-foreground mb-3">How do you feel now? 🩺</p>
            <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
              {Array.from({ length: 11 }, (_, i) => i).map((n) => (
                <button
                  key={n}
                  onClick={() => setPostPainLevel(n)}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 font-semibold text-xs sm:text-sm transition ${
                    postPainLevel === n
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-white/60 bg-white/40 text-foreground hover:border-primary"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {postPainLevel !== null && (
            <div className={`rounded-xl border-2 p-3 sm:p-4 text-center transition-all mb-5 sm:mb-6 ${relief.border} ${relief.bg}`}>
              <div className={`text-2xl sm:text-3xl font-bold tabular-nums reduction-pct ${relief.text}`}>
                {arrow}{Math.abs(reductionPct).toFixed(1)}%
              </div>
              <div className={`text-sm font-semibold mt-1 ${relief.text}`}>{relief.label}</div>
              <div className="text-xs text-muted-foreground mt-1">(pre − post) ÷ pre × 100</div>
            </div>
          )}

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any side effects or notes..."
            rows={2}
            className="w-full rounded-xl border border-white/60 bg-white/40 backdrop-blur-sm p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring mb-5 sm:mb-6"
          />

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
    <div className="container max-w-lg py-10 sm:py-16 pb-20 px-4">
      <div className="medical-card-elevated text-center">
        <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
          <Clock className="h-4 w-4" />
          <span className="text-sm font-medium">🔋 Session Running — {config.placement} • {config.painType}</span>
        </div>
        <div className="text-6xl sm:text-7xl md:text-8xl font-display font-extrabold text-foreground tabular-nums tracking-tight timer-display">
          {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </div>

        <div className="flex sm:hidden flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-2">
          <span>Freq: {config.frequency} Hz</span>
          <span>PW: {config.pulseWidth} μs</span>
          <span>Int: {config.intensity} mA</span>
        </div>
        <p className="hidden sm:block text-sm text-muted-foreground mt-2">
          {config.frequency} Hz · {config.pulseWidth} μs · {config.intensity} mA
        </p>

        {paused && (
          <div className="mt-8 sm:mt-10 mb-6 sm:mb-8 flex flex-col items-center">
            <p className="text-xs sm:text-sm text-muted-foreground mb-2">{breathPhase}</p>
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full gradient-medical-bg flex items-center justify-center breathing-circle">
              <span className="text-primary-foreground font-semibold text-xs sm:text-sm">
                {breathPhase}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-3">Box Breathing — follow the rhythm</p>
          </div>
        )}

        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
          <button
            onClick={togglePause}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-primary/40 bg-white/40 backdrop-blur-sm text-foreground font-semibold text-base hover:bg-white/60 transition"
          >
            {paused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
            {paused ? "▶️ Resume Session" : "⏸ Pause Session"}
          </button>

          <button
            onClick={stopSession}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-3 sm:py-4 rounded-xl bg-destructive text-destructive-foreground font-bold text-base sm:text-lg hover:opacity-90 transition"
          >
            <StopCircle className="h-5 w-5 sm:h-6 sm:w-6" />
            🛑 Emergency Stop
          </button>
        </div>
      </div>

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
