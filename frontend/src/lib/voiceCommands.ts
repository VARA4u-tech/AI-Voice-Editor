export interface CommandResult {
  success: boolean;
  message: string;
  updatedParagraphs: string[];
  affectedIndices?: number[];
  scribeResponse?: {
    type: "summary" | "stats" | "info" | "error";
    content: string;
    title?: string;
  };
  structuredData?: {
    action: string;
    target?: string;
    replacement?: string;
  };
}

type CommandHandler = (
  paragraphs: string[],
  match: RegExpMatchArray,
) => CommandResult;

interface CommandPattern {
  pattern: RegExp;
  handler: CommandHandler;
  description: string;
  example: string;
}

const commands: CommandPattern[] = [
  {
    pattern: /^delete\s+paragraph\s+(\d+)$/i,
    description: "Delete paragraph N",
    example: "delete paragraph 3",
    handler: (paragraphs, match) => {
      const idx = parseInt(match[1], 10) - 1;
      if (idx < 0 || idx >= paragraphs.length) {
        return {
          success: false,
          message: `Paragraph ${idx + 1} does not exist.`,
          updatedParagraphs: paragraphs,
        };
      }
      const updated = paragraphs.filter((_, i) => i !== idx);
      return {
        success: true,
        message: `Deleted paragraph ${idx + 1}.`,
        updatedParagraphs: updated,
        affectedIndices: [idx],
        structuredData: {
          action: "delete",
          target: `paragraph ${idx + 1}`,
        },
      };
    },
  },
  {
    pattern:
      /^replace\s+(?:word\s+)?["']?(.+?)["']?\s+with\s+["']?(.+?)["']?$/i,
    description: "Replace word or phrase with another",
    example: "replace hello with greetings",
    handler: (paragraphs, match) => {
      const search = match[1].trim();
      const replacement = match[2].trim();
      let count = 0;
      const updated = paragraphs.map((p) => {
        const regex = new RegExp(escapeRegex(search), "gi");
        const matches = p.match(regex);
        if (matches) count += matches.length;
        return p.replace(regex, replacement);
      });
      if (count === 0) {
        return {
          success: false,
          message: `"${search}" not found in the document.`,
          updatedParagraphs: paragraphs,
        };
      }
      return {
        success: true,
        message: `Replaced ${count} occurrence(s) of "${search}" with "${replacement}".`,
        updatedParagraphs: updated,
        affectedIndices: updated.reduce((acc, p, i) => {
          if (paragraphs[i] !== p) acc.push(i);
          return acc;
        }, [] as number[]),
        structuredData: {
          action: "replace",
          target: search,
          replacement: replacement,
        },
      };
    },
  },
  {
    pattern:
      /^add\s+(?:paragraph\s+)?["']?(.+?)["']?\s+(?:after|below)\s+paragraph\s+(\d+)$/i,
    description: "Add new text after paragraph N",
    example: "add Once upon a time after paragraph 2",
    handler: (paragraphs, match) => {
      const text = match[1].trim();
      const idx = parseInt(match[2], 10) - 1;
      if (idx < 0 || idx >= paragraphs.length) {
        return {
          success: false,
          message: `Paragraph ${idx + 1} does not exist.`,
          updatedParagraphs: paragraphs,
        };
      }
      const updated = [...paragraphs];
      updated.splice(idx + 1, 0, text);
      return {
        success: true,
        message: `Added new paragraph after paragraph ${idx + 1}.`,
        updatedParagraphs: updated,
        affectedIndices: [idx + 1],
        structuredData: {
          action: "add_after",
          target: `paragraph ${idx + 1}`,
          replacement: text,
        },
      };
    },
  },
  {
    pattern:
      /^add\s+(?:paragraph\s+)?["']?(.+?)["']?\s+(?:before|above)\s+paragraph\s+(\d+)$/i,
    description: "Add new text before paragraph N",
    example: "add In summary before paragraph 1",
    handler: (paragraphs, match) => {
      const text = match[1].trim();
      const idx = parseInt(match[2], 10) - 1;
      if (idx < 0 || idx >= paragraphs.length) {
        return {
          success: false,
          message: `Paragraph ${idx + 1} does not exist.`,
          updatedParagraphs: paragraphs,
        };
      }
      const updated = [...paragraphs];
      updated.splice(idx, 0, text);
      return {
        success: true,
        message: `Added new paragraph before paragraph ${idx + 1}.`,
        updatedParagraphs: updated,
        affectedIndices: [idx],
        structuredData: {
          action: "add_before",
          target: `paragraph ${idx + 1}`,
          replacement: text,
        },
      };
    },
  },
  {
    pattern:
      /^(?:move|swap)\s+paragraph\s+(\d+)\s+(?:to|with)\s+(?:paragraph\s+)?(\d+)$/i,
    description: "Swap two paragraphs by number",
    example: "swap paragraph 1 with 3",
    handler: (paragraphs, match) => {
      const a = parseInt(match[1], 10) - 1;
      const b = parseInt(match[2], 10) - 1;
      if (a < 0 || a >= paragraphs.length || b < 0 || b >= paragraphs.length) {
        return {
          success: false,
          message: `Invalid paragraph number(s).`,
          updatedParagraphs: paragraphs,
        };
      }
      const updated = [...paragraphs];
      [updated[a], updated[b]] = [updated[b], updated[a]];
      return {
        success: true,
        message: `Swapped paragraphs ${a + 1} and ${b + 1}.`,
        updatedParagraphs: updated,
        affectedIndices: [a, b],
        structuredData: {
          action: "swap",
          target: `paragraph ${a + 1}`,
          replacement: `paragraph ${b + 1}`,
        },
      };
    },
  },
  {
    pattern: /^undo$/i,
    description: "Undo the last change",
    example: "undo",
    handler: (paragraphs) => {
      return {
        success: false,
        message: "Undo is handled externally.",
        updatedParagraphs: paragraphs,
      };
    },
  },
  {
    pattern:
      /^(?:summarize|summary)(?:\s+of)?(?:\s+the)?\s+(?:entire\s+)?(?:document|pdf|file)$/i,
    description: "AI summary of the whole document",
    example: "summarize the document",
    handler: (paragraphs) => {
      // Logic-driven summary
      const wordCount = paragraphs.join(" ").split(/\s+/).length;
      const summary = `This document contains ${paragraphs.length} paragraphs. It's roughly ${wordCount} words long. The introduction mentions: "${paragraphs[0].slice(0, 100)}..."`;

      return {
        success: true,
        message: "Summarizing document...",
        updatedParagraphs: paragraphs,
        scribeResponse: {
          type: "summary",
          content: summary,
          title: "Scribe's Summary",
        },
      };
    },
  },
  {
    pattern:
      /^(?:summarize|summary)(?:\s+the)?\s+(?:selected\s+)?(?:line|text)$/i,
    description: "Summarize selected text (AI)",
    example: "summarize the selected line",
    handler: (paragraphs) => {
      if (paragraphs.length > 1) {
        return {
          success: false,
          message: "Please select a specific line/paragraph first.",
          updatedParagraphs: paragraphs,
        };
      }
      return {
        success: false,
        message: "Not recognized. Route to AI",
        updatedParagraphs: paragraphs,
      };
    },
  },
  {
    pattern:
      /^(?:simplify|shorten)(?:\s+the)?\s+(?:selected\s+)?(?:line|text)$/i,
    description: "Simplify selected text (AI)",
    example: "simplify the selected line",
    handler: (paragraphs) => {
      if (paragraphs.length > 1) {
        return {
          success: false,
          message: "Please select a specific line/paragraph first.",
          updatedParagraphs: paragraphs,
        };
      }
      return {
        success: false,
        message: "Not recognized. Route to AI",
        updatedParagraphs: paragraphs,
      };
    },
  },
  {
    pattern:
      /^(?:check|analyze|highlight|fix)?\s*(?:grammar|grammar\s+mistakes)(?:\s+in)?(?:\s+the)?\s*(?:selected\s+)?(?:line|text)?$/i,
    description: "Check grammar in selected text (AI)",
    example: "check grammar in the selected line",
    handler: (paragraphs) => {
      if (paragraphs.length > 1) {
        return {
          success: false,
          message: "Please select a specific line/paragraph first.",
          updatedParagraphs: paragraphs,
        };
      }
      return {
        success: false,
        message: "Not recognized. Route to AI",
        updatedParagraphs: paragraphs,
      };
    },
  },
  {
    pattern:
      /^(?:show|get)\s+(?:stats|statistics|info)(?:\s+for)?\s+(?:the)?\s+(?:document|pdf|file)$/i,
    description: "Show word count, read time & stats",
    example: "get stats for the document",
    handler: (paragraphs) => {
      const allText = paragraphs.join(" ");
      const words = allText.split(/\s+/).length;
      const chars = allText.length;
      const readTime = Math.ceil(words / 200);

      return {
        success: true,
        message: "Calculating stats...",
        updatedParagraphs: paragraphs,
        scribeResponse: {
          type: "stats",
          content: `• Paragraphs: ${paragraphs.length}\n• Words: ${words}\n• Characters: ${chars}\n• Est. Read Time: ~${readTime} min`,
          title: "Document Statistics",
        },
      };
    },
  },
  {
    pattern: /^(?:find|search(?:\s+for)?)\s+["']?(.+?)["']?$/i,
    description: "Find a word or phrase",
    example: "find student",
    handler: (paragraphs, match) => {
      const query = match[1].trim().toLowerCase();
      const foundIdx = paragraphs.findIndex((p) =>
        p.toLowerCase().includes(query),
      );

      if (foundIdx === -1) {
        return {
          success: false,
          message: `Could not find "${query}" in the document.`,
          updatedParagraphs: paragraphs,
        };
      }

      return {
        success: true,
        message: `Found "${query}" in paragraph ${foundIdx + 1}.`,
        updatedParagraphs: paragraphs,
        affectedIndices: [foundIdx],
        structuredData: {
          action: "search",
          target: query,
        },
      };
    },
  },
  {
    pattern:
      /^(?:go\s+to|navigate\s+to|scroll\s+to)\s+(?:paragraph|page)\s+(\d+)$/i,
    description: "Scroll to a specific paragraph",
    example: "go to paragraph 5",
    handler: (paragraphs, match) => {
      const idx = parseInt(match[1], 10) - 1;
      if (idx < 0 || idx >= paragraphs.length) {
        return {
          success: false,
          message: `Paragraph ${idx + 1} does not exist.`,
          updatedParagraphs: paragraphs,
        };
      }
      return {
        success: true,
        message: `Navigated to paragraph ${idx + 1}.`,
        updatedParagraphs: paragraphs,
        affectedIndices: [idx],
        structuredData: {
          action: "scroll",
          target: `paragraph ${idx + 1}`,
        },
      };
    },
  },
  {
    pattern:
      /^(?:read|echo|speak)\s+(?:paragraph\s+(\d+)|the\s+entire\s+document)$/i,
    description: "Read aloud (The Scribe's Echo)",
    example: "read paragraph 1",
    handler: (paragraphs, match) => {
      const pIdxStr = match[1];
      let textToRead = "";
      let title = "Scribe's Echo";

      if (pIdxStr) {
        const idx = parseInt(pIdxStr, 10) - 1;
        if (idx < 0 || idx >= paragraphs.length) {
          return {
            success: false,
            message: `Paragraph ${idx + 1} does not exist.`,
            updatedParagraphs: paragraphs,
          };
        }
        textToRead = paragraphs[idx];
        title = `Reading Paragraph ${idx + 1}`;
      } else {
        textToRead = paragraphs.join(" ");
        title = "Reading Document";
      }

      // Web Speech Synthesis API
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(textToRead);

        // Detect Telugu text for better voice selection if needed
        const isTelugu = /[\u0c00-\u0c7f]/.test(textToRead);
        if (isTelugu) utterance.lang = "te-IN";
        else utterance.lang = "en-US";

        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        window.speechSynthesis.speak(utterance);
      }

      return {
        success: true,
        message: pIdxStr
          ? `Reading paragraph ${pIdxStr}...`
          : "Reading entire document...",
        updatedParagraphs: paragraphs,
        affectedIndices: pIdxStr ? [parseInt(pIdxStr, 10) - 1] : [],
        scribeResponse: {
          type: "info",
          content: "The Scribe is reading your words aloud.",
          title: title,
        },
      };
    },
  },
  {
    pattern:
      /^(?:rewrite|format|change\s+tone\s+of)\s+paragraph\s+(\d+)\s+to\s+be\s+(professional|poetic|simple|shorter)$/i,
    description: "The Style Alchemist (Tone Shifting)",
    example: "rewrite paragraph 1 to be professional",
    handler: (paragraphs, match) => {
      const idx = parseInt(match[1], 10) - 1;
      const tone = match[2].toLowerCase();

      if (idx < 0 || idx >= paragraphs.length) {
        return {
          success: false,
          message: `Paragraph ${idx + 1} does not exist.`,
          updatedParagraphs: paragraphs,
        };
      }

      const original = paragraphs[idx];
      let rewritten = original;

      // Simulated AI Tone Shifting logic
      if (tone === "professional") {
        rewritten = `It should be noted that ${original.charAt(0).toLowerCase()}${original.slice(1).replace(/[!?]/g, ".")}`;
        if (!rewritten.endsWith(".")) rewritten += " regarding this matter.";
      } else if (tone === "poetic") {
        rewritten = `Like gold upon velvet, ${original.charAt(0).toLowerCase()}${original.slice(1)}`;
      } else if (tone === "simple") {
        rewritten = original.split(".")[0] + ". Basically, it means this.";
      } else if (tone === "shorter") {
        rewritten =
          original.slice(0, Math.floor(original.length * 0.6)) + "...";
      }

      const updated = [...paragraphs];
      updated[idx] = rewritten;

      return {
        success: true,
        message: `Paragraph ${idx + 1} has been transmuted to a ${tone} tone.`,
        updatedParagraphs: updated,
        affectedIndices: [idx],
        scribeResponse: {
          type: "info",
          content: `Transmutation complete: Paragraph ${idx + 1} is now ${tone}.`,
          title: "Style Alchemist",
        },
        structuredData: {
          action: "rewrite",
          target: `paragraph ${idx + 1}`,
          replacement: tone,
        },
      };
    },
  },
  {
    pattern: /^(?:enter|leave|toggle|turn\s+on|turn\s+off)\s+focus\s+mode$/i,
    description: "Deep Focus Mode (Visual Isolation)",
    example: "enter focus mode",
    handler: (paragraphs, match) => {
      const isEntering =
        !match[0].toLowerCase().includes("off") &&
        !match[0].toLowerCase().includes("leave");

      return {
        success: true,
        message: isEntering
          ? "Entering Deep Focus mode..."
          : "Leaving Focus mode...",
        updatedParagraphs: paragraphs,
        scribeResponse: {
          type: "info",
          content: isEntering
            ? "Deep Focus Active: Secondary elements dimmed to help your concentration."
            : "Focus mode disabled. Returning to standard view.",
          title: "Scribe's Concentration",
        },
        structuredData: {
          action: "focus_toggle",
          target: isEntering ? "on" : "off",
        },
      };
    },
  },
  {
    pattern: /^(?:bold|italic|highlight|underline)\s+paragraph\s+(\d+)$/i,
    description: "Voice-Driven Formatting",
    example: "bold paragraph 2",
    handler: (paragraphs, match) => {
      const format = match[0].split(" ")[0].toLowerCase();
      const idx = parseInt(match[1], 10) - 1;

      if (idx < 0 || idx >= paragraphs.length) {
        return {
          success: false,
          message: `Paragraph ${idx + 1} does not exist.`,
          updatedParagraphs: paragraphs,
        };
      }

      const updated = [...paragraphs];
      const text = updated[idx];

      if (format === "bold") updated[idx] = `**${text.replace(/\*\*/g, "")}**`;
      else if (format === "italic")
        updated[idx] = `*${text.replace(/\*/g, "")}*`;
      else if (format === "highlight")
        updated[idx] = `<mark>${text.replace(/<\/?mark>/g, "")}</mark>`;
      else if (format === "underline")
        updated[idx] = `<u>${text.replace(/<\/?u>/g, "")}</u>`;

      return {
        success: true,
        message: `Applied ${format} to paragraph ${idx + 1}.`,
        updatedParagraphs: updated,
        affectedIndices: [idx],
        structuredData: {
          action: "format",
          target: `paragraph ${idx + 1}`,
          replacement: format,
        },
      };
    },
  },
  {
    pattern:
      /^(?:translate|translation|transmute)\s+paragraph\s+(\d+)\s+(?:to|into)\s+(.+)$/i,
    description: "Mystical Translation",
    example: "translate paragraph 1 to Telugu",
    handler: (paragraphs, match) => {
      const idx = parseInt(match[1], 10) - 1;
      const lang = match[2].toLowerCase();

      if (idx < 0 || idx >= paragraphs.length) {
        return {
          success: false,
          message: `Paragraph ${idx + 1} does not exist.`,
          updatedParagraphs: paragraphs,
        };
      }

      // Mock Translation Logic
      let translation = "[Translation Service Offline]";
      if (lang.includes("telugu")) {
        translation =
          "ఈ అనువాదం ప్రాసెస్ చేయబడింది (This translation was processed).";
      } else if (lang.includes("hindi")) {
        translation =
          "यह अनुवाद संसाధित किया गया था (This translation was processed).";
      } else {
        translation = `[Mock ${lang} Translation of Para ${idx + 1}]`;
      }

      const updated = [...paragraphs];
      updated[idx] = translation;

      return {
        success: true,
        message: `Paragraph ${idx + 1} translated to ${lang}.`,
        updatedParagraphs: updated,
        affectedIndices: [idx],
        scribeResponse: {
          type: "info",
          content: `Document transmuted into ${lang} script.`,
          title: "Mystical Translation",
        },
      };
    },
  },
  {
    pattern: /^(?:ask\s+scribe|oracle|question)[:\s]+(.+)$/i,
    description: "The Oracle (Document Q&A)",
    example: "ask Scribe: What is the main point?",
    handler: (paragraphs, match) => {
      const query = match[1].toLowerCase();
      const allText = paragraphs.join(" ").toLowerCase();

      let answer = "The Scribe cannot see clear truth in this matter yet.";

      if (
        query.includes("who") ||
        query.includes("author") ||
        query.includes("person")
      ) {
        const names = paragraphs.join(" ").match(/([A-Z][a-z]+ [A-Z][a-z]+)/g);
        answer = names
          ? `I discern mention of names like: ${names.slice(0, 3).join(", ")}.`
          : "I found no clear names in the scrolls.";
      } else if (
        query.includes("what") ||
        query.includes("topic") ||
        query.includes("about")
      ) {
        answer = `The scrolls speak mostly of subjects like: ${paragraphs[0].split(" ").slice(0, 5).join(" ")}... and appear to be ${paragraphs.length} blocks long.`;
      } else if (query.includes("summary")) {
        answer =
          "The oracle suggests this document is a structured collection of thoughts.";
      }

      return {
        success: true,
        message: "The Oracle has spoken.",
        updatedParagraphs: paragraphs,
        scribeResponse: {
          type: "info",
          content: answer,
          title: "Oracle's Answer",
        },
      };
    },
  },
];

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function processVoiceCommand(
  command: string,
  paragraphs: string[],
): CommandResult {
  const trimmed = command.trim();
  const lowerCmd = trimmed.toLowerCase();

  for (const cmd of commands) {
    const match = trimmed.match(cmd.pattern);
    if (match) {
      return cmd.handler([...paragraphs], match);
    }
  }

  // Fuzzy suggestion fallback
  let suggestion = "Try: 'delete paragraph 2' or 'find [word]'";
  if (lowerCmd.includes("replace"))
    suggestion = "Did you mean: 'replace X with Y'?";
  else if (lowerCmd.includes("add"))
    suggestion = "Did you mean: 'add [text] after paragraph N'?";
  else if (lowerCmd.includes("swap") || lowerCmd.includes("move"))
    suggestion = "Did you mean: 'swap paragraph A with B'?";
  else if (lowerCmd.includes("delete") || lowerCmd.includes("remove"))
    suggestion = "Did you mean: 'delete paragraph N'?";
  else if (lowerCmd.includes("read") || lowerCmd.includes("speak"))
    suggestion = "Did you mean: 'read paragraph N'?";
  else if (lowerCmd.includes("rewrite") || lowerCmd.includes("tone"))
    suggestion = "Did you mean: 'rewrite paragraph N to be professional'?";
  else if (lowerCmd.includes("focus"))
    suggestion = "Did you mean: 'enter focus mode'?";
  else if (lowerCmd.includes("translate"))
    suggestion = "Did you mean: 'translate paragraph N to Telugu'?";
  else if (lowerCmd.includes("bold") || lowerCmd.includes("italic"))
    suggestion = "Did you mean: 'bold paragraph N'?";
  else if (lowerCmd.includes("ask") || lowerCmd.includes("question"))
    suggestion = "Did you mean: 'ask Scribe: [your question]'?";

  return {
    success: false,
    message: `Not recognized. ${suggestion}`,
    updatedParagraphs: paragraphs,
  };
}

export function getAvailableCommands(): Array<{
  description: string;
  example: string;
}> {
  return commands
    .filter((c) => c.description !== "Undo the last change") // shown separately in UI
    .map((c) => ({ description: c.description, example: c.example }));
}
