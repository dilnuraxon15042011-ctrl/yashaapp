/**
 * Shared Yasha UI primitives: Skeleton, EmptyState, ErrorState, Spinner,
 * FormField, ConfirmDialog, Badge. Built on the design tokens in styles.css.
 */
import { type ReactNode, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Spinner({ size = 16 }: { size?: number }) {
  return <Loader2 className="animate-spin" style={{ width: size, height: size }} aria-hidden />;
}

export function Skeleton({
  width = "100%",
  height = 20,
  className = "",
}: {
  width?: number | string;
  height?: number | string;
  className?: string;
}) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height }}
      aria-hidden
    />
  );
}

export function EmptyState({
  emoji,
  title,
  description,
  cta,
}: {
  emoji: string;
  title: string;
  description: string;
  cta?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center text-center px-6 py-12 text-muted-foreground">
      <div className="text-5xl mb-4 opacity-80" aria-hidden>{emoji}</div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm leading-relaxed max-w-[30ch] mb-6">{description}</p>
      {cta}
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="text-center px-6 py-10 text-muted-foreground">
      <div className="text-4xl mb-3" aria-hidden>⚠️</div>
      <p className="mb-4 text-sm">{message ?? t("errors.generic", "Something went wrong — please try again.")}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center justify-center min-h-11 px-5 rounded-xl bg-card border border-border text-foreground font-medium hover:bg-muted transition-colors"
        >
          {t("actions.retry", "Try again")}
        </button>
      )}
    </div>
  );
}

export function FormField({
  label,
  htmlFor,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-4">
      <label
        htmlFor={htmlFor}
        className="block mb-1 text-sm font-medium text-muted-foreground"
      >
        {label}
        {required && <span className="text-danger ml-0.5" aria-hidden>*</span>}
      </label>
      {children}
      {error ? (
        <p className="mt-1 text-xs text-danger" role="alert">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

type BadgeStatus = "success" | "warning" | "danger" | "neutral" | "info";
const badgeStyles: Record<BadgeStatus, string> = {
  success: "bg-safe/15 text-safe",
  warning: "bg-caution/20 text-caution-foreground",
  danger: "bg-danger/15 text-danger",
  neutral: "bg-muted text-muted-foreground",
  info: "bg-trust/15 text-trust",
};

export function Badge({
  status = "neutral",
  children,
}: {
  status?: BadgeStatus;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeStyles[status]}`}
    >
      {children}
    </span>
  );
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  variant = "default",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  variant?: "default" | "danger";
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 bg-black/40"
      onClick={onCancel}
    >
      <div
        className="bg-card w-full max-w-md rounded-2xl p-6 shadow-lg safe-bottom"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="confirm-title" className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 min-h-11 rounded-xl bg-card border border-border text-foreground font-medium hover:bg-muted"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 min-h-11 rounded-xl font-medium text-white ${
              variant === "danger" ? "bg-danger hover:opacity-90" : "bg-primary hover:bg-primary-dark"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Sets `document.title` to "{title} — Yasha". Call once per route. */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    if (typeof document === "undefined") return;
    const prev = document.title;
    document.title = `${title} — Yasha`;
    return () => { document.title = prev; };
  }, [title]);
}
