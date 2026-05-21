import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import AppShell from "@/components/AppShell";
import { Check, AlertTriangle, Phone, X } from "lucide-react";
import { toast } from "sonner";
import { STORE_KEYS, useLocalState, useChild, type Lang } from "@/lib/store";
import { VACCINE_SCHEDULE, dueDate, statusOf, type VaccineRecords, type VaccineStatus } from "@/lib/vaccines";

export const Route = createFileRoute("/vaccination")({ component: Vaccination });

type Filter = "all" | "done" | "upcoming" | "overdue";

function Vaccination() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language?.slice(0, 2) || "uz") as Lang;
  const [child] = useChild();
  const [records, setRecords] = useLocalState<VaccineRecords>(STORE_KEYS.vaccineRecords, {});
  const [filter, setFilter] = useState<Filter>("all");
  const [editing, setEditing] = useState<string | null>(null);

  const items = useMemo(() => VACCINE_SCHEDULE.map((v) => ({
    v, due: dueDate(child.dob, v), status: statusOf(v, child.dob, records[v.id]),
  })), [child.dob, records]);

  const filtered = items.filter((i) => filter === "all" ? true : i.status === filter);
  const done = items.filter((i) => i.status === "done").length;
  const pct = Math.round((done / items.length) * 100);
  const overdue = items.filter((i) => i.status === "overdue").length;

  const markDone = (id: string, clinic = "", notes = "") => {
    setRecords((p) => ({ ...p, [id]: { ...p[id], doneDate: new Date().toISOString().slice(0, 10), clinic, notes } }));
    toast.success(t("toast.saved"));
    setEditing(null);
  };
  const undo = (id: string) => {
    setRecords((p) => { const n = { ...p }; delete n[id]; return n; });
  };

  const FILTERS: Filter[] = ["all", "done", "upcoming", "overdue"];
  const statusBadge: Record<VaccineStatus, string> = {
    done: "bg-safe text-safe-foreground",
    overdue: "bg-destructive text-destructive-foreground",
    upcoming: "bg-caution text-caution-foreground",
    future: "bg-muted text-muted-foreground",
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <header>
          <h1 className="text-3xl font-bold">{t("vaccination.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("vaccination.subtitle")}</p>
        </header>

        <div className="yasha-card p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">{done}/{items.length} {t("vaccination.complete")}</span>
            <span className="font-bold text-primary-dark">{pct}%</span>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-primary-dark transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {overdue > 0 && (
          <div className="rounded-2xl p-4 bg-destructive/10 border border-destructive/40 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <div className="text-sm flex-1">
              <p>{overdue} {t("status.overdue")}</p>
              <a href="tel:1080" className="mt-1 inline-flex items-center gap-1 text-destructive font-medium"><Phone className="w-4 h-4" /> {t("vaccination.hotline")}</a>
            </div>
          </div>
        )}

        <div className="flex gap-2 overflow-x-auto">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`min-h-10 px-4 rounded-full text-sm font-medium shrink-0 ${filter === f ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-primary-light"}`}>
              {t(`vaccination.filter${f.charAt(0).toUpperCase() + f.slice(1)}`)}
            </button>
          ))}
        </div>

        <div className="yasha-card divide-y divide-border">
          {filtered.length === 0 && (
            <p className="p-6 text-sm text-muted-foreground text-center">{t("empty.vaccination")}</p>
          )}
          {filtered.map(({ v, due, status }) => {
            const rec = records[v.id];
            const isEditing = editing === v.id;
            return (
              <div key={v.id} className="p-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => status === "done" ? undo(v.id) : setEditing(isEditing ? null : v.id)}
                    className={`w-11 h-11 rounded-full grid place-items-center transition-colors ${status === "done" ? "bg-safe text-safe-foreground" : "bg-muted text-muted-foreground hover:bg-primary-light"}`}
                    aria-label={t("vaccination.markDone")}>
                    <Check className="w-5 h-5" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold">{v.name}</div>
                    <div className="text-xs text-muted-foreground">{v.description[lang]}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Due: {due.toLocaleDateString()}
                      {rec?.doneDate ? ` · ${t("status.done")} ${rec.doneDate}` : ""}
                      {rec?.clinic ? ` · ${rec.clinic}` : ""}
                    </div>
                  </div>
                  <span className={`text-[10px] uppercase tracking-wide font-semibold px-2 py-1 rounded-full ${statusBadge[status]}`}>
                    {t(`status.${status}`)}
                  </span>
                </div>
                {isEditing && status !== "done" && (
                  <EditForm onSave={(clinic, notes) => markDone(v.id, clinic, notes)} onCancel={() => setEditing(null)}
                    placeholderClinic={t("vaccination.clinic")} placeholderNotes={t("vaccination.notes")}
                    cancelLabel={t("common.cancel")} saveLabel={t("vaccination.markDone")} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}

function EditForm({ onSave, onCancel, placeholderClinic, placeholderNotes, cancelLabel, saveLabel }:
  { onSave: (c: string, n: string) => void; onCancel: () => void;
    placeholderClinic: string; placeholderNotes: string; cancelLabel: string; saveLabel: string }) {
  const [clinic, setClinic] = useState("");
  const [notes, setNotes] = useState("");
  return (
    <div className="mt-3 ml-14 space-y-2">
      <input value={clinic} onChange={(e) => setClinic(e.target.value)} placeholder={placeholderClinic}
        className="w-full min-h-10 px-3 rounded-lg border border-input bg-background text-sm" />
      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={placeholderNotes} rows={2}
        className="w-full p-2 rounded-lg border border-input bg-background text-sm" />
      <div className="flex gap-2">
        <button onClick={() => onSave(clinic, notes)} className="min-h-9 px-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-dark">
          {saveLabel}
        </button>
        <button onClick={onCancel} className="min-h-9 px-3 rounded-lg bg-muted text-sm hover:bg-muted/70 inline-flex items-center gap-1">
          <X className="w-3.5 h-3.5" /> {cancelLabel}
        </button>
      </div>
    </div>
  );
}
