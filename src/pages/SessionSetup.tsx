import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Info, ArrowRight, ArrowLeft, User, Plus } from "lucide-react";
import { useProfile } from "@/context/ProfileContext";

const LOCATIONS = ["Lower Back", "Knee", "Shoulder", "Wrist", "Foot", "Hip"];

interface SessionConfig {
  placement: string;
  painType: "Acute" | "Chronic";
  frequency: number;
  pulseWidth: number;
  intensity: number;
  duration: number;
  initialPain: number;
}

export default function SessionSetup() {
  const navigate = useNavigate();
  const { profiles, activeProfile, activeProfileId, setActiveProfileId, addProfile } = useProfile();
  const [step, setStep] = useState(1);
  const [newName, setNewName] = useState("");
  const [newCondition, setNewCondition] = useState("");
  const [config, setConfig] = useState<SessionConfig>({
    placement: "",
    painType: "Acute",
    frequency: 80,
    pulseWidth: 200,
    intensity: 5,
    duration: 30,
    initialPain: 5,
  });

  const updateConfig = (partial: Partial<SessionConfig>) => {
    setConfig((c) => {
      const next = { ...c, ...partial };
      if (partial.painType) {
        if (partial.painType === "Acute") {
          next.frequency = 80;
          next.pulseWidth = 200;
        } else {
          next.frequency = 4;
          next.pulseWidth = 300;
        }
      }
      return next;
    });
  };

  const canProceed =
    (step === 1 && !!activeProfileId) ||
    (step === 2 && !!config.placement) ||
    step === 3 ||
    step === 4 ||
    step === 5;

  const handleCreateProfile = () => {
    if (newName.trim()) {
      addProfile(newName.trim(), newCondition.trim() || "Not specified");
      setNewName("");
      setNewCondition("");
    }
  };

  const startSession = () => {
    sessionStorage.setItem("tens-active-session", JSON.stringify(config));
    navigate("/active-session");
  };

  const selectBodyPart = (part: string) => {
    if (LOCATIONS.includes(part)) {
      updateConfig({ placement: part });
    }
  };

  const totalSteps = 5;

  return (
    <div className="container max-w-2xl py-10">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
          <div key={s} className="flex-1">
            <div
              className={`h-2 rounded-full transition-colors ${
                s <= step ? "gradient-medical-bg" : "bg-muted"
              }`}
            />
          </div>
        ))}
      </div>

      <div className="medical-card-elevated">
        {/* Step 1: Patient Selection */}
        {step === 1 && (
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">Patient Selection</h2>
            <p className="text-muted-foreground mt-1 mb-6">Select or create a patient profile before proceeding.</p>

            {profiles.length > 0 && (
              <div className="space-y-2 mb-6">
                {profiles.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setActiveProfileId(p.id)}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition ${
                      activeProfileId === p.id
                        ? "border-primary bg-secondary text-secondary-foreground"
                        : "border-border hover:border-primary/40 text-foreground"
                    }`}
                  >
                    <User className="h-5 w-5 shrink-0 text-primary" />
                    <div>
                      <div className="font-semibold">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.primaryCondition}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="border-t border-border pt-5">
              <p className="text-sm font-medium text-foreground mb-3">Create New Profile</p>
              <div className="space-y-3">
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Patient Name"
                  className="w-full p-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <input
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  placeholder="Primary Condition"
                  className="w-full p-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  onClick={handleCreateProfile}
                  disabled={!newName.trim()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-medical-bg text-primary-foreground font-semibold text-sm disabled:opacity-40 transition hover:opacity-90"
                >
                  <Plus className="h-4 w-4" /> Add Profile
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Pain Location with SVG Body Map */}
        {step === 2 && (
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">Pain Location</h2>
            <p className="text-muted-foreground mt-1 mb-6">Select where you want to apply the TENS electrodes.</p>

            <div className="flex gap-6 flex-col sm:flex-row">
              {/* Body Map SVG */}
              <div className="flex-shrink-0 mx-auto sm:mx-0">
                <svg viewBox="0 0 200 420" className="w-40 h-auto" aria-label="Body map for electrode placement">
                  {/* Head */}
                  <circle cx="100" cy="30" r="22" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1.5" />
                  {/* Neck - unclickable, grayed out */}
                  <rect x="90" y="52" width="20" height="18" rx="4" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" opacity="0.4" />
                  <title>Neck — disabled for safety</title>
                  {/* Torso */}
                  <rect x="65" y="70" width="70" height="90" rx="12" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1.5" />
                  {/* Shoulders */}
                  <ellipse
                    cx="55" cy="82" rx="16" ry="14"
                    className={`cursor-pointer transition hover:opacity-80 ${config.placement === "Shoulder" ? "fill-primary" : "fill-[hsl(var(--secondary))]"}`}
                    stroke="hsl(var(--border))" strokeWidth="1.5"
                    onClick={() => selectBodyPart("Shoulder")}
                  />
                  <ellipse
                    cx="145" cy="82" rx="16" ry="14"
                    className={`cursor-pointer transition hover:opacity-80 ${config.placement === "Shoulder" ? "fill-primary" : "fill-[hsl(var(--secondary))]"}`}
                    stroke="hsl(var(--border))" strokeWidth="1.5"
                    onClick={() => selectBodyPart("Shoulder")}
                  />
                  {/* Lower Back */}
                  <rect
                    x="72" y="130" width="56" height="30" rx="8"
                    className={`cursor-pointer transition hover:opacity-80 ${config.placement === "Lower Back" ? "fill-primary" : "fill-[hsl(var(--secondary))]"}`}
                    stroke="hsl(var(--border))" strokeWidth="1.5"
                    onClick={() => selectBodyPart("Lower Back")}
                  />
                  {/* Hip */}
                  <ellipse
                    cx="80" cy="180" rx="18" ry="14"
                    className={`cursor-pointer transition hover:opacity-80 ${config.placement === "Hip" ? "fill-primary" : "fill-[hsl(var(--secondary))]"}`}
                    stroke="hsl(var(--border))" strokeWidth="1.5"
                    onClick={() => selectBodyPart("Hip")}
                  />
                  <ellipse
                    cx="120" cy="180" rx="18" ry="14"
                    className={`cursor-pointer transition hover:opacity-80 ${config.placement === "Hip" ? "fill-primary" : "fill-[hsl(var(--secondary))]"}`}
                    stroke="hsl(var(--border))" strokeWidth="1.5"
                    onClick={() => selectBodyPart("Hip")}
                  />
                  {/* Upper Legs */}
                  <rect x="72" y="195" width="22" height="80" rx="8" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1.5" />
                  <rect x="106" y="195" width="22" height="80" rx="8" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1.5" />
                  {/* Knee */}
                  <ellipse
                    cx="83" cy="285" rx="14" ry="12"
                    className={`cursor-pointer transition hover:opacity-80 ${config.placement === "Knee" ? "fill-primary" : "fill-[hsl(var(--secondary))]"}`}
                    stroke="hsl(var(--border))" strokeWidth="1.5"
                    onClick={() => selectBodyPart("Knee")}
                  />
                  <ellipse
                    cx="117" cy="285" rx="14" ry="12"
                    className={`cursor-pointer transition hover:opacity-80 ${config.placement === "Knee" ? "fill-primary" : "fill-[hsl(var(--secondary))]"}`}
                    stroke="hsl(var(--border))" strokeWidth="1.5"
                    onClick={() => selectBodyPart("Knee")}
                  />
                  {/* Lower Legs */}
                  <rect x="74" y="300" width="18" height="70" rx="6" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1.5" />
                  <rect x="108" y="300" width="18" height="70" rx="6" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1.5" />
                  {/* Foot */}
                  <ellipse
                    cx="83" cy="385" rx="14" ry="10"
                    className={`cursor-pointer transition hover:opacity-80 ${config.placement === "Foot" ? "fill-primary" : "fill-[hsl(var(--secondary))]"}`}
                    stroke="hsl(var(--border))" strokeWidth="1.5"
                    onClick={() => selectBodyPart("Foot")}
                  />
                  <ellipse
                    cx="117" cy="385" rx="14" ry="10"
                    className={`cursor-pointer transition hover:opacity-80 ${config.placement === "Foot" ? "fill-primary" : "fill-[hsl(var(--secondary))]"}`}
                    stroke="hsl(var(--border))" strokeWidth="1.5"
                    onClick={() => selectBodyPart("Foot")}
                  />
                  {/* Arms */}
                  <rect x="35" y="96" width="16" height="60" rx="6" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1.5" />
                  <rect x="149" y="96" width="16" height="60" rx="6" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1.5" />
                  {/* Wrist */}
                  <ellipse
                    cx="43" cy="168" rx="12" ry="10"
                    className={`cursor-pointer transition hover:opacity-80 ${config.placement === "Wrist" ? "fill-primary" : "fill-[hsl(var(--secondary))]"}`}
                    stroke="hsl(var(--border))" strokeWidth="1.5"
                    onClick={() => selectBodyPart("Wrist")}
                  />
                  <ellipse
                    cx="157" cy="168" rx="12" ry="10"
                    className={`cursor-pointer transition hover:opacity-80 ${config.placement === "Wrist" ? "fill-primary" : "fill-[hsl(var(--secondary))]"}`}
                    stroke="hsl(var(--border))" strokeWidth="1.5"
                    onClick={() => selectBodyPart("Wrist")}
                  />
                </svg>
              </div>

              {/* Dropdown + Buttons */}
              <div className="flex-1">
                <select
                  value={config.placement}
                  onChange={(e) => updateConfig({ placement: e.target.value })}
                  className="w-full p-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring mb-4"
                >
                  <option value="">Select location...</option>
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>

                <div className="grid grid-cols-2 gap-2">
                  {LOCATIONS.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => updateConfig({ placement: loc })}
                      className={`p-3 rounded-xl border text-left text-sm font-medium transition ${
                        config.placement === loc
                          ? "border-primary bg-secondary text-secondary-foreground"
                          : "border-border hover:border-primary/40 text-foreground"
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-start gap-2 p-3 rounded-lg bg-destructive/5 text-sm">
              <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
              <span className="text-foreground">
                Placement on the front or sides of the neck is disabled to prevent carotid sinus stimulation.
              </span>
            </div>
          </div>
        )}

        {/* Step 3: Pain Type */}
        {step === 3 && (
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">Pain Type</h2>
            <p className="text-muted-foreground mt-1 mb-6">This determines the recommended TENS mode.</p>

            <div className="space-y-3">
              {(["Acute", "Chronic"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => updateConfig({ painType: type })}
                  className={`w-full p-5 rounded-xl border text-left transition ${
                    config.painType === type
                      ? "border-primary bg-secondary"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <div className="font-semibold text-foreground">{type}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {type === "Acute"
                      ? "Conventional TENS (20–120 Hz) — Gate Control Theory"
                      : "Acupuncture-like TENS (1–10 Hz) — Endorphin Release"}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Parameters */}
        {step === 4 && (
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">Parameters</h2>

            <div className="mt-3 mb-6 flex items-start gap-2 p-3 rounded-lg bg-secondary text-sm">
              <Info className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <span className="text-foreground">
                Clinical recommendation applied. However, the patient's comfort is the ultimate metric—please adjust these parameters to your personal comfort level before starting.
              </span>
            </div>

            <div className="space-y-5">
              <ParamSlider
                label="Frequency (Hz)"
                value={config.frequency}
                min={config.painType === "Acute" ? 20 : 1}
                max={config.painType === "Acute" ? 120 : 10}
                onChange={(v) => updateConfig({ frequency: v })}
              />
              <ParamSlider
                label="Pulse Width (μs)"
                value={config.pulseWidth}
                min={50}
                max={400}
                step={10}
                onChange={(v) => updateConfig({ pulseWidth: v })}
              />
              <ParamSlider
                label="Intensity (mA)"
                value={config.intensity}
                min={1}
                max={80}
                onChange={(v) => updateConfig({ intensity: v })}
              />
              <ParamSlider
                label="Duration (min)"
                value={config.duration}
                min={5}
                max={60}
                step={5}
                onChange={(v) => updateConfig({ duration: v })}
              />
            </div>
          </div>
        )}

        {/* Step 5: Pain Rating */}
        {step === 5 && (
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">Pre-Session Pain Level</h2>
            <p className="text-muted-foreground mt-1 mb-6">Rate your current pain before starting therapy.</p>

            <div className="text-center">
              <div className="text-6xl font-display font-extrabold text-primary mb-4">{config.initialPain}</div>
              <input
                type="range"
                min={0}
                max={10}
                value={config.initialPain}
                onChange={(e) => updateConfig({ initialPain: Number(e.target.value) })}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0 — No Pain</span>
                <span>10 — Worst Pain</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-border">
          <button
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 1}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-30 transition"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          {step < totalSteps ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-medical-bg text-primary-foreground font-semibold disabled:opacity-40 transition hover:opacity-90"
            >
              Next <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={startSession}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-medical-bg text-primary-foreground font-semibold transition hover:opacity-90"
            >
              Start Session <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ParamSlider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <span className="text-sm font-bold text-primary">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary"
      />
      <div className="flex justify-between text-xs text-muted-foreground mt-0.5">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
