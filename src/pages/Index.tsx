import { Link } from "react-router-dom";
import { Zap, Activity, BookOpen, BarChart3, ArrowRight, Play, Check } from "lucide-react";

const features = [
  {
    to: "/session-setup",
    icon: Zap,
    title: "Setup Session",
    description: "Configure your personalised TENS parameters",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    to: "/active-session",
    icon: Activity,
    title: "Active Therapy",
    description: "Run your session with real-time guidance",
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
  },
  {
    to: "/education",
    icon: BookOpen,
    title: "Education Guide",
    description: "Learn the science behind TENS therapy",
    iconBg: "bg-medical-emerald/10",
    iconColor: "text-medical-emerald",
  },
  {
    to: "/dashboard",
    icon: BarChart3,
    title: "My Dashboard",
    description: "Track progress and export clinical reports",
    iconBg: "bg-medical-warning/10",
    iconColor: "text-medical-warning",
  },
];

const bulletPoints = [
  "Non-invasive pain relief",
  "Two evidence-based modes",
  "Real-time session tracking",
  "Clinical-grade parameters",
];

const steps = [
  { icon: Zap, label: "Setup" },
  { icon: Play, label: "Therapy" },
  { icon: BookOpen, label: "Learn" },
  { icon: BarChart3, label: "Track" },
];

export default function Index() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden hero-bg">
        <div className="absolute inset-0 gradient-medical-bg opacity-[0.04]" />
        <div className="container py-20 md:py-28 text-center relative">
          <div className="hero-badge">
            <Zap className="h-4 w-4" />
            Clinical-Grade TENS Companion
          </div>
          <h1 className="app-name text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight max-w-3xl mx-auto">
            Your Intelligent{" "}
            <span className="text-primary">TENS Therapy</span>{" "}
            Companion
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
            Evidence-based session configuration. Real-time therapy guidance. Track your recovery.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/session-setup"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-medical-bg text-primary-foreground font-semibold shadow-md hover:opacity-90 transition btn-primary"
            >
              Start a Session <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/education"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-card text-foreground font-semibold hover:bg-muted transition"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="container py-16">
        <h2 className="font-display text-2xl font-bold text-foreground mb-8 text-center">
          Your Complete TENS Therapy Toolkit
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <Link
              key={f.to}
              to={f.to}
              className="medical-card-elevated group hover:shadow-lg transition-shadow animate-in"
            >
              <div className={`inline-flex p-3 rounded-xl ${f.iconBg} ${f.iconColor} mb-4`}>
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display font-bold text-foreground text-lg">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              <span className="mt-3 inline-flex items-center text-sm font-medium text-primary gap-1 group-hover:gap-2 transition-all">
                Open <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* How TENS Works */}
      <section className="bg-gradient-to-bl from-[hsl(199_89%_97%)] to-white py-16">
        <div className="container flex flex-col md:flex-row gap-12 items-start">
          {/* Left */}
          <div className="md:w-1/2">
            <h2 className="font-display text-2xl font-bold text-foreground mb-4">
              How TENS Therapy Works
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Transcutaneous Electrical Nerve Stimulation (TENS) delivers small electrical impulses through electrodes placed on the skin. These impulses stimulate nerve fibers to block pain signals from reaching the brain, providing safe, non-invasive relief.
            </p>
            <ul className="space-y-3">
              {bulletPoints.map((point) => (
                <li key={point} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-medical-emerald text-white shrink-0">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-foreground text-sm font-medium">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — Steps */}
          <div className="md:w-1/2">
            <div className="bg-card shadow-lg border border-border rounded-2xl p-6">
              {steps.map((s, i) => (
                <div key={s.label}>
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(199_89%_94%)] text-primary shrink-0">
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
    </div>
  );
}
