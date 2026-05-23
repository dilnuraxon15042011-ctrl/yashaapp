import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createLovableAiGatewayProvider } from "./ai-gateway";
import { streamText, type ModelMessage } from "ai";

const SYSTEM_PROMPT = `You are Yasha Chick, a warm, cheerful baby-chick mascot inside the Yasha family health app for Uzbekistan. You help parents with friendly, evidence-based guidance on child nutrition, growth, vitamin/iron deficiency, immunizations (per Uzbekistan's national schedule), exercise, screen time and eye care.

Style:
- Speak warmly, like a caring nurse-aunt. Use short paragraphs and the occasional 🐤 emoji.
- Detect the parent's language from their message (Uzbek, Russian, or English) and reply in the SAME language.
- Always remind that you are not a doctor and serious concerns need a pediatrician.
- Keep answers concise (under 180 words) unless asked for detail.`;

export const loadMessages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("chat_messages")
      .select("id, role, content, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .limit(200);
    if (error) throw new Error(error.message);
    return (data ?? []).map((m) => ({
      id: m.id as string,
      role: m.role as "user" | "assistant",
      content: m.content as string,
    }));
  });

export const clearMessages = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase.from("chat_messages").delete().eq("user_id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const sendChat = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        message: z.string().min(1).max(4000),
      })
      .parse(input),
  )
  .handler(async function* ({ data, context }) {
    const { supabase, userId } = context;

    // Save user message
    const { error: insertErr } = await supabase.from("chat_messages").insert({
      user_id: userId,
      role: "user",
      content: data.message,
    });
    if (insertErr) throw new Error(insertErr.message);

    // Load history for context
    const { data: history, error: histErr } = await supabase
      .from("chat_messages")
      .select("role, content")
      .order("created_at", { ascending: true })
      .limit(40);
    if (histErr) throw new Error(histErr.message);

    const messages: ModelMessage[] = (history ?? []).map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content as string,
    }));

    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");

    const gateway = createLovableAiGatewayProvider(apiKey);
    const model = gateway("google/gemini-3-flash-preview");

    const result = streamText({
      model,
      system: SYSTEM_PROMPT,
      messages,
    });

    let buffer = "";
    for await (const delta of result.textStream) {
      buffer += delta;
      yield { delta };
    }

    // Persist assistant reply
    await supabase.from("chat_messages").insert({
      user_id: userId,
      role: "assistant",
      content: buffer,
    });
  });
