import { CommandResult } from "./voiceCommands";
import {
  commandCache,
  dedupe,
  buildSmartDocumentContext,
  minifyPrompt,
  docFingerprint,
} from "./tokenOptimizer";

/**
 * AI Service — OpenRouter Direct Signal Protocol
 * Optimised: caching, deduplication, smart context windowing, prompt minification
 */

const SYSTEM_PROMPT = minifyPrompt(`
You are the "Gilded Scribe", an AI voice editor assistant.
Interpret the user's command and apply it to the document (an array of paragraphs).
RULES:
1. Return ONLY a valid JSON object — no markdown, no explanation.
2. Keep "message" short (1 sentence max).
3. For Q&A or analysis put the result in "scribeResponse.content".
4. updatedParagraphs must contain ALL paragraphs (unchanged ones included).
5. If asked to 'simplify' or 'shorten' text, analyze it and provide a shorter, simpler version with correct grammar in updatedParagraphs.
6. If asked to check grammar or highlight mistakes, YOU MUST detect errors, put your analysis in scribeResponse.content, and highlight the mistakes directly inside updatedParagraphs using exact HTML: <mark class='bg-red-500/20 text-red-500 px-1 rounded'>mistake</mark> (CRITICAL: use SINGLE QUOTES for HTML attributes to keep JSON valid). Do not escape HTML. If there are no mistakes, say so in the message.
JSON format:
{"success":boolean,"message":"Short confirmation","updatedParagraphs":string[],"affectedIndices":number[],"scribeResponse":{"type":"summary"|"stats"|"info"|"error","content":"result","title":"title"},"structuredData":{"action":"delete|replace|add|format|translate|analyze|qa","target":"string","replacement":"string"}}

EXAMPLE FOR GRAMMAR CHECK:
User says: "Check grammar"
Input paragraphs: ["He do not like apples."]
Your JSON Output: {"success":true, "message":"Grammar checked.", "updatedParagraphs":["He <mark class='bg-red-500/20 text-red-500 px-1 rounded'>do</mark> not like apples."], "affectedIndices":[0], "scribeResponse":{"type":"info", "content":"Found mistake: 'do' should be 'does'.", "title":"Grammar Analysis"}}
`);

const CHAT_SYSTEM_PROMPT = minifyPrompt(`
You are the "Gilded Scribe", a wise and helpful assistant. 
The user is currently editing a document, and you are here to chat, provide insights, answer questions, or just keep them company.
IMPORTANT: You are in "Chat Mode". Do NOT attempt to edit the document. 
If the user asks to "delete a paragraph" or "replace text", politely inform them that you are currently in chat mode and they should use voice commands or manual editing for that.
Keep your responses helpful, concise, and slightly mystical in tone to match the Gilded Scribe aesthetic.
`);

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function processChatOnly(
  message: string,
  paragraphs: string[],
): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  const siteUrl = import.meta.env.VITE_SITE_URL || "http://localhost:8080";
  const siteName = import.meta.env.VITE_SITE_NAME || "AI Voice Editor";

  if (!apiKey) return "Connection key missing.";

  const documentContext = buildSmartDocumentContext(paragraphs, message, 5);

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": siteUrl,
          "X-Title": siteName,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "stepfun/step-3.5-flash:free",
          max_tokens: 512,
          temperature: 0.7,
          messages: [
            { role: "system", content: CHAT_SYSTEM_PROMPT },
            {
              role: "user",
              content: `Document Context (for reference):\n${documentContext}\n\nUser Message: "${message}"`,
            },
          ],
        }),
      },
    );

    if (!response.ok) throw new Error("Signal interference.");

    const data = await response.json();
    return (
      data.choices?.[0]?.message?.content?.trim() || "The oracle is silent."
    );
  } catch (error) {
    console.error("Chat API Error:", error);
    return "The neural link encountered an error during transmission.";
  }
}

export async function processCommandWithAI(
  command: string,
  paragraphs: string[],
  retries = 2,
): Promise<CommandResult> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  const siteUrl = import.meta.env.VITE_SITE_URL || "http://localhost:8080";
  const siteName = import.meta.env.VITE_SITE_NAME || "AI Voice Editor";

  if (!apiKey) {
    return {
      success: false,
      message:
        "The Oracle's connection key is missing. Configure VITE_OPENROUTER_API_KEY.",
      updatedParagraphs: paragraphs,
    };
  }

  // ── Deduplication: skip if same command fired within 3s ──────────────────
  if (dedupe.isDuplicate(command)) {
    console.info("Token_Optimizer: Duplicate command blocked.", command);
    return {
      success: false,
      message: "Duplicate command ignored. Please wait a moment.",
      updatedParagraphs: paragraphs,
    };
  }

  // ── Cache lookup ─────────────────────────────────────────────────────────
  const fingerprint = docFingerprint(paragraphs);
  const cached = commandCache.get(command, fingerprint);
  if (cached) {
    console.info("Token_Optimizer: Cache HIT — no API call needed.");
    return cached as CommandResult;
  }

  // ── Build optimised context (smart windowing + per-para truncation) ──────
  const documentContext = buildSmartDocumentContext(paragraphs, command, 12);

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      console.log(
        `Scribe_Core: Transmitting Signal (attempt ${attempt + 1})...`,
        command,
      );

      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "HTTP-Referer": siteUrl,
            "X-Title": siteName,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "stepfun/step-3.5-flash:free",
            max_tokens: 1024, // hard cap — free tier protection
            temperature: 0.2, // lower = more deterministic, fewer wasted tokens
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              {
                role: "user",
                content: `Command: "${command}"\n\nDocument:\n${documentContext}`,
              },
            ],
          }),
        },
      );

      // 429 = rate limited
      if (response.status === 429) {
        const waitTime = (attempt + 1) * 3000;
        console.warn(`Rate limited. Retrying in ${waitTime / 1000}s...`);
        if (attempt < retries) {
          await delay(waitTime);
          continue;
        }
        return {
          success: false,
          message:
            "The oracle is overwhelmed. Please wait a moment and try again.",
          updatedParagraphs: paragraphs,
        };
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Signal interference.");
      }

      const data = await response.json();
      const aiContent = data.choices?.[0]?.message?.content || "{}";

      try {
        const cleaned = aiContent.replace(/```json|```/g, "").trim();
        const parsedResult = JSON.parse(cleaned);
        const result: CommandResult = {
          ...parsedResult,
          updatedParagraphs: parsedResult.updatedParagraphs || paragraphs,
        };
        // ── Cache the successful result ──────────────────────────────────
        if (result.success) {
          commandCache.set(command, fingerprint, result);
        }
        return result;
      } catch {
        console.error("AI Response Parsing Error:", aiContent);
        return {
          success: false,
          message: "The Oracle's transmission was corrupted.",
          updatedParagraphs: paragraphs,
        };
      }
    } catch (error) {
      if (attempt === retries) {
        console.error("AI Direct API Error:", error);
        return {
          success: false,
          message: `Neural link instability: ${error instanceof Error ? error.message : "Spectral interference"}`,
          updatedParagraphs: paragraphs,
        };
      }
      await delay((attempt + 1) * 2000);
    }
  }

  return {
    success: false,
    message: "Unknown error.",
    updatedParagraphs: paragraphs,
  };
}
