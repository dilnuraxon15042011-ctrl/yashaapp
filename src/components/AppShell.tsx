import { Link, useLocation } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Home, Apple, TrendingUp, Syringe, MoreHorizontal, Heart, User } from "lucide-react";
import { type ReactNode } from "react";
import LangSwitcher from "./LangSwitcher";

const sidebarLinks = [
  { to: "/dashboard", icon: Home, key: "dashboard" },
  { to: "/nutrition", icon: Apple, key: "nutrition" },
  { to: "/growth", icon: TrendingUp, key: "growth" },
  { to: "/deficiency", icon: Heart, key: "deficiency" },
  { to: "/vaccination", icon: Syringe, key: "vaccination" },
  { to: "/screen-health", icon: User, key: "screen" },
  { to: "/report", icon: User, key: "report" },
] as const;

export default function AppShell({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-30 bg-card/90 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl yasha-hero-gradient grid place-items-center text-primary-foreground font-bold">Y</span>
            <span className="text-xl font-bold text-primary-dark">{t("brand")}</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1 text-sm">
            {sidebarLinks.slice(0, 6).map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === l.to
                    ? "bg-primary-light text-primary-dark font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {t(`nav.${l.key}`)}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <LangSwitcher />
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center justify-center min-h-11 px-4 rounded-xl bg-primary text-primary-foreground font-medium shadow-sm hover:bg-primary-dark transition-colors"
            >
              {t("nav.login")}
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pb-24 md:pb-12">{children}</main>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-card border-t border-border">
        <div className="grid grid-cols-5">
          {[
            { to: "/", icon: Home, key: "home" },
            { to: "/nutrition", icon: Apple, key: "nutrition" },
            { to: "/growth", icon: TrendingUp, key: "growth" },
            { to: "/vaccination", icon: Syringe, key: "vaccination" },
            { to: "/dashboard", icon: MoreHorizontal, key: "more" },
          ].map((l) => {
            const Icon = l.icon;
            const active = location.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`min-h-14 flex flex-col items-center justify-center gap-0.5 text-[11px] ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                {t(`nav.${l.key}`)}
              </Link>
            );
          })}
        </div>
      </nav>

      <footer className="bg-trust text-trust-foreground">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-primary grid place-items-center font-bold">Y</span>
            <span className="font-bold text-lg">{t("brand")} App</span>
          </div>
          <p className="text-sm opacity-90 max-w-xl">{t("footer.disclaimer")}</p>
          <LangSwitcher onDark />
        </div>
      </footer>
    </div>
  );
}
