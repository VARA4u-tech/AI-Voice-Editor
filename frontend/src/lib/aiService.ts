import { CommandResult } from "./voiceCommands";

/**
 * AI Service — OpenRouter Direct Signal Protocol
 * Model: stepfun/step-3.5-flash:free
 */

const SYSTEM_PROMPT = `You are the "Gilded Scribe", an AI voice editor assistant.
Interpret the user's command and apply it to the document (an array of paragraphs).

RULES:
1. Return ONLY a valid JSON object — no markdown, no explanation.
2. Keep your "message" field short and mystical (1 sentence max).
3. If the task is Q&A or analysis, put the result in "scribeResponse.content".

JSON format:
{
  "success": boolean,
  "message": "Short mystical confirmation",
  "updatedParagraphs": string[],
  "affectedIndices": number[],
  "scribeResponse": {
    "type": "summary" | "stats" | "info" | "error",
    "content": "Full result text here",
    "title": "Short title"
  },
  "structuredData": {
    "action": "delete | replace | add | format | translate | analyze | qa",
    "target": "string",
    "replacement": "string"
  }
}`;

// Truncate document context to avoid token overload (keep first 20 paragraphs)
function buildDocumentContext(paragraphs: string[]): string {
  const sample = paragraphs.slice(0, 20);
  const truncated = paragraphs.length > 20;
  const context = sample.map((p, i) => `[${i}] ${p}`).join("\n");
  return truncated
    ? `${context}\n... (${paragraphs.length - 20} more paragraphs not shown)`
    : context;
}

// Delay helper for retry backoff
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

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
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              {
                role: "user",
                content: `Command: "${command}"\n\nDocument:\n${buildDocumentContext(paragraphs)}`,
              },
            ],
          }),
        },
      );

      // 429 = rate limited — wait and retry
      if (response.status === 429) {
        const waitTime = (attempt + 1) * 3000; // 3s, 6s
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
        return {
          ...parsedResult,
          updatedParagraphs: parsedResult.updatedParagraphs || paragraphs,
        };
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

  // Should never reach here
  return {
    success: false,
    message: "Unknown error.",
    updatedParagraphs: paragraphs,
  };
}
