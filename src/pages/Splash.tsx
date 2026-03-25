import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

export default function Splash() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      {/* Logo */}
      <div className="w-14 h-14 rounded-2xl bg-white/50 backdrop-blur-md border border-white/60 flex items-center justify-center mb-3">
        <Zap className="h-7 w-7 text-[var(--accent-hex)]" />
      </div>
      <p className="text-lg font-medium mb-10" style={{ fontFamily: "'Jost', sans-serif", color: "var(--ink)" }}>
        TensPilot+
      </p>

      {/* Headline */}
      <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight mb-6">
        <span style={{ color: "var(--ink)" }}>Relief,</span>
        <br />
        <span className="italic" style={{ color: "var(--accent-hex)" }}>made</span>
        <br />
        <span className="italic" style={{ color: "var(--accent-hex)" }}>for you</span>
      </h1>

      {/* Subtext */}
      <p className="text-base max-w-xs mb-10" style={{ color: "var(--ink-muted)" }}>
        Personalised TENS therapy, guided by science.
      </p>

      {/* CTA */}
      <Link
        to="/home"
        className="inline-flex items-center justify-center px-12 py-4 rounded-full text-white font-semibold text-base shadow-lg hover:opacity-90 transition"
        style={{ backgroundColor: "var(--ink)" }}
      >
        GET STARTED
      </Link>
    </div>
  );
}
