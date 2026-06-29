import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Settings as SettingsIcon, Trash2, Pencil, Plus, X, Check } from "lucide-react";
import AppShell from "@/components/AppShell";
import {
  useGrandparent, useMounted, STORE_KEYS, useChildren,
  CHILD_COLORS, type ChildProfile,
} from "@/lib/store";
import LangSwitcher from "@/components/LangSwitcher";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

type FormState = { name: string; dob: string; sex: "male" | "female"; color: string };

function emptyForm(): FormState {
  return { name: "", dob: "", sex: "male", color: CHILD_COLORS[0] };
}

function ChildForm({
  initial, submitLabel, onSubmit, onCancel,
}: {
  initial: FormState;
  submitLabel: string;
  onSubmit: (f: FormState) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<FormState>(initial);
  const [err, setErr] = useState<string | null>(null);
  const submit = () => {
    if (!form.name.trim()) { setErr("Please enter a name."); return; }
    if (!form.dob) { setErr("Please pick a date of birth."); return; }
    onSubmit({ ...form, name: form.name.trim() });
  };
  return (
    <div className="space-y-3">
      <input
        className="w-full min-h-11 px-3 rounded-xl border border-border bg-background"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
      />
      <input
        type="date"
        className="w-full min-h-11 px-3 rounded-xl border border-border bg-background"
        max={new Date().toISOString().slice(0, 10)}
        value={form.dob}
        onChange={(e) => setForm((f) => ({ ...f, dob: e.target.value }))}
      />
      <div className="flex gap-2">
        {(["male", "female"] as const).map((s) => (
          <button key={s} type="button" onClick={() => setForm((f) => ({ ...f, sex: s }))}
            className={`flex-1 min-h-11 rounded-xl border-2 ${form.sex === s ? "border-primary bg-primary/10 font-semibold" : "border-border"}`}>
            {s === "male" ? "👦 Boy" : "👧 Girl"}
          </button>
        ))}
      </div>
      <div>
        <div className="text-xs text-muted-foreground mb-2">Avatar color</div>
        <div className="flex gap-2 flex-wrap">
          {CHILD_COLORS.map((c) => (
            <button key={c} type="button" onClick={() => setForm((f) => ({ ...f, color: c }))}
              className="w-9 h-9 rounded-full" aria-label={c}
              style={{ backgroundColor: c, outline: form.color === c ? "3px solid hsl(var(--foreground))" : "none", outlineOffset: 2 }} />
          ))}
        </div>
      </div>
      {err && <div className="rounded-lg bg-danger/10 text-danger text-sm px-3 py-2">{err}</div>}
      <div className="flex gap-2">
        <button onClick={onCancel} className="flex-1 min-h-11 rounded-xl border border-border font-medium">Cancel</button>
        <button onClick={submit} className="flex-1 min-h-11 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary-dark">
          <Check className="inline w-4 h-4 mr-1" />{submitLabel}
        </button>
      </div>
    </div>
  );
}

function ChildRow({ c, isActive, onActivate, onEdit, onDelete }: {
  c: ChildProfile; isActive: boolean;
  onActivate: () => void; onEdit: () => void; onDelete: () => void;
}) {
  const initials = c.name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("") || "?";
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border ${isActive ? "border-primary bg-primary/5" : "border-border"}`}>
      <button onClick={onActivate} className="flex items-center gap-3 flex-1 text-left min-w-0">
        <div className="w-10 h-10 rounded-full grid place-items-center text-white font-bold shrink-0" style={{ backgroundColor: c.color }}>
          {initials}
        </div>
        <div className="min-w-0">
          <div className="font-semibold truncate">{c.name} {isActive && <span className="text-xs text-primary ml-1">(active)</span>}</div>
          <div className="text-xs text-muted-foreground">{c.dob} · {c.sex === "male" ? "Boy" : "Girl"}</div>
        </div>
      </button>
      <button onClick={onEdit} aria-label={`Edit ${c.name}`} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground">
        <Pencil className="w-4 h-4" />
      </button>
      <button onClick={onDelete} aria-label={`Delete ${c.name}`} className="p-2 rounded-lg hover:bg-danger/10 text-danger">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

function SettingsPage() {
  const mounted = useMounted();
  const [gp, setGp] = useGrandparent();
  const { children, activeId, setActiveId, add, update, remove } = useChildren();

  const [addOpen, setAddOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  if (!mounted) return <AppShell><div className="max-w-2xl mx-auto px-4 py-8" /></AppShell>;

  const resetAll = () => {
    if (!confirm("Reset all Yasha data on this device? This cannot be undone.")) return;
    Object.values(STORE_KEYS).forEach((k) => localStorage.removeItem(k));
    toast.success("All data reset");
    setTimeout(() => { window.location.href = "/onboarding"; }, 600);
  };

  const handleDelete = (c: ChildProfile) => {
    if (!confirm(`Delete ${c.name}'s profile? Their logged data will remain on this device until you reset.`)) return;
    remove(c.id);
    toast.success(`${c.name} removed`);
    // If we just removed the last child, send back to onboarding
    if (children.length <= 1) {
      setTimeout(() => { window.location.href = "/onboarding"; }, 400);
    }
  };

  const editing = children.find((c) => c.id === editId) ?? null;

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <header>
          <h1 className="text-3xl font-extrabold flex items-center gap-2">
            <SettingsIcon className="w-7 h-7 text-primary" /> Settings
          </h1>
        </header>

        <section className="yasha-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">Children</h2>
            {!addOpen && !editing && (
              <button onClick={() => setAddOpen(true)} className="inline-flex items-center gap-1 min-h-10 px-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary-dark">
                <Plus className="w-4 h-4" /> Add child
              </button>
            )}
          </div>

          {children.length === 0 && !addOpen && (
            <div className="text-sm text-muted-foreground">
              No children yet. <Link to="/onboarding" className="text-primary underline">Add your first child</Link>.
            </div>
          )}

          {!editing && !addOpen && children.length > 0 && (
            <div className="space-y-2">
              {children.map((c) => (
                <ChildRow
                  key={c.id}
                  c={c}
                  isActive={c.id === activeId}
                  onActivate={() => setActiveId(c.id)}
                  onEdit={() => setEditId(c.id)}
                  onDelete={() => handleDelete(c)}
                />
              ))}
            </div>
          )}

          {addOpen && (
            <div className="rounded-xl border border-border p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Add a child</h3>
                <button onClick={() => setAddOpen(false)} aria-label="Close"><X className="w-4 h-4" /></button>
              </div>
              <ChildForm
                initial={emptyForm()}
                submitLabel="Add"
                onCancel={() => setAddOpen(false)}
                onSubmit={(f) => { add(f); setAddOpen(false); toast.success(`${f.name} added`); }}
              />
            </div>
          )}

          {editing && (
            <div className="rounded-xl border border-border p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Edit {editing.name}</h3>
                <button onClick={() => setEditId(null)} aria-label="Close"><X className="w-4 h-4" /></button>
              </div>
              <ChildForm
                initial={{ name: editing.name, dob: editing.dob, sex: editing.sex, color: editing.color }}
                submitLabel="Save"
                onCancel={() => setEditId(null)}
                onSubmit={(f) => { update(editing.id, f); setEditId(null); toast.success("Saved"); }}
              />
            </div>
          )}
        </section>

        <section className="yasha-card p-5">
          <h2 className="font-bold mb-2">Language</h2>
          <LangSwitcher />
        </section>

        <section className="yasha-card p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-bold">Grandparent mode</h2>
              <p className="text-sm text-muted-foreground mt-1">Larger text and simpler navigation for older family members.</p>
            </div>
            <button onClick={() => setGp(!gp)} role="switch" aria-checked={gp}
              className={`relative w-14 h-8 rounded-full transition-colors shrink-0 ${gp ? "bg-primary" : "bg-muted"}`}>
              <span className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-transform ${gp ? "translate-x-7" : "translate-x-1"}`} />
            </button>
          </div>
          {gp && (
            <div className="mt-3 rounded-lg bg-primary-light p-3 text-sm text-primary-dark">
              Grandparent mode is ON — larger touch targets across the app.
            </div>
          )}
        </section>

        <section className="yasha-card p-5">
          <h2 className="font-bold mb-2 text-danger">Danger zone</h2>
          <p className="text-sm text-muted-foreground mb-3">Erases every child profile and all logged data on this device. Useful for pilot testing.</p>
          <button onClick={resetAll} className="inline-flex items-center gap-2 min-h-11 px-4 rounded-xl bg-danger/10 text-danger font-semibold hover:bg-danger/20">
            <Trash2 className="w-4 h-4" /> Reset all data
          </button>
        </section>

        <p className="text-center text-xs text-muted-foreground">Yasha App · SheLeads Uzbekistan</p>
      </div>
    </AppShell>
  );
}
