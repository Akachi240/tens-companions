import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Info, ArrowRight, ArrowLeft } from "lucide-react";

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
  const [step, setStep] = useState(1);
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
      // Auto-calculate when painType changes
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
    (step === 1 && config.placement) ||
    step === 2 ||
    step === 3 ||
    step === 4;

  const startSession = () => {
    sessionStorage.setItem(
      "tens-active-session",
      JSON.stringify(config)
    );
    navigate("/active-session");
  };

  return (
    <div className="container max-w-2xl py-10">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex-1 flex items-center gap-2">
            <div
              className={`h-2 flex-1 rounded-full transition-colors ${
                s <= step ? "gradient-medical-bg" : "bg-muted"
              }`}
            />
          </div>
        ))}
      </div>

      <div className="medical-card-elevated">
        {/* Step 1: Pain Location */}
        {step === 1 && (
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">Pain Location</h2>
            <p className="text-muted-foreground mt-1 mb-6">Select where you want to apply the TENS electrodes.</p>

            <div className="grid grid-cols-2 gap-3">
              {LOCATIONS.map((loc) => (
                <button
                  key={loc}
                  onClick={() => updateConfig({ placement: loc })}
                  className={`p-4 rounded-xl border text-left font-medium transition ${
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

        {/* Step 2: Pain Type */}
        {step === 2 && (
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

        {/* Step 3: Parameters */}
        {step === 3 && (
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

        {/* Step 4: Pain Rating */}
        {step === 4 && (
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
          {step < 4 ? (
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
