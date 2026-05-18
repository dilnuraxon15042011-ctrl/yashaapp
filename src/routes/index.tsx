import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Apple, TrendingUp, Heart, Syringe, Eye, FileText, Users, Stethoscope, User } from "lucide-react";
import AppShell from "@/components/AppShell";

export const Route = createFileRoute("/")({ component: Index });

function Index() {
  const { t } = useTranslation();
  return (
    <AppShell>
      {/* Hero */}
      <section className="yasha-hero-gradient text-primary-foreground">
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-28 text-center">
          <p className="text-xs uppercase tracking-[0.2em] opacity-90 mb-4">Uzbekistan · Free · Bilingual</p>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">{t("tagline")}</h1>
          <p className="mt-5 text-lg md:text-xl opacity-95 max-w-2xl mx-auto">{t("subhead")}</p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link to="/dashboard" className="inline-flex items-center justify-center min-h-12 px-6 rounded-xl bg-white text-primary-dark font-semibold shadow-sm hover:bg-primary-light transition-colors">
              {t("hero.cta")}
            </Link>
            <Link to="/deficiency" className="inline-flex items-center justify-center min-h-12 px-6 rounded-xl bg-white/15 border border-white/40 text-white font-medium hover:bg-white/25 transition-colors">
              {t("hero.secondary")}
            </Link>
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { Icon: Users, key: "parent", desc: "Track every child's nutrition, growth, vaccines, and screen time in one place." },
            { Icon: Stethoscope, key: "doctor", desc: "Get a clean, printable PDF summary parents can bring to your clinic." },
            { Icon: User, key: "individual", desc: "Personal screening for nutrient deficiencies — no login required." },
          ].map(({ Icon, key, desc }) => (
            <div key={key} className="yasha-card p-6">
              <div className="w-12 h-12 rounded-xl bg-primary-light text-primary-dark grid place-items-center mb-4">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg">{t(`roles.${key}`)}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Modules */}
      <section className="bg-primary-light/40">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center">Everything one family needs</h2>
          <p className="mt-2 text-center text-muted-foreground">Six modules. WHO-aligned. Locally relevant.</p>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { Icon: Apple, key: "nutrition", to: "/nutrition" },
              { Icon: TrendingUp, key: "growth", to: "/growth" },
              { Icon: Heart, key: "deficiency", to: "/deficiency" },
              { Icon: Syringe, key: "vaccination", to: "/vaccination" },
              { Icon: Eye, key: "screen", to: "/screen-health" },
              { Icon: FileText, key: "report", to: "/report" },
            ].map(({ Icon, key, to }) => (
              <Link key={key} to={to} className="yasha-card p-5 hover:shadow-lg transition-shadow group">
                <div className="w-11 h-11 rounded-xl bg-primary text-primary-foreground grid place-items-center group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="mt-3 font-semibold">{t(`modules.${key}`)}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-2xl md:text-3xl font-bold text-center">How it works</h2>
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {[
            { n: "1", t: "Add your child", d: "Name, date of birth, and sex — that's it." },
            { n: "2", t: "Log daily basics", d: "Meals, screen time, vaccines as you go." },
            { n: "3", t: "Share with your doctor", d: "Generate a clear PDF in Uzbek, Russian, or English." },
          ].map((s) => (
            <div key={s.n} className="text-center">
              <div className="mx-auto w-14 h-14 rounded-full yasha-hero-gradient text-primary-foreground grid place-items-center text-xl font-bold shadow-md">
                {s.n}
              </div>
              <h3 className="mt-4 font-semibold text-lg">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
