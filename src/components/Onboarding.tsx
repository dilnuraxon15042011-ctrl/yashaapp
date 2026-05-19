import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import LangSwitcher from "./LangSwitcher";

const KEY = "yasha-onboarded";

export default function Onboarding() {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [sex, setSex] = useState<"male" | "female">("male");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(KEY)) setOpen(true);
  }, []);

  const close = () => {
    localStorage.setItem(KEY, "1");
    if (name && dob) {
      localStorage.setItem("yasha-child", JSON.stringify({ name, dob, sex }));
    }
    setOpen(false);
  };

  if (!open) return null;

  const steps = [
    (
      <div key="s1" className="text-center">
        <motion.img
          src="/yasha-logo.png"
          alt="Yasha"
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="w-32 h-32 mx-auto rounded-full"
        />
        <h2 className="text-2xl font-bold mt-6">{t("onboarding.s1Title")}</h2>
        <p className="text-muted-foreground mt-2">{t("onboarding.s1Sub")}</p>
      </div>
    ),
    (
      <div key="s2" className="space-y-3">
        <h2 className="text-2xl font-bold text-center">{t("onboarding.s2Title")}</h2>
        <label className="block text-sm font-medium">{t("onboarding.s2Name")}
          <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full min-h-11 px-3 rounded-xl border border-input bg-background" />
        </label>
        <label className="block text-sm font-medium">{t("onboarding.s2Dob")}
          <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="mt-1 w-full min-h-11 px-3 rounded-xl border border-input bg-background" />
        </label>
        <div>
          <div className="text-sm font-medium mb-1">{t("onboarding.s2Sex")}</div>
          <div className="grid grid-cols-2 gap-2">
            {(["male", "female"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSex(s)}
                className={`min-h-11 px-3 rounded-xl border transition-colors ${sex === s ? "bg-primary text-primary-foreground border-primary" : "bg-background border-input"}`}
              >
                {t(s === "male" ? "onboarding.s2Male" : "onboarding.s2Female")}
              </button>
            ))}
          </div>
        </div>
      </div>
    ),
    (
      <div key="s3" className="text-center space-y-4">
        <h2 className="text-2xl font-bold">{t("onboarding.s3Title")}</h2>
        <div className="flex justify-center">
          <LangSwitcher />
        </div>
      </div>
    ),
  ];

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 grid place-items-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-card rounded-2xl shadow-2xl w-full max-w-md p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className={`h-1.5 rounded-full transition-all ${i === step ? "w-8 bg-primary" : "w-2 bg-muted"}`} />
            ))}
          </div>
          <button onClick={close} className="text-xs text-muted-foreground hover:text-foreground">
            {t("onboarding.skip")}
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -40, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {steps[step]}
          </motion.div>
        </AnimatePresence>

        <button
          onClick={() => (step < 2 ? setStep(step + 1) : close())}
          className="mt-6 w-full min-h-12 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary-dark"
        >
          {step < 2 ? t("onboarding.next") : t("onboarding.start")}
        </button>
      </motion.div>
    </div>
  );
}
