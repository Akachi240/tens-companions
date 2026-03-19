import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { StopCircle, Clock, Pause, Play } from "lucide-react";
import { useProfile } from "@/context/ProfileContext";

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
  const [finalPain, setFinalPain] = useState(5);
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

  // Breathing cycle: 8s total (2s inhale, 2s hold, 2s exhale, 2s hold)
  const [breathPhase, setBreathPhase] = useState("Inhale");
  useEffect(() => {
    if (!running || paused) return;
    const phases = ["Inhale", "Hold", "Exhale", "Hold"];
    let i = 0;
    const t = setInterval(() => {
      i = (i + 1) % 4;
      setBreathPhase(phases[i]);
    }, 2000);
    return () => clearInterval(t);
  }, [running, paused]);

  const saveSession = () => {
    if (!config || !activeProfile) {
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
      finalPain,
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

  if (showPost) {
    return (
      <div className="container max-w-lg py-16">
        <div className="medical-card-elevated text-center">
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">Session Complete</h2>
          <p className="text-muted-foreground mb-8">Rate your pain after therapy and add any notes.</p>

          <div className="text-6xl font-display font-extrabold text-primary mb-4">{finalPain}</div>
          <input
            type="range"
            min={0}
            max={10}
            value={finalPain}
            onChange={(e) => setFinalPain(Number(e.target.value))}
            className="w-full accent-primary mb-1"
          />
          <div className="flex justify-between text-xs text-muted-foreground mb-6">
            <span>0 — No Pain</span>
            <span>10 — Worst Pain</span>
          </div>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Session Notes / Complaints..."
            className="w-full p-3 rounded-xl border border-border bg-background text-foreground text-sm resize-none h-28 focus:outline-none focus:ring-2 focus:ring-ring mb-6"
          />

          <button
            onClick={saveSession}
            className="w-full py-3 rounded-xl gradient-medical-bg text-primary-foreground font-semibold hover:opacity-90 transition"
          >
            Save & View Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-lg py-16">
      <div className="medical-card-elevated text-center">
        {/* Timer */}
        <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
          <Clock className="h-4 w-4" />
          <span className="text-sm font-medium">{config.placement} • {config.painType}</span>
        </div>
        <div className="text-7xl md:text-8xl font-display font-extrabold text-foreground tabular-nums tracking-tight">
          {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {config.frequency} Hz · {config.pulseWidth} μs · {config.intensity} mA
        </p>

        {/* Breathing */}
        <div className="mt-10 mb-8 flex flex-col items-center">
          <div
            className={`w-28 h-28 rounded-full gradient-medical-bg flex items-center justify-center ${
              paused ? "" : "breathing-circle"
            }`}
          >
            <span className="text-primary-foreground font-semibold text-sm">
              {paused ? "Paused" : breathPhase}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-3">Box Breathing — follow the rhythm</p>
        </div>

        {/* Pause / Resume */}
        <button
          onClick={togglePause}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-border text-foreground font-semibold text-base hover:bg-muted transition mb-3"
        >
          {paused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
          {paused ? "Resume" : "Pause"}
        </button>

        {/* Emergency Stop */}
        <button
          onClick={stopSession}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-destructive text-destructive-foreground font-bold text-lg hover:opacity-90 transition"
        >
          <StopCircle className="h-6 w-6" />
          Emergency Stop
        </button>
      </div>
    </div>
  );
}
