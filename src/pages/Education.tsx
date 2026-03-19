import { BookOpen, Zap, Activity, ShieldAlert } from "lucide-react";

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
    icon: BookOpen,
    title: "Electrode Placement Guide",
    content: `Always place electrodes on clean, dry, intact skin. Position pads around the area of pain — typically two or four electrodes flanking the painful region. Avoid placing electrodes over the eyes, front or sides of the neck, open wounds, or areas of impaired sensation. For lower back pain, a crossed-channel placement is often effective. Consult your healthcare provider for condition-specific guidance.`,
    color: "text-medical-emerald bg-medical-emerald/10",
  },
  {
    icon: ShieldAlert,
    title: "Safety & Contraindications",
    content: `TENS is generally safe for most adults. However, it should NOT be used by individuals with cardiac pacemakers or implanted defibrillators, over the carotid sinus (front/sides of neck), during pregnancy (on the abdomen or lower back), on areas of active cancer, or over metal implants without physician approval. Always start at the lowest intensity and increase gradually. Discontinue use if skin irritation, increased pain, or unusual sensations occur. This application is for educational purposes and does not replace professional medical advice.`,
    color: "text-destructive bg-destructive/10",
  },
];

export default function Education() {
  return (
    <div className="container max-w-3xl py-10">
      <h1 className="font-display text-3xl font-bold text-foreground mb-2">Education Guide</h1>
      <p className="text-muted-foreground mb-8">Evidence-based information about TENS therapy modes and safety.</p>

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
      </div>
    </div>
  );
}
