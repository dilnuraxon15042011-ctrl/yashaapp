import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";
import { yashaResponses, type default as i18nDefault } from "@/lib/i18n";

type Msg = { from: "user" | "bot"; text: string; id: number };

const QUICK: Array<{ key: keyof typeof yashaResponses; tKey: string }> = [
  { key: "iron", tKey: "chatbot.quick.iron" },
  { key: "vaccine", tKey: "chatbot.quick.vaccine" },
  { key: "screen", tKey: "chatbot.quick.screen" },
  { key: "exercise", tKey: "chatbot.quick.exercise" },
];

// suppress unused import warning while still re-using the i18n module side effect
void i18nDefault;

export default function YashaBot() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language?.slice(0, 2) || "uz") as "uz" | "ru" | "en";
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const leftEye = useRef<HTMLSpanElement>(null);
  const rightEye = useRef<HTMLSpanElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  // eye tracking
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      [leftEye.current, rightEye.current].forEach((el) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const angle = Math.atan2(e.clientY - cy, e.clientX - cx);
        const dx = Math.cos(angle) * 2;
        const dy = Math.sin(angle) * 2;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ from: "bot", text: t("chatbot.greeting"), id: ++idRef.current }]);
    }
  }, [open, messages.length, t]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 1e9, behavior: "smooth" });
  }, [messages, typing]);

  const pushBot = (text: string) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { from: "bot", text, id: ++idRef.current }]);
    }, 800);
  };

  const handleQuick = (key: keyof typeof yashaResponses) => {
    setMessages((m) => [...m, { from: "user", text: t(`chatbot.quick.${key}`), id: ++idRef.current }]);
    pushBot(yashaResponses[key][lang]);
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { from: "user", text, id: ++idRef.current }]);
    setInput("");
    // try to match keywords
    const lower = text.toLowerCase();
    const found = (Object.keys(yashaResponses) as Array<keyof typeof yashaResponses>).find((k) =>
      lower.includes(k)
    );
    pushBot(found ? yashaResponses[found][lang] : t("chatbot.fallback"));
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        ref={btnRef}
        onClick={() => setOpen(true)}
        aria-label={t("chatbot.open")}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 w-16 h-16 rounded-full grid place-items-center text-white font-extrabold text-2xl select-none"
        style={{
          background: "linear-gradient(135deg, #F97316, #EA580C)",
          boxShadow: "0 8px 28px rgba(249, 115, 22, 0.55)",
        }}
      >
        {/* Pulse ring */}
        <span
          className="absolute inset-0 rounded-full"
          style={{
            animation: "yasha-pulse 4s ease-out infinite",
            boxShadow: "0 0 0 0 rgba(249,115,22,0.6)",
          }}
        />
        {/* Eyes */}
        <span className="absolute top-2 left-3 w-2.5 h-2.5 rounded-full bg-white grid place-items-center overflow-hidden">
          <span ref={leftEye} className="w-1 h-1 rounded-full bg-[#1a1a1a] transition-transform" />
        </span>
        <span className="absolute top-2 right-3 w-2.5 h-2.5 rounded-full bg-white grid place-items-center overflow-hidden">
          <span ref={rightEye} className="w-1 h-1 rounded-full bg-[#1a1a1a] transition-transform" />
        </span>
        <span className="relative leading-none mt-1">Y</span>
        <style>{`
          @keyframes yasha-pulse {
            0% { box-shadow: 0 0 0 0 rgba(249,115,22,0.6); }
            70% { box-shadow: 0 0 0 24px rgba(249,115,22,0); }
            100% { box-shadow: 0 0 0 0 rgba(249,115,22,0); }
          }
        `}</style>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/30"
            />
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 30 }}
              className="fixed z-50 bottom-0 right-0 w-full md:w-[400px] md:bottom-6 md:right-6 md:rounded-2xl rounded-t-2xl bg-card border border-border shadow-2xl flex flex-col"
              style={{ height: "min(560px, 80vh)" }}
            >
              <div className="flex items-center gap-3 p-4 border-b border-border">
                <div className="w-10 h-10 rounded-full grid place-items-center text-white font-bold" style={{ background: "linear-gradient(135deg,#F97316,#EA580C)" }}>
                  Y
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{t("chatbot.name")}</div>
                  <div className="text-xs text-trust">● online</div>
                </div>
                <button onClick={() => setOpen(false)} aria-label={t("chatbot.close")} className="min-h-11 min-w-11 grid place-items-center text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                        m.from === "user"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-muted text-foreground rounded-bl-md"
                      }`}
                    >
                      {m.text}
                    </div>
                  </motion.div>
                ))}
                {typing && (
                  <div className="flex justify-start">
                    <div className="bg-muted px-3 py-2 rounded-2xl rounded-bl-md flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
                          animate={{ y: [0, -3, 0] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {messages.length <= 1 && !typing && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {QUICK.map((q) => (
                      <button
                        key={q.key}
                        onClick={() => handleQuick(q.key)}
                        className="text-xs px-3 py-1.5 rounded-full bg-primary-light text-primary-dark font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        {t(q.tKey)}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-3 border-t border-border flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={t("chatbot.placeholder")}
                  className="flex-1 min-h-11 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={handleSend}
                  aria-label={t("chatbot.send")}
                  className="min-h-11 px-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary-dark grid place-items-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
