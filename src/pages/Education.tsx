import { useState } from "react";
import { BookOpen, Zap, ShieldAlert } from "lucide-react";

const LOCATIONS = ["Lower Back", "Knee", "Shoulder", "Wrist", "Foot", "Hip"];

const placementGuides: Record<string, string> = {
  "Lower Back": "Place two or four electrodes flanking the painful region of the lumbar spine. A crossed-channel placement (X pattern) is often most effective for lower back pain.",
  Knee: "Position electrodes around the knee joint — two on the medial side and two on the lateral side, or above and below the patella.",
  Shoulder: "Place electrodes on the anterior and posterior aspects of the shoulder, surrounding the deltoid muscle and the area of greatest pain.",
  Wrist: "Apply small electrodes on either side of the wrist joint, avoiding the carpal tunnel region directly. Best for tendinitis or repetitive strain.",
  Foot: "Position electrodes on the dorsal (top) and plantar (bottom) surfaces of the foot, or flanking the area of pain such as the arch for plantar fasciitis.",
  Hip: "Place electrodes around the greater trochanter area. A four-electrode crossed pattern can be effective for hip joint pain.",
};

type TabKey = "theory" | "placement" | "safety";

export default function Education() {
  const [activeTab, setActiveTab] = useState<TabKey>("theory");
  const [selectedPart, setSelectedPart] = useState("");

  const tabs: { key: TabKey; label: string; shortLabel: string }[] = [
    { key: "theory", label: "⚡ Gate Control Theory", shortLabel: "⚡ Gate Control" },
    { key: "placement", label: "📍 Placement Guide", shortLabel: "📍 Placement" },
    { key: "safety", label: "🛡️ Safety & Tips", shortLabel: "🛡️ Safety" },
  ];

  return (
    <div className="container max-w-3xl py-6 sm:py-10 px-4">
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">Education Guide</h1>
      <p className="text-muted-foreground text-sm mb-6 sm:mb-8">Evidence-based information about TENS therapy modes, electrode placement, and safety.</p>

      {/* Tab Bar */}
      <div className="flex border-b border-border mb-6 sm:mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 sm:px-4 py-2 sm:py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab.key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="sm:hidden">{tab.shortLabel}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab 1: Gate Control Theory */}
      {activeTab === "theory" && (
        <div className="space-y-5 sm:space-y-6">
          <div className="flex items-start gap-3">
            <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary shrink-0">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-base sm:text-lg font-bold text-foreground">How TENS Blocks Pain</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                In 1965, Ronald Melzack and Patrick Wall proposed the Gate Control Theory of Pain. They described a "gating mechanism" in the spinal cord's dorsal horn that modulates the transmission of pain signals to the brain. TENS therapy leverages this mechanism by electrically stimulating sensory nerves.
              </p>
            </div>
          </div>

          {/* 3-column animation cards */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 p-3 sm:p-5 rounded-xl bg-primary/5">
            <div className="text-center p-2 sm:p-4 rounded-xl bg-card border border-border">
              <div className="text-xl sm:text-3xl mb-1 sm:mb-2">⚡</div>
              <h3 className="font-display font-bold text-foreground text-xs sm:text-sm">TENS Stimulation</h3>
              <p className="text-xs text-muted-foreground mt-1 hidden sm:block">Aβ nerve fiber activation through skin electrodes</p>
            </div>
            <div className="text-center p-2 sm:p-4 rounded-xl bg-card border border-border animate-pulse-subtle">
              <div className="text-xl sm:text-3xl mb-1 sm:mb-2">🚪</div>
              <h3 className="font-display font-bold text-foreground text-xs sm:text-sm">Gate Closes</h3>
              <p className="text-xs text-muted-foreground mt-1 hidden sm:block">Spinal cord dorsal horn inhibits pain transmission</p>
            </div>
            <div className="text-center p-2 sm:p-4 rounded-xl bg-card border border-border">
              <div className="text-xl sm:text-3xl mb-1 sm:mb-2">🧠</div>
              <h3 className="font-display font-bold text-foreground text-xs sm:text-sm">Pain Reduced</h3>
              <p className="text-xs text-muted-foreground mt-1 hidden sm:block">Fewer pain signals reach the brain</p>
            </div>
          </div>

          {/* Two Modes */}
          <h3 className="font-display text-base font-bold text-foreground">Two Modes of Action</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="p-3 sm:p-4 rounded-xl border border-border bg-card">
              <h4 className="font-display font-bold text-foreground text-sm mb-2">High-Frequency TENS (20–120 Hz)</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Gate control mechanism. Fast onset of relief. Ideal for acute musculoskeletal pain. Uses pulse widths of 50–200 μs.
              </p>
            </div>
            <div className="p-3 sm:p-4 rounded-xl border border-border bg-card">
              <h4 className="font-display font-bold text-foreground text-sm mb-2">Low-Frequency TENS (1–10 Hz)</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Endorphin release mechanism. Sustained relief over time. Ideal for chronic neuropathic pain. Uses pulse widths of 200–400 μs.
              </p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground italic">
            Melzack & Wall (1965) · Han (2004) · Sluka & Walsh (2003)
          </p>
        </div>
      )}

      {/* Tab 2: Placement Guide */}
      {activeTab === "placement" && (
        <div className="space-y-5">
          <div className="medical-card-elevated">
            <div className="flex items-start gap-4 mb-4 sm:mb-6">
              <div className="inline-flex p-3 rounded-xl text-medical-emerald bg-medical-emerald/10 shrink-0">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-base sm:text-lg font-bold text-foreground">Electrode Placement Guide</h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Click a body region below to see placement recommendations. Always place electrodes on clean, dry, intact skin.
                </p>
              </div>
            </div>

            <div className="flex gap-4 sm:gap-6 flex-col sm:flex-row">
              {/* Body Map SVG */}
              <div className="flex-shrink-0 mx-auto sm:mx-0 overflow-hidden">
                <svg viewBox="0 0 200 420" className="w-36 sm:w-44 h-auto" aria-label="Body map for electrode placement">
                  <circle cx="100" cy="30" r="22" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1.5" />
                  <g>
                    <rect x="90" y="52" width="20" height="18" rx="4" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" opacity="0.4" />
                    <title>Neck — disabled for safety (carotid sinus stimulation risk)</title>
                  </g>
                  <rect x="65" y="70" width="70" height="90" rx="12" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1.5" />
                  <ellipse cx="55" cy="82" rx="16" ry="14" className={`cursor-pointer transition hover:opacity-80 ${selectedPart === "Shoulder" ? "fill-primary" : "fill-secondary"}`} stroke="hsl(var(--border))" strokeWidth="1.5" onClick={() => setSelectedPart("Shoulder")} />
                  <ellipse cx="145" cy="82" rx="16" ry="14" className={`cursor-pointer transition hover:opacity-80 ${selectedPart === "Shoulder" ? "fill-primary" : "fill-secondary"}`} stroke="hsl(var(--border))" strokeWidth="1.5" onClick={() => setSelectedPart("Shoulder")} />
                  <rect x="72" y="130" width="56" height="30" rx="8" className={`cursor-pointer transition hover:opacity-80 ${selectedPart === "Lower Back" ? "fill-primary" : "fill-secondary"}`} stroke="hsl(var(--border))" strokeWidth="1.5" onClick={() => setSelectedPart("Lower Back")} />
                  <ellipse cx="80" cy="180" rx="18" ry="14" className={`cursor-pointer transition hover:opacity-80 ${selectedPart === "Hip" ? "fill-primary" : "fill-secondary"}`} stroke="hsl(var(--border))" strokeWidth="1.5" onClick={() => setSelectedPart("Hip")} />
                  <ellipse cx="120" cy="180" rx="18" ry="14" className={`cursor-pointer transition hover:opacity-80 ${selectedPart === "Hip" ? "fill-primary" : "fill-secondary"}`} stroke="hsl(var(--border))" strokeWidth="1.5" onClick={() => setSelectedPart("Hip")} />
                  <rect x="72" y="195" width="22" height="80" rx="8" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1.5" />
                  <rect x="106" y="195" width="22" height="80" rx="8" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1.5" />
                  <ellipse cx="83" cy="285" rx="14" ry="12" className={`cursor-pointer transition hover:opacity-80 ${selectedPart === "Knee" ? "fill-primary" : "fill-secondary"}`} stroke="hsl(var(--border))" strokeWidth="1.5" onClick={() => setSelectedPart("Knee")} />
                  <ellipse cx="117" cy="285" rx="14" ry="12" className={`cursor-pointer transition hover:opacity-80 ${selectedPart === "Knee" ? "fill-primary" : "fill-secondary"}`} stroke="hsl(var(--border))" strokeWidth="1.5" onClick={() => setSelectedPart("Knee")} />
                  <rect x="74" y="300" width="18" height="70" rx="6" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1.5" />
                  <rect x="108" y="300" width="18" height="70" rx="6" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1.5" />
                  <ellipse cx="83" cy="385" rx="14" ry="10" className={`cursor-pointer transition hover:opacity-80 ${selectedPart === "Foot" ? "fill-primary" : "fill-secondary"}`} stroke="hsl(var(--border))" strokeWidth="1.5" onClick={() => setSelectedPart("Foot")} />
                  <ellipse cx="117" cy="385" rx="14" ry="10" className={`cursor-pointer transition hover:opacity-80 ${selectedPart === "Foot" ? "fill-primary" : "fill-secondary"}`} stroke="hsl(var(--border))" strokeWidth="1.5" onClick={() => setSelectedPart("Foot")} />
                  <rect x="35" y="96" width="16" height="60" rx="6" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1.5" />
                  <rect x="149" y="96" width="16" height="60" rx="6" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1.5" />
                  <ellipse cx="43" cy="168" rx="12" ry="10" className={`cursor-pointer transition hover:opacity-80 ${selectedPart === "Wrist" ? "fill-primary" : "fill-secondary"}`} stroke="hsl(var(--border))" strokeWidth="1.5" onClick={() => setSelectedPart("Wrist")} />
                  <ellipse cx="157" cy="168" rx="12" ry="10" className={`cursor-pointer transition hover:opacity-80 ${selectedPart === "Wrist" ? "fill-primary" : "fill-secondary"}`} stroke="hsl(var(--border))" strokeWidth="1.5" onClick={() => setSelectedPart("Wrist")} />
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
                  <div className="p-3 sm:p-4 rounded-xl bg-secondary border border-border">
                    <p className="text-sm font-semibold text-foreground mb-1">{selectedPart}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{placementGuides[selectedPart]}</p>
                  </div>
                )}

                {!selectedPart && (
                  <p className="text-sm text-muted-foreground italic">Select a body region to see placement guidance.</p>
                )}
              </div>
            </div>

            <div className="mt-4 sm:mt-5 flex items-start gap-2 p-3 rounded-lg bg-destructive/5 text-sm">
              <ShieldAlert className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
              <span className="text-foreground">
                Placement on the front or sides of the neck is disabled to prevent carotid sinus stimulation.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Safety & Tips */}
      {activeTab === "safety" && (
        <div className="space-y-4 sm:space-y-6">
          {/* Danger box */}
          <div className="border-l-4 border-destructive bg-destructive/5 p-4 sm:p-5 rounded-r-xl">
            <h3 className="font-display font-bold text-foreground mb-3">⛔ Do NOT use TENS if you:</h3>
            <ul className="space-y-2 text-sm text-foreground">
              <li className="flex items-start gap-2"><span className="text-destructive shrink-0">•</span>Have a cardiac pacemaker or implanted defibrillator</li>
              <li className="flex items-start gap-2"><span className="text-destructive shrink-0">•</span>Have epilepsy or a seizure disorder</li>
              <li className="flex items-start gap-2"><span className="text-destructive shrink-0">•</span>Are in the first trimester of pregnancy</li>
              <li className="flex items-start gap-2"><span className="text-destructive shrink-0">•</span>Have open wounds or broken skin at electrode sites</li>
            </ul>
          </div>

          {/* Best Practices box */}
          <div className="border-l-4 border-primary bg-primary/5 p-4 sm:p-5 rounded-r-xl">
            <h3 className="font-display font-bold text-foreground mb-3">✅ Best Practices</h3>
            <ul className="space-y-2 text-sm text-foreground">
              <li className="flex items-start gap-2"><span className="text-primary shrink-0">•</span>Start at the lowest intensity and increase gradually</li>
              <li className="flex items-start gap-2"><span className="text-primary shrink-0">•</span>Ensure skin is clean and dry before applying electrodes</li>
              <li className="flex items-start gap-2"><span className="text-primary shrink-0">•</span>Keep sessions between 15–45 minutes for optimal results</li>
              <li className="flex items-start gap-2"><span className="text-primary shrink-0">•</span>Do not sleep during a TENS session</li>
              <li className="flex items-start gap-2"><span className="text-primary shrink-0">•</span>Store electrode pads in a cool, sealed container to extend their lifespan</li>
              <li className="flex items-start gap-2"><span className="text-primary shrink-0">•</span>Always consult your doctor before starting TENS therapy</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
