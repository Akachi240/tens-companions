import { Link } from "react-router-dom";
import { Zap, Activity, BookOpen, BarChart3, ArrowRight, Play, Check } from "lucide-react";

const features = [
  {
    to: "/session-setup",
    icon: Zap,
    title: "Setup Session",
    description: "Configure your personalised TENS parameters",
  },
  {
    to: "/active-session",
    icon: Activity,
    title: "Active Therapy",
    description: "Run your session with real-time guidance",
  },
  {
    to: "/education",
    icon: BookOpen,
    title: "Education Guide",
    description: "Learn the science behind TENS therapy",
  },
  {
    to: "/dashboard",
    icon: BarChart3,
    title: "My Dashboard",
    description: "Track progress and export clinical reports",
  },
];

const bulletPoints = [
  "Non-invasive pain relief",
  "Two evidence-based modes",
  "Real-time session tracking",
  "Clinical-grade parameters",
];

const steps = [
  { icon: Zap, label: "Setup", emoji: "⚡" },
  { icon: Play, label: "Therapy", emoji: "🏃" },
  { icon: BookOpen, label: "Learn", emoji: "📚" },
  { icon: BarChart3, label: "Track", emoji: "📊" },
];

export default function Index() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container py-8 md:py-24 text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            Clinical-Grade TENS Companion
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight max-w-3xl mx-auto">
            Your Intelligent{" "}
            <span className="text-primary">TENS Therapy</span>{" "}
            Companion
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
            Evidence-based session configuration. Real-time therapy guidance. Track your recovery.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row flex-wrap justify-center gap-3">
            <Link
              to="/session-setup"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl gradient-medical-bg text-primary-foreground font-semibold shadow-md hover:opacity-90 transition w-full sm:w-auto"
            >
              Start a Session <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/education"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-primary/40 bg-white/40 backdrop-blur-sm text-primary font-semibold hover:bg-white/60 transition w-full sm:w-auto"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="container py-16">
        <h2 className="font-display text-2xl font-bold mb-8 text-center">
          Your Complete TENS Therapy Toolkit
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
          {features.map((f) => (
            <Link
              key={f.to}
              to={f.to}
              className="medical-card-elevated group hover:shadow-lg transition-shadow"
            >
              <div className="inline-flex p-2.5 sm:p-3 rounded-xl bg-[var(--surface-tint)] text-primary mb-4">
                <f.icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="font-display font-bold text-base sm:text-lg">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed hidden sm:block">{f.description}</p>
              <span className="mt-3 inline-flex items-center text-sm font-medium text-primary gap-1 group-hover:gap-2 transition-all">
                Open <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* How TENS Works — Desktop */}
      <section className="py-16 hidden md:block">
        <div className="container flex flex-row gap-12 items-start">
          <div className="md:w-1/2">
            <h2 className="font-display text-2xl font-bold mb-4">
              How TENS Therapy Works
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Transcutaneous Electrical Nerve Stimulation (TENS) delivers small electrical impulses through electrodes placed on the skin. These impulses stimulate nerve fibers to block pain signals from reaching the brain, providing safe, non-invasive relief.
            </p>
            <ul className="space-y-3">
              {bulletPoints.map((point) => (
                <li key={point} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shrink-0">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-foreground text-sm font-medium">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:w-1/2">
            <div className="medical-card-elevated">
              {steps.map((s, i) => (
                <div key={s.label}>
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-tint)] text-primary shrink-0">
                      <s.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Step {i + 1}</p>
                      <p className="font-display font-bold text-foreground">{s.label}</p>
                    </div>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-0.5 h-6 bg-border mx-auto ml-5" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How TENS Works — Mobile simplified */}
      <section className="flex md:hidden flex-col gap-3 py-6 container">
        <h2 className="font-display text-xl font-bold mb-1">How It Works</h2>
        {steps.map((s) => (
          <div key={s.label} className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-tint)] text-primary shrink-0">
              <s.icon className="h-4 w-4" />
            </div>
            <span className="text-foreground font-medium">{s.emoji} {s.label}</span>
          </div>
        ))}
      </section>
    </div>
  );
}
