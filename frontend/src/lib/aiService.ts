import { CommandResult } from "./voiceCommands";

/**
 * AI Service for processing complex natural language commands via OpenRouter API.
 */

const SYSTEM_PROMPT = `
You are the "Gilded Scribe", a mystical and highly advanced AI voice editor.
Your task is to interpret a user's voice command and apply it to a document (represented as an array of paragraphs).

CRITICAL: You must return ONLY a valid JSON object. Do not include markdown formatting or explanations.

JSON Response Structure:
{
  "success": boolean,
  "message": "A mystical but clear confirmation of what was done",
  "updatedParagraphs": string[],
  "affectedIndices": number[],
  "scribeResponse": {
    "type": "summary" | "stats" | "info" | "error",
    "content": "Detailed text for the sidebar",
    "title": "Short catchy title"
  },
  "structuredData": {
    "action": "string (delete, replace, add, format, translate, analyze, qa)",
    "target": "string",
    "replacement": "string"
  }
}

Guidelines:
- If translating, update paragraphs with the translation.
- If summarizing/QA, put result in scribeResponse.content.
- Maintain a premium, mystical tone in messages and content.
`;

export async function processCommandWithAI(
  command: string,
  paragraphs: string[],
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

  try {
    console.log("Scribe_Core: Transmitting via Direct Signal...", command);

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
              content: `User Command: "${command}"\n\nCurrent Document:\n${JSON.stringify(paragraphs)}`,
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Signal interference.");
    }

    const data = await response.json();
    const aiContent = data.choices[0].message.content || "{}";

    try {
      const parsedResult = JSON.parse(
        aiContent.replace(/```json|```/g, "").trim(),
      );
      return {
        ...parsedResult,
        updatedParagraphs: parsedResult.updatedParagraphs || paragraphs,
      };
    } catch (e) {
      console.error("AI Response Parsing Error:", aiContent);
      return {
        success: false,
        message: "The Oracle's transmission was corrupted.",
        updatedParagraphs: paragraphs,
      };
    }
  } catch (error) {
    console.error("AI Direct API Error:", error);
    return {
      success: false,
      message: `Neural link instability: ${error instanceof Error ? error.message : "Spectral interference"}`,
      updatedParagraphs: paragraphs,
    };
  }
}
