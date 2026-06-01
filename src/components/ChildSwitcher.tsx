import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { useChildren, CHILD_COLORS, useMounted } from "@/lib/store";

function initials(name: string): string {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("") || "?";
}

export default function ChildSwitcher() {
  const mounted = useMounted();
  const { children, activeId, setActiveId, add } = useChildren();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", dob: "", sex: "male" as "male" | "female", color: CHILD_COLORS[0] });

  if (!mounted) return <div className="h-16" aria-hidden />;

  return (
    <div className="flex items-center gap-3 overflow-x-auto py-2 -mx-1 px-1">
      {children.map((c) => {
        const active = c.id === activeId;
        return (
          <button
            key={c.id}
            onClick={() => setActiveId(c.id)}
            className="flex flex-col items-center gap-1 shrink-0 focus:outline-none"
            aria-label={`Switch to ${c.name}`}
          >
            <motion.div
              animate={{ scale: active ? 1.08 : 1 }}
              className="w-12 h-12 rounded-full grid place-items-center text-white font-bold text-lg"
              style={{ backgroundColor: c.color, boxShadow: active ? `0 0 0 3px ${c.color}` : "none", outline: active ? "2px solid white" : "none", outlineOffset: "-3px" }}
            >
              {initials(c.name)}
            </motion.div>
            <span className={`text-[11px] truncate max-w-[64px] ${active ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{c.name}</span>
          </button>
        );
      })}
      <button
        onClick={() => setOpen(true)}
        className="flex flex-col items-center gap-1 shrink-0"
        aria-label="Add child"
      >
        <div className="w-12 h-12 rounded-full grid place-items-center border-2 border-dashed border-muted-foreground/40 text-muted-foreground">
          <Plus className="w-5 h-5" />
        </div>
        <span className="text-[11px] text-muted-foreground">Add</span>
      </button>

      {open && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-[150] bg-black/40 flex items-end sm:items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="bg-card w-full max-w-md rounded-2xl p-6 shadow-xl safe-bottom" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Add a child</h3>
              <button onClick={() => setOpen(false)} aria-label="Close"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <input className="w-full min-h-11 px-3 rounded-xl border border-border bg-background" placeholder="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              <input type="date" className="w-full min-h-11 px-3 rounded-xl border border-border bg-background" value={form.dob} onChange={(e) => setForm((f) => ({ ...f, dob: e.target.value }))} />
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
              <button
                onClick={() => {
                  if (!form.name.trim() || !form.dob) return;
                  add({ name: form.name.trim(), dob: form.dob, sex: form.sex, color: form.color });
                  setOpen(false);
                  setForm({ name: "", dob: "", sex: "male", color: CHILD_COLORS[0] });
                }}
                className="w-full min-h-12 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary-dark"
              >
                Add child
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
