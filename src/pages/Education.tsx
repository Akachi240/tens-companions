import { useState } from "react";
import { BookOpen, Zap, Activity, ShieldAlert } from "lucide-react";

const LOCATIONS = ["Lower Back", "Knee", "Shoulder", "Wrist", "Foot", "Hip"];

const sections = [
  {
    icon: Zap,
    title: "Conventional TENS (High Frequency)",
    content: `Frequency range: 20–120 Hz. This mode is designed for acute pain relief based on Gate Control Theory. High-frequency electrical stimulation activates large-diameter Aβ nerve fibers, which "close the gate" in the spinal cord to block pain signals (C-fibers and Aδ-fibers) from reaching the brain. Onset of relief is typically rapid (within minutes) but may not persist long after the session ends. Recommended pulse width: 50–200 μs.`,
    color: "text-primary bg-primary/10",
  },
  {
    icon: Activity,
    title: "Acupuncture-like TENS (Low Frequency)",
    content: `Frequency range: 1–10 Hz. Used for chronic and neuropathic pain. Low-frequency stimulation triggers the release of endogenous opioids (endorphins and enkephalins) from the central nervous system. The onset of pain relief is slower (15–30 minutes) but tends to last longer after the session ends. Recommended pulse width: 200–400 μs with higher intensity at comfortable levels.`,
    color: "text-accent bg-accent/10",
  },
  {
    icon: ShieldAlert,
    title: "Safety & Contraindications",
    content: `TENS is generally safe for most adults. However, it should NOT be used by individuals with cardiac pacemakers or implanted defibrillators, over the carotid sinus (front/sides of neck), during pregnancy (on the abdomen or lower back), on areas of active cancer, or over metal implants without physician approval. Always start at the lowest intensity and increase gradually. Discontinue use if skin irritation, increased pain, or unusual sensations occur. This application is for educational purposes and does not replace professional medical advice.`,
    color: "text-destructive bg-destructive/10",
  },
];

export default function Education() {
  const [selectedPart, setSelectedPart] = useState("");

  const placementGuides: Record<string, string> = {
    "Lower Back": "Place two or four electrodes flanking the painful region of the lumbar spine. A crossed-channel placement (X pattern) is often most effective for lower back pain.",
    Knee: "Position electrodes around the knee joint — two on the medial side and two on the lateral side, or above and below the patella.",
    Shoulder: "Place electrodes on the anterior and posterior aspects of the shoulder, surrounding the deltoid muscle and the area of greatest pain.",
    Wrist: "Apply small electrodes on either side of the wrist joint, avoiding the carpal tunnel region directly. Best for tendinitis or repetitive strain.",
    Foot: "Position electrodes on the dorsal (top) and plantar (bottom) surfaces of the foot, or flanking the area of pain such as the arch for plantar fasciitis.",
    Hip: "Place electrodes around the greater trochanter area. A four-electrode crossed pattern can be effective for hip joint pain.",
  };

  return (
    <div className="container max-w-3xl py-10">
      <h1 className="font-display text-3xl font-bold text-foreground mb-2">Education Guide</h1>
      <p className="text-muted-foreground mb-8">Evidence-based information about TENS therapy modes, electrode placement, and safety.</p>

      <div className="space-y-5">
        {sections.map((s) => (
          <div key={s.title} className="medical-card-elevated">
            <div className="flex items-start gap-4">
              <div className={`inline-flex p-3 rounded-xl ${s.color} shrink-0`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-foreground">{s.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.content}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Electrode Placement Guide with Body Map */}
        <div className="medical-card-elevated">
          <div className="flex items-start gap-4 mb-6">
            <div className="inline-flex p-3 rounded-xl text-medical-emerald bg-medical-emerald/10 shrink-0">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-foreground">Electrode Placement Guide</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Click a body region below to see placement recommendations. Always place electrodes on clean, dry, intact skin.
              </p>
            </div>
          </div>

          <div className="flex gap-6 flex-col sm:flex-row">
            {/* Body Map SVG */}
            <div className="flex-shrink-0 mx-auto sm:mx-0">
              <svg viewBox="0 0 200 420" className="w-44 h-auto" aria-label="Body map for electrode placement">
                {/* Head */}
                <circle cx="100" cy="30" r="22" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1.5" />
                {/* Neck - unclickable, grayed out */}
                <g>
                  <rect x="90" y="52" width="20" height="18" rx="4" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" opacity="0.4" />
                  <title>Neck — disabled for safety (carotid sinus stimulation risk)</title>
                </g>
                {/* Torso */}
                <rect x="65" y="70" width="70" height="90" rx="12" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1.5" />
                {/* Shoulders */}
                <ellipse cx="55" cy="82" rx="16" ry="14"
                  className={`cursor-pointer transition hover:opacity-80 ${selectedPart === "Shoulder" ? "fill-primary" : "fill-secondary"}`}
                  stroke="hsl(var(--border))" strokeWidth="1.5"
                  onClick={() => setSelectedPart("Shoulder")}
                />
                <ellipse cx="145" cy="82" rx="16" ry="14"
                  className={`cursor-pointer transition hover:opacity-80 ${selectedPart === "Shoulder" ? "fill-primary" : "fill-secondary"}`}
                  stroke="hsl(var(--border))" strokeWidth="1.5"
                  onClick={() => setSelectedPart("Shoulder")}
                />
                {/* Lower Back */}
                <rect x="72" y="130" width="56" height="30" rx="8"
                  className={`cursor-pointer transition hover:opacity-80 ${selectedPart === "Lower Back" ? "fill-primary" : "fill-secondary"}`}
                  stroke="hsl(var(--border))" strokeWidth="1.5"
                  onClick={() => setSelectedPart("Lower Back")}
                />
                {/* Hip */}
                <ellipse cx="80" cy="180" rx="18" ry="14"
                  className={`cursor-pointer transition hover:opacity-80 ${selectedPart === "Hip" ? "fill-primary" : "fill-secondary"}`}
                  stroke="hsl(var(--border))" strokeWidth="1.5"
                  onClick={() => setSelectedPart("Hip")}
                />
                <ellipse cx="120" cy="180" rx="18" ry="14"
                  className={`cursor-pointer transition hover:opacity-80 ${selectedPart === "Hip" ? "fill-primary" : "fill-secondary"}`}
                  stroke="hsl(var(--border))" strokeWidth="1.5"
                  onClick={() => setSelectedPart("Hip")}
                />
                {/* Upper Legs */}
                <rect x="72" y="195" width="22" height="80" rx="8" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1.5" />
                <rect x="106" y="195" width="22" height="80" rx="8" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1.5" />
                {/* Knee */}
                <ellipse cx="83" cy="285" rx="14" ry="12"
                  className={`cursor-pointer transition hover:opacity-80 ${selectedPart === "Knee" ? "fill-primary" : "fill-secondary"}`}
                  stroke="hsl(var(--border))" strokeWidth="1.5"
                  onClick={() => setSelectedPart("Knee")}
                />
                <ellipse cx="117" cy="285" rx="14" ry="12"
                  className={`cursor-pointer transition hover:opacity-80 ${selectedPart === "Knee" ? "fill-primary" : "fill-secondary"}`}
                  stroke="hsl(var(--border))" strokeWidth="1.5"
                  onClick={() => setSelectedPart("Knee")}
                />
                {/* Lower Legs */}
                <rect x="74" y="300" width="18" height="70" rx="6" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1.5" />
                <rect x="108" y="300" width="18" height="70" rx="6" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1.5" />
                {/* Foot */}
                <ellipse cx="83" cy="385" rx="14" ry="10"
                  className={`cursor-pointer transition hover:opacity-80 ${selectedPart === "Foot" ? "fill-primary" : "fill-secondary"}`}
                  stroke="hsl(var(--border))" strokeWidth="1.5"
                  onClick={() => setSelectedPart("Foot")}
                />
                <ellipse cx="117" cy="385" rx="14" ry="10"
                  className={`cursor-pointer transition hover:opacity-80 ${selectedPart === "Foot" ? "fill-primary" : "fill-secondary"}`}
                  stroke="hsl(var(--border))" strokeWidth="1.5"
                  onClick={() => setSelectedPart("Foot")}
                />
                {/* Arms */}
                <rect x="35" y="96" width="16" height="60" rx="6" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1.5" />
                <rect x="149" y="96" width="16" height="60" rx="6" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1.5" />
                {/* Wrist */}
                <ellipse cx="43" cy="168" rx="12" ry="10"
                  className={`cursor-pointer transition hover:opacity-80 ${selectedPart === "Wrist" ? "fill-primary" : "fill-secondary"}`}
                  stroke="hsl(var(--border))" strokeWidth="1.5"
                  onClick={() => setSelectedPart("Wrist")}
                />
                <ellipse cx="157" cy="168" rx="12" ry="10"
                  className={`cursor-pointer transition hover:opacity-80 ${selectedPart === "Wrist" ? "fill-primary" : "fill-secondary"}`}
                  stroke="hsl(var(--border))" strokeWidth="1.5"
                  onClick={() => setSelectedPart("Wrist")}
                />
              </svg>
            </div>

            {/* Location buttons + guidance */}
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-2 mb-4">
                {LOCATIONS.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setSelectedPart(loc)}
                    className={`p-3 rounded-xl border text-left text-sm font-medium transition ${
                      selectedPart === loc
                        ? "border-primary bg-secondary text-secondary-foreground"
                        : "border-border hover:border-primary/40 text-foreground"
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>

              {selectedPart && placementGuides[selectedPart] && (
                <div className="p-4 rounded-xl bg-secondary border border-border">
                  <p className="text-sm font-semibold text-foreground mb-1">{selectedPart}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{placementGuides[selectedPart]}</p>
                </div>
              )}

              {!selectedPart && (
                <p className="text-sm text-muted-foreground italic">Select a body region to see placement guidance.</p>
              )}
            </div>
          </div>

          <div className="mt-5 flex items-start gap-2 p-3 rounded-lg bg-destructive/5 text-sm">
            <ShieldAlert className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
            <span className="text-foreground">
              Placement on the front or sides of the neck is disabled to prevent carotid sinus stimulation.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
