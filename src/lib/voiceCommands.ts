export interface CommandResult {
  success: boolean;
  message: string;
  updatedParagraphs: string[];
}

type CommandHandler = (
  paragraphs: string[],
  match: RegExpMatchArray
) => CommandResult;

interface CommandPattern {
  pattern: RegExp;
  handler: CommandHandler;
  description: string;
}

const commands: CommandPattern[] = [
  {
    pattern: /^delete\s+paragraph\s+(\d+)$/i,
    description: 'Delete paragraph N',
    handler: (paragraphs, match) => {
      const idx = parseInt(match[1], 10) - 1;
      if (idx < 0 || idx >= paragraphs.length) {
        return { success: false, message: `Paragraph ${idx + 1} does not exist.`, updatedParagraphs: paragraphs };
      }
      const updated = paragraphs.filter((_, i) => i !== idx);
      return { success: true, message: `Deleted paragraph ${idx + 1}.`, updatedParagraphs: updated };
    },
  },
  {
    pattern: /^replace\s+(?:word\s+)?["']?(.+?)["']?\s+with\s+["']?(.+?)["']?$/i,
    description: 'Replace word/phrase X with Y',
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
        return { success: false, message: `"${search}" not found in the document.`, updatedParagraphs: paragraphs };
      }
      return { success: true, message: `Replaced ${count} occurrence(s) of "${search}" with "${replacement}".`, updatedParagraphs: updated };
    },
  },
  {
    pattern: /^add\s+(?:paragraph\s+)?["']?(.+?)["']?\s+(?:after|below)\s+paragraph\s+(\d+)$/i,
    description: 'Add text after paragraph N',
    handler: (paragraphs, match) => {
      const text = match[1].trim();
      const idx = parseInt(match[2], 10) - 1;
      if (idx < 0 || idx >= paragraphs.length) {
        return { success: false, message: `Paragraph ${idx + 1} does not exist.`, updatedParagraphs: paragraphs };
      }
      const updated = [...paragraphs];
      updated.splice(idx + 1, 0, text);
      return { success: true, message: `Added new paragraph after paragraph ${idx + 1}.`, updatedParagraphs: updated };
    },
  },
  {
    pattern: /^add\s+(?:paragraph\s+)?["']?(.+?)["']?\s+(?:before|above)\s+paragraph\s+(\d+)$/i,
    description: 'Add text before paragraph N',
    handler: (paragraphs, match) => {
      const text = match[1].trim();
      const idx = parseInt(match[2], 10) - 1;
      if (idx < 0 || idx >= paragraphs.length) {
        return { success: false, message: `Paragraph ${idx + 1} does not exist.`, updatedParagraphs: paragraphs };
      }
      const updated = [...paragraphs];
      updated.splice(idx, 0, text);
      return { success: true, message: `Added new paragraph before paragraph ${idx + 1}.`, updatedParagraphs: updated };
    },
  },
  {
    pattern: /^(?:move|swap)\s+paragraph\s+(\d+)\s+(?:to|with)\s+(?:paragraph\s+)?(\d+)$/i,
    description: 'Swap paragraph A with paragraph B',
    handler: (paragraphs, match) => {
      const a = parseInt(match[1], 10) - 1;
      const b = parseInt(match[2], 10) - 1;
      if (a < 0 || a >= paragraphs.length || b < 0 || b >= paragraphs.length) {
        return { success: false, message: `Invalid paragraph number(s).`, updatedParagraphs: paragraphs };
      }
      const updated = [...paragraphs];
      [updated[a], updated[b]] = [updated[b], updated[a]];
      return { success: true, message: `Swapped paragraphs ${a + 1} and ${b + 1}.`, updatedParagraphs: updated };
    },
  },
  {
    pattern: /^undo$/i,
    description: 'Undo last change',
    handler: (paragraphs) => {
      return { success: false, message: "Undo is handled externally.", updatedParagraphs: paragraphs };
    },
  },
];

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function processVoiceCommand(
  command: string,
  paragraphs: string[]
): CommandResult {
  const trimmed = command.trim();

  for (const cmd of commands) {
    const match = trimmed.match(cmd.pattern);
    if (match) {
      return cmd.handler([...paragraphs], match);
    }
  }

  return {
    success: false,
    message: `Command not recognized: "${trimmed}". Try: "delete paragraph 2", "replace hello with hi", "add text after paragraph 1", or "swap paragraph 1 with 3".`,
    updatedParagraphs: paragraphs,
  };
}

export function getAvailableCommands(): string[] {
  return commands.map((c) => c.description);
}
