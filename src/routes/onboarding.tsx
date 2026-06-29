import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { CHILD_COLORS, useChildren, useMounted } from "@/lib/store";
import LangSwitcher from "@/components/LangSwitcher";

export const Route = createFileRoute("/onboarding")({ component: OnboardingPage });

function OnboardingPage() {
  const { t } = useTranslation();
  const mounted = useMounted();
  const navigate = useNavigate();
  const { children, add, hydrated } = useChildren();

  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [sex, setSex] = useState<"male" | "female">("male");
  const [color, setColor] = useState(CHILD_COLORS[0]);
  const [err, setErr] = useState<string | null>(null);

  // If a profile already exists, skip onboarding.
  useEffect(() => {
    if (hydrated && children.length > 0) {
      navigate({ to: "/dashboard" });
    }
  }, [hydrated, children.length, navigate]);

  if (!mounted) {
    return <div className="min-h-screen grid place-items-center bg-background" />;
  }

  const submit = () => {
    setErr(null);
    if (!name.trim()) { setErr(t("onboarding.errName", "Please enter the child's name.")); return; }
    if (!dob) { setErr(t("onboarding.errDob", "Please pick a date of birth.")); return; }
    const d = new Date(dob);
    if (Number.isNaN(d.getTime()) || d.getTime() > Date.now()) {
      setErr(t("onboarding.errDobFuture", "Date of birth cannot be in the future."));
      return;
    }
    add({ name: name.trim(), dob, sex, color });
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/yasha-logo.png" alt="Yasha" className="w-9 h-9 rounded-full" />
            <span className="text-xl font-bold text-primary-dark">{t("brand")}</span>
          </Link>
          <LangSwitcher />
        </div>
      </header>

      <main className="flex-1 grid place-items-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md yasha-card p-6 sm:p-8"
        >
          <div className="text-center mb-6">
            <img src="/yasha-logo.png" alt="" className="w-16 h-16 mx-auto rounded-full mb-3" />
            <h1 className="text-2xl font-extrabold">
              {t("onboarding.addTitle", "Add your child")}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {t("onboarding.addSub", "Just three details — saved only on this device.")}
            </p>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium">{t("onboarding.s2Name", "Child's name")}</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("onboarding.namePh", "e.g. Amir")}
                className="mt-1 w-full min-h-11 px-3 rounded-xl border border-input bg-background"
                autoFocus
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium">{t("onboarding.s2Dob", "Date of birth")}</span>
              <input
                type="date"
                value={dob}
                max={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setDob(e.target.value)}
                className="mt-1 w-full min-h-11 px-3 rounded-xl border border-input bg-background"
              />
            </label>

            <div>
              <div className="text-sm font-medium mb-1">{t("onboarding.s2Sex", "Sex")}</div>
              <div className="grid grid-cols-2 gap-2">
                {(["male", "female"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSex(s)}
                    className={`min-h-11 rounded-xl border-2 transition-colors ${
                      sex === s ? "border-primary bg-primary/10 font-semibold" : "border-border"
                    }`}
                  >
                    {s === "male" ? `👦 ${t("onboarding.s2Male", "Boy")}` : `👧 ${t("onboarding.s2Female", "Girl")}`}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium mb-2">{t("onboarding.color", "Avatar color")}</div>
              <div className="flex flex-wrap gap-2">
                {CHILD_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    aria-label={c}
                    className="w-9 h-9 rounded-full"
                    style={{
                      backgroundColor: c,
                      outline: color === c ? "3px solid hsl(var(--foreground))" : "none",
                      outlineOffset: 2,
                    }}
                  />
                ))}
              </div>
            </div>

            {err && (
              <div className="rounded-lg bg-danger/10 text-danger text-sm px-3 py-2">{err}</div>
            )}

            <button
              onClick={submit}
              className="w-full min-h-12 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary-dark shadow-sm"
            >
              {t("onboarding.create", "Create profile")}
            </button>

            <p className="text-[11px] text-center text-muted-foreground">
              {t("onboarding.privacy", "Stored only on this device. No account required.")}
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
