import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { FOODS } from "./foods";

const InputSchema = z.object({
  // data URL (data:image/jpeg;base64,...) or bare base64; mime separate
  imageBase64: z.string().min(100).max(8_000_000),
  mimeType: z.string().regex(/^image\/(jpeg|png|webp|heic|heif)$/),
});

export type ScanItem = { foodId: number; name: string; portion: number; confidence: number };
export type ScanResult = { items: ScanItem[]; note?: string };

export const scanMeal = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<ScanResult> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");

    const dataUrl = data.imageBase64.startsWith("data:")
      ? data.imageBase64
      : `data:${data.mimeType};base64,${data.imageBase64}`;

    const catalog = FOODS.map((f) => `${f.id}=${f.name.en}`).join(", ");

    const body = {
      model: "google/gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content:
            "You are a nutrition assistant. Identify foods visible in the meal photo. Only choose from the provided Uzbek food catalog (id=name). Estimate portion as a multiplier of a single standard serving (1 = one normal portion, 0.5 = half, 2 = double). Return a tool call.",
        },
        {
          role: "user",
          content: [
            { type: "text", text: `Catalog: ${catalog}\n\nAnalyze the photo and list the items.` },
            { type: "image_url", image_url: { url: dataUrl } },
          ],
        },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "report_meal",
            description: "Report identified foods from the photo.",
            parameters: {
              type: "object",
              properties: {
                items: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      foodId: { type: "number" },
                      portion: { type: "number" },
                      confidence: { type: "number" },
                    },
                    required: ["foodId", "portion", "confidence"],
                    additionalProperties: false,
                  },
                },
                note: { type: "string" },
              },
              required: ["items"],
              additionalProperties: false,
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "report_meal" } },
    };

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (resp.status === 429) throw new Error("rate_limited");
    if (resp.status === 402) throw new Error("payment_required");
    if (!resp.ok) {
      const txt = await resp.text();
      console.error("scan gateway error", resp.status, txt);
      throw new Error("scan_failed");
    }

    const json = await resp.json();
    const call = json?.choices?.[0]?.message?.tool_calls?.[0];
    const argsStr = call?.function?.arguments;
    if (!argsStr) return { items: [], note: "No items detected." };

    let parsed: { items?: Array<{ foodId: number; portion: number; confidence: number }>; note?: string };
    try {
      parsed = JSON.parse(argsStr);
    } catch {
      return { items: [], note: "Could not parse response." };
    }

    const items: ScanItem[] = (parsed.items ?? [])
      .map((it) => {
        const f = FOODS.find((x) => x.id === Number(it.foodId));
        if (!f) return null;
        const portion = Math.max(0.25, Math.min(5, Number(it.portion) || 1));
        const confidence = Math.max(0, Math.min(1, Number(it.confidence) || 0.5));
        return { foodId: f.id, name: f.name.en, portion, confidence };
      })
      .filter((x): x is ScanItem => x !== null)
      .slice(0, 12);

    return { items, note: parsed.note };
  });
