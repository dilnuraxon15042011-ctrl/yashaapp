import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { X, Send, Trash2, MessageCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { loadMessages, sendChat, clearMessages } from "@/lib/chat.functions";
import chickMascot from "@/assets/chick-mascot.png";

type ChatMessage = { id: string; role: "user" | "assistant"; content: string };

export default function YashaBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { user, loading } = useAuth();

  const loadFn = useServerFn(loadMessages);
  const sendFn = useServerFn(sendChat);
  const clearFn = useServerFn(clearMessages);

  // Load history when chat opens and user is signed in
  useEffect(() => {
    if (!open || !user || loaded) return;
    loadFn()
      .then((msgs) => { setMessages(msgs); setLoaded(true); })
      .catch((e) => toast.error(e?.message ?? "Couldn't load chat"));
  }, [open, user, loaded, loadFn]);

  // Autoscroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming]);

  // Auto-focus
  useEffect(() => {
    if (open && user) inputRef.current?.focus();
  }, [open, user, messages.length]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || streaming || !user) return;
    setInput("");
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: text };
    const assistantId = crypto.randomUUID();
    setMessages((m) => [...m, userMsg, { id: assistantId, role: "assistant", content: "" }]);
    setStreaming(true);
    try {
      const stream = await sendFn({ data: { message: text } });
      for await (const chunk of stream as AsyncIterable<{ delta: string }>) {
        setMessages((m) =>
          m.map((msg) => msg.id === assistantId ? { ...msg, content: msg.content + chunk.delta } : msg),
        );
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      toast.error(msg);
      setMessages((m) => m.filter((x) => x.id !== assistantId));
    } finally {
      setStreaming(false);
    }
  }, [input, streaming, sendFn, user]);

  const handleClear = useCallback(async () => {
    try {
      await clearFn();
      setMessages([]);
      toast.success("Chat cleared");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Couldn't clear chat");
    }
  }, [clearFn]);

  return (
    <>
      {/* Floating chick button */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        aria-label="Chat with Yasha Chick"
        className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-dark shadow-xl flex items-center justify-center overflow-visible"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        animate={open ? {} : { y: [0, -4, 0] }}
        transition={{ y: { repeat: Infinity, duration: 2.2, ease: "easeInOut" } }}
      >
        <img src={chickMascot} alt="" width={56} height={56} className="w-14 h-14 drop-shadow-md" />
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent border-2 border-card" />
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 22, stiffness: 280 }}
            className="fixed bottom-40 md:bottom-24 right-2 md:right-6 z-40 w-[calc(100vw-1rem)] max-w-[400px] h-[70vh] max-h-[600px] bg-card rounded-2xl border border-border shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-primary/15 to-accent/20 p-3 flex items-center gap-3 border-b border-border">
              <img src={chickMascot} alt="" width={40} height={40} className="w-10 h-10" />
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-foreground leading-tight">Yasha Chick 🐤</h2>
                <p className="text-xs text-muted-foreground">Your friendly family-health helper</p>
              </div>
              {user && messages.length > 0 && (
                <button onClick={handleClear} aria-label="Clear chat" className="p-2 rounded-lg hover:bg-background/60 text-muted-foreground"><Trash2 className="w-4 h-4"/></button>
              )}
              <button onClick={() => setOpen(false)} aria-label="Close" className="p-2 rounded-lg hover:bg-background/60 text-muted-foreground"><X className="w-4 h-4"/></button>
            </div>

            {/* Body */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-background/40">
              {loading ? (
                <div className="text-sm text-muted-foreground text-center pt-6">Loading…</div>
              ) : !user ? (
                <SignInPrompt onClose={() => setOpen(false)} />
              ) : messages.length === 0 ? (
                <EmptyState onPick={(t) => { setInput(t); setTimeout(() => inputRef.current?.focus(), 0); }} />
              ) : (
                messages.map((m) => <Bubble key={m.id} msg={m} />)
              )}
              {streaming && messages[messages.length - 1]?.content === "" && (
                <div className="flex items-center gap-2 text-muted-foreground text-sm pl-1">
                  <TypingDots />
                </div>
              )}
            </div>

            {/* Composer */}
            {user && (
              <form
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="border-t border-border p-2 flex items-end gap-2 bg-card"
              >
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask Yasha Chick anything…"
                  className="flex-1 resize-none max-h-32 px-3 py-2 rounded-xl bg-muted/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || streaming}
                  aria-label="Send"
                  className="shrink-0 w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 hover:bg-primary-dark transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Bubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";
  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] bg-primary text-primary-foreground rounded-2xl rounded-br-md px-3 py-2 text-sm shadow-sm">
          {msg.content}
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-2 items-start">
      <img src={chickMascot} alt="" width={28} height={28} className="w-7 h-7 mt-0.5 shrink-0" />
      <div className="flex-1 text-sm text-foreground prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1">
        <ReactMarkdown>{msg.content || " "}</ReactMarkdown>
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex gap-1 items-center px-2">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full bg-primary"
          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (t: string) => void }) {
  const chips = [
    "Bolam 6 oylik — qachon prikorm boshlash kerak?",
    "How much iron does a 2-year-old need?",
    "Сколько часов сна нужно ребёнку 4 лет?",
    "Help, my child won't eat vegetables 🥦",
  ];
  return (
    <div className="text-center py-4">
      <img src={chickMascot} alt="" width={96} height={96} className="w-24 h-24 mx-auto" />
      <h3 className="mt-3 font-bold text-lg">Hi! I'm Yasha Chick 🐤</h3>
      <p className="text-sm text-muted-foreground mt-1 px-4">Ask me anything about your child's nutrition, growth, vaccines or sleep — in Uzbek, Russian, or English.</p>
      <div className="mt-4 flex flex-col gap-2 px-2">
        {chips.map((c) => (
          <button key={c} onClick={() => onPick(c)} className="text-left text-sm px-3 py-2 rounded-xl bg-card border border-border hover:border-primary hover:bg-primary/5 transition-colors">
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}

function SignInPrompt({ onClose }: { onClose: () => void }) {
  return (
    <div className="text-center py-8">
      <img src={chickMascot} alt="" width={96} height={96} className="w-24 h-24 mx-auto" />
      <h3 className="mt-3 font-bold text-lg">Let's chat!</h3>
      <p className="text-sm text-muted-foreground mt-2 px-4">Sign in so I can remember our conversation across all your devices.</p>
      <div className="mt-5 flex flex-col gap-2 px-6">
        <Link to="/login" onClick={onClose} className="min-h-11 inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary-dark">
          <MessageCircle className="w-4 h-4 mr-2"/> Sign in to chat
        </Link>
        <Link to="/register" onClick={onClose} className="text-sm text-trust font-medium">Create a free account</Link>
      </div>
    </div>
  );
}
