import { useTranslation } from "react-i18next";

const LANGS = [
  { code: "uz", label: "UZ" },
  { code: "ru", label: "RU" },
  { code: "en", label: "EN" },
];

export default function LangSwitcher({ onDark = false }: { onDark?: boolean }) {
  const { i18n } = useTranslation();
  const current = i18n.language?.slice(0, 2) || "uz";
  return (
    <div
      className={`inline-flex rounded-xl p-1 text-xs font-medium ${
        onDark ? "bg-white/15" : "bg-muted"
      }`}
    >
      {LANGS.map((l) => {
        const active = current === l.code;
        return (
          <button
            key={l.code}
            onClick={() => {
              i18n.changeLanguage(l.code);
              if (typeof window !== "undefined") localStorage.setItem("yasha-lang", l.code);
            }}
            className={`min-w-9 h-8 px-2 rounded-lg transition-colors ${
              active
                ? onDark
                  ? "bg-white text-trust"
                  : "bg-primary text-primary-foreground"
                : onDark
                  ? "text-white/90 hover:bg-white/10"
                  : "text-muted-foreground hover:text-foreground"
            }`}
            aria-pressed={active}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}
