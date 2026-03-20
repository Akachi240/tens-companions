import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Info, ArrowRight, ArrowLeft, User, Plus, ShieldCheck } from "lucide-react";
import { useProfile } from "@/context/ProfileContext";

const LOCATIONS = ["Lower Back", "Knee", "Shoulder", "Wrist", "Foot", "Hip"];

const SAFETY_CHECKS = [
  "I do not have a cardiac pacemaker or implantable defibrillator.",
  "Electrodes are NOT placed over the chest, neck/carotid area, or head.",
  "Skin at electrode sites is clean and unbroken.",
  "I am not in the first trimester of pregnancy.",
  "Device power bank is connected and emergency switch is accessible.",
];

interface SessionConfig {
  placement: string;
  painType: "Acute" | "Chronic";
  frequency: number;
  pulseWidth: number;
  intensity: number;
  duration: number;
  initialPain: number;
}

type SkinSensitivity = "normal" | "sensitive" | "very";

const SENSITIVITY_OPTIONS: { value: SkinSensitivity; label: string; emoji: string; desc: string }[] = [
  { value: "normal", label: "Normal", emoji: "🙂", desc: "Standard intensity" },
  { value: "sensitive", label: "Sensitive", emoji: "⚠️", desc: "-1 intensity" },
  { value: "very", label: "Very Sensitive", emoji: "🔴", desc: "-2 intensity" },
];

function getFreqZone(freq: number) {
  if (freq <= 10) return { label: "⚡ Acupuncture-like range (1–10 Hz)", color: "text-blue-600" };
  if (freq <= 19) return { label: "— Between zones", color: "text-muted-foreground" };
  return { label: "✅ Conventional range (20–120 Hz)", color: "text-green-600" };
}

export default function SessionSetup() {
  const navigate = useNavigate();
  const { profiles, activeProfile, activeProfileId, setActiveProfileId, addProfile } = useProfile();
  const [step, setStep] = useState(0);
  const [safetyChecks, setSafetyChecks] = useState<boolean[]>(new Array(SAFETY_CHECKS.length).fill(false));
  const [newName, setNewName] = useState("");
  const [newCondition, setNewCondition] = useState("");
  const [skinSensitivity, setSkinSensitivity] = useState<SkinSensitivity>("normal");
  const [baseIntensity, setBaseIntensity] = useState(5);
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

  const allSafetyChecked = safetyChecks.every(Boolean);

  const canProceed =
    (step === 0 && allSafetyChecked) ||
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

  const handleSkinSensitivity = (value: SkinSensitivity) => {
    setSkinSensitivity(value);
    if (value === "sensitive") {
      setConfig((c) => ({ ...c, intensity: Math.max(1, baseIntensity - 1) }));
    } else if (value === "very") {
      setConfig((c) => ({ ...c, intensity: Math.max(1, baseIntensity - 2) }));
    } else {
      setConfig((c) => ({ ...c, intensity: baseIntensity }));
    }
  };

  const startSession = () => {
    sessionStorage.setItem(
      "tens-active-session",
      JSON.stringify({ ...config, skinSensitivity })
    );
    navigate("/active-session");
  };

  const toggleSafety = (index: number) => {
    setSafetyChecks((prev) => prev.map((v, i) => (i === index ? !v : v)));
  };

  const totalSteps = 6;
  const freqZone = getFreqZone(config.frequency);

  return (
    <div className="container max-w-2xl py-10">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {Array.from({ length: totalSteps }, (_, i) => i).map((s) => (
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
        {/* Step 0: Safety Gate */}
        {step === 0 && (
          <div>
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <h2 className="font-display text-2xl font-bold text-foreground">🛡️ Pre-Session Safety Check</h2>
            </div>
            <p className="text-muted-foreground mt-1 mb-6">Please confirm ALL safety criteria before proceeding.</p>

            <div className="space-y-3">
              {SAFETY_CHECKS.map((label, i) => (
                <label
                  key={i}
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition ${
                    safetyChecks[i]
                      ? "border-primary bg-secondary"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={safetyChecks[i]}
                    onChange={() => toggleSafety(i)}
                    className="mt-0.5 h-4 w-4 rounded border-border text-primary accent-primary"
                  />
                  <span className="text-sm text-foreground leading-relaxed">{label}</span>
                </label>
              ))}
            </div>

            {!allSafetyChecked && (
              <div className="mt-5 flex items-start gap-2 p-3 rounded-lg bg-destructive/5 text-sm">
                <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                <span className="text-foreground">All safety checks must be confirmed before continuing.</span>
              </div>
            )}
          </div>
        )}

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

        {/* Step 2: Pain Location */}
        {step === 2 && (
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">📍 Electrode Placement</h2>
            <p className="text-muted-foreground mt-1 mb-6">Select where you want to apply the TENS electrodes.</p>

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
              <button
                onClick={() => updateConfig({ painType: "Acute" })}
                className={`w-full p-5 rounded-xl border text-left transition ${
                  config.painType === "Acute"
                    ? "border-primary bg-secondary"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <div className="font-semibold text-foreground">🦴 Acute / Musculoskeletal Pain</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Conventional TENS (20–120 Hz) — Gate Control Theory
                </div>
              </button>
              <button
                onClick={() => updateConfig({ painType: "Chronic" })}
                className={`w-full p-5 rounded-xl border text-left transition ${
                  config.painType === "Chronic"
                    ? "border-primary bg-secondary"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <div className="font-semibold text-foreground">⚡ Chronic / Neuropathic Pain</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Acupuncture-like TENS (1–10 Hz) — Endorphin Release
                </div>
              </button>
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
              <div>
                <ParamSlider
                  label="Frequency (Hz)"
                  value={config.frequency}
                  min={config.painType === "Acute" ? 20 : 1}
                  max={config.painType === "Acute" ? 120 : 10}
                  onChange={(v) => updateConfig({ frequency: v })}
                />
                {/* Frequency zone bar */}
                <div className="w-full h-2 rounded-full flex overflow-hidden mt-1">
                  <div className="bg-blue-400" style={{ width: "7.6%" }} title="Acupuncture-like (1–10 Hz)" />
                  <div className="bg-gray-300" style={{ width: "7.6%" }} title="Between zones (11–19 Hz)" />
                  <div className="bg-green-400" style={{ width: "84.8%" }} title="Conventional (20–120 Hz)" />
                </div>
                <p className={`text-xs mt-1 font-medium ${freqZone.color}`}>{freqZone.label}</p>
              </div>

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
                onChange={(v) => {
                  updateConfig({ intensity: v });
                  setBaseIntensity(v);
                  setSkinSensitivity("normal");
                }}
              />
              <ParamSlider
                label="⏱️ Duration (min)"
                value={config.duration}
                min={5}
                max={60}
                step={5}
                onChange={(v) => updateConfig({ duration: v })}
              />

              {/* Skin Sensitivity */}
              <div>
                <div className="mb-2">
                  <label className="text-sm font-medium text-foreground">Skin Sensitivity</label>
                  <p className="text-xs text-muted-foreground">Adjusts intensity automatically</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {SENSITIVITY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleSkinSensitivity(opt.value)}
                      className={`p-3 rounded-xl border text-center transition ${
                        skinSensitivity === opt.value
                          ? "border-primary bg-secondary"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      <div className="text-xl mb-1">{opt.emoji}</div>
                      <div className="text-sm font-semibold text-foreground">{opt.label}</div>
                      <div className="text-xs text-muted-foreground">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Pain Rating */}
        {step === 5 && (
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">❤️ How is your pain right now?</h2>
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
            disabled={step === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-30 transition"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          {step < totalSteps - 1 ? (
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