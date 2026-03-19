import { Link } from "react-router-dom";
import { Zap, Activity, BookOpen, BarChart3, ArrowRight } from "lucide-react";

const features = [
  {
    to: "/session-setup",
    icon: Zap,
    title: "Setup Session",
    description: "Configure your TENS therapy with clinically guided parameters.",
    color: "bg-primary/10 text-primary",
  },
  {
    to: "/active-session",
    icon: Activity,
    title: "Active Therapy",
    description: "Real-time session timer with breathing exercises and safety controls.",
    color: "bg-accent/10 text-accent",
  },
  {
    to: "/education",
    icon: BookOpen,
    title: "Education Guide",
    description: "Learn about Gate Control Theory, electrode placement, and safety.",
    color: "bg-medical-emerald/10 text-medical-emerald",
  },
  {
    to: "/dashboard",
    icon: BarChart3,
    title: "My Dashboard",
    description: "Track your progress, view pain trends, and export doctor reports.",
    color: "bg-medical-warning/10 text-medical-warning",
  },
];

export default function Index() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-medical-bg opacity-[0.04]" />
        <div className="container py-20 md:py-28 text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-6">
            <Activity className="h-4 w-4" />
            Clinical-Grade TENS Therapy
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight max-w-3xl mx-auto">
            Your Intelligent{" "}
            <span className="text-primary">TENS Therapy</span>{" "}
            Companion
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-xl mx-auto">
            Evidence-based session configuration, real-time therapy guidance, and comprehensive pain tracking — all in one place.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/session-setup"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-medical-bg text-primary-foreground font-semibold shadow-md hover:opacity-90 transition"
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
      <section className="container pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <Link
              key={f.to}
              to={f.to}
              className="medical-card-elevated group hover:shadow-lg transition-shadow"
            >
              <div className={`inline-flex p-3 rounded-xl ${f.color} mb-4`}>
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
    </div>
  );
}
