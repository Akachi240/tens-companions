import { Link, useLocation } from "react-router-dom";
import { Activity, Home, Zap, BookOpen, BarChart3, Settings, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/session-setup", label: "Setup", icon: Zap },
  { to: "/active-session", label: "Therapy", icon: Activity },
  { to: "/education", label: "Education", icon: BookOpen },
  { to: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isSplash = location.pathname === "/";

  // Splash page renders without the shell
  if (isSplash) return <>{children}</>;

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/app-bg.jpg')" }}
    >
      {/* Header */}
      <header className="no-print sticky top-0 z-50 glass-header">
        <div className="container flex h-14 sm:h-16 items-center justify-between px-4">
          <Link to="/home" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg gradient-medical-bg">
              <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-base sm:text-lg font-bold text-foreground">TensPilot+</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/40"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:bg-white/40"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav className="md:hidden border-t border-white/30 bg-white/70 backdrop-blur-md p-3 space-y-1 max-h-[80vh] overflow-y-auto">
            {navItems.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/40"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}
      </header>

      {/* Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
