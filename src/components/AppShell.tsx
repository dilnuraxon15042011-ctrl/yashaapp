import "@/lib/i18n";
import { Link, useLocation } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Home, Apple, TrendingUp, Syringe, MoreHorizontal, Heart, Activity, Eye, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { type ReactNode } from "react";
import LangSwitcher from "./LangSwitcher";

const navLinks = [
  { to: "/dashboard", icon: Home, key: "dashboard" },
  { to: "/nutrition", icon: Apple, key: "nutrition" },
  { to: "/growth", icon: TrendingUp, key: "growth" },
  { to: "/exercise", icon: Activity, key: "exercise" },
  { to: "/vaccination", icon: Syringe, key: "vaccination" },
  { to: "/deficiency", icon: Heart, key: "deficiency" },
  { to: "/screen-health", icon: Eye, key: "screen" },
  { to: "/report", icon: FileText, key: "report" },
] as const;

export default function AppShell({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-30 bg-card/90 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src="/yasha-logo.png" alt="Yasha" className="w-9 h-9 rounded-full" />
            <span className="text-xl font-bold text-primary-dark">{t("brand")}</span>
          </Link>
          <nav className="hidden lg:flex items-center gap-1 text-sm overflow-x-auto">
            {navLinks.map((l) => {
              const active = location.pathname === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`relative px-3 py-2 rounded-lg transition-colors ${
                    active ? "text-primary-dark font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {t(`nav.${l.key}`)}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute left-2 right-2 -bottom-0.5 h-0.5 rounded-full bg-primary"
                    />
                  )}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2 shrink-0">
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

      <main className="flex-1 pb-24 md:pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile bottom tab bar */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-card border-t border-border">
        <div className="grid grid-cols-5">
          {[
            { to: "/", icon: Home, key: "home" },
            { to: "/nutrition", icon: Apple, key: "nutrition" },
            { to: "/exercise", icon: Activity, key: "exercise" },
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
            <img src="/yasha-logo.png" alt="Yasha" className="w-8 h-8 rounded-full" />
            <span className="font-bold text-lg">{t("brand")} App</span>
          </div>
          <p className="text-sm opacity-90 max-w-xl">{t("footer.disclaimer")}</p>
          <LangSwitcher onDark />
        </div>
      </footer>
    </div>
  );
}
