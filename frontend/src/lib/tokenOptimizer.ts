/**
 * Token Optimization Layer
 * ─────────────────────────
 * 1. In-memory response cache (keyed by hash of command + doc fingerprint)
 * 2. Command deduplication guard (blocks same command within 3s)
 * 3. Paragraph truncation with smarter "target-aware" windowing
 * 4. System-prompt minifier (strips whitespace before sending)
 */

// ── 1. Simple in-memory cache ────────────────────────────────────────────────
interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

class ResponseCache<T> {
  private store = new Map<string, CacheEntry<T>>();
  private readonly ttlMs: number;

  constructor(ttlMinutes = 10) {
    this.ttlMs = ttlMinutes * 60 * 1000;
  }

  private hash(key: string): string {
    // Fast djb2 hash — good enough for cache keys
    let h = 5381;
    for (let i = 0; i < key.length; i++) {
      h = ((h << 5) + h) ^ key.charCodeAt(i);
    }
    return (h >>> 0).toString(36);
  }

  get(command: string, docFingerprint: string): T | null {
    const key = this.hash(`${command}::${docFingerprint}`);
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  set(command: string, docFingerprint: string, value: T): void {
    const key = this.hash(`${command}::${docFingerprint}`);
    this.store.set(key, { value, expiresAt: Date.now() + this.ttlMs });
    // Evict oldest entries if cache grows too large
    if (this.store.size > 50) {
      const firstKey = this.store.keys().next().value;
      if (firstKey) this.store.delete(firstKey);
    }
  }

  clear(): void {
    this.store.clear();
  }
}

// ── 2. Deduplication guard ────────────────────────────────────────────────────
class DedupeGuard {
  private lastCall = new Map<string, number>();
  private readonly windowMs: number;

  constructor(windowMs = 3000) {
    this.windowMs = windowMs;
  }

  isDuplicate(key: string): boolean {
    const last = this.lastCall.get(key);
    if (last && Date.now() - last < this.windowMs) return true;
    this.lastCall.set(key, Date.now());
    return false;
  }
}

// ── 3. Smart paragraph windowing ─────────────────────────────────────────────
/**
 * Instead of always sending the first N paragraphs, extract a ±3 window
 * around the target paragraph if the command mentions a specific segment.
 */
export function buildSmartDocumentContext(
  paragraphs: string[],
  command: string,
  maxParagraphs = 12,
): string {
  // Try to detect a target segment index from the command
  const segmentMatch = command.match(/segment[s]?\s+(\d+)/i);
  const targetIdx = segmentMatch ? parseInt(segmentMatch[1]) - 1 : -1;

  let sample: string[];
  let windowNote = "";

  if (targetIdx >= 0 && targetIdx < paragraphs.length) {
    // Window: 3 before target, target, 3 after — capped for context
    const windowSize = Math.floor(maxParagraphs / 2);
    const start = Math.max(0, targetIdx - windowSize);
    const end = Math.min(paragraphs.length, targetIdx + windowSize + 1);
    sample = paragraphs.slice(start, end);
    if (start > 0) windowNote = `[...${start} paragraphs omitted before...]\n`;
    if (end < paragraphs.length)
      windowNote += `\n[...${paragraphs.length - end} paragraphs omitted after...]`;
  } else {
    sample = paragraphs.slice(0, maxParagraphs);
    if (paragraphs.length > maxParagraphs)
      windowNote = `\n[...${paragraphs.length - maxParagraphs} more paragraphs not shown]`;
  }

  // Calculate original indices for accurate editing
  const startIdx =
    targetIdx >= 0 ? Math.max(0, targetIdx - Math.floor(maxParagraphs / 2)) : 0;
  const context = sample
    .map((p, i) => {
      // Truncate very long paragraphs to 300 chars
      const truncated = p.length > 300 ? p.slice(0, 300) + "…" : p;
      return `[${startIdx + i}] ${truncated}`;
    })
    .join("\n");

  return windowNote ? `${windowNote}\n${context}` : context;
}

// ── 4. System prompt minifier ─────────────────────────────────────────────────
export function minifyPrompt(prompt: string): string {
  return prompt
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .join("\n");
}

// ── 5. Fingerprint a document (cheap hash for cache key) ─────────────────────
export function docFingerprint(paragraphs: string[]): string {
  const sample = paragraphs.slice(0, 5).join("").slice(0, 200);
  let h = 5381;
  for (let i = 0; i < sample.length; i++) {
    h = ((h << 5) + h) ^ sample.charCodeAt(i);
  }
  return (h >>> 0).toString(36) + paragraphs.length;
}

// ── Exported singletons ───────────────────────────────────────────────────────
export const commandCache = new ResponseCache(10); // 10 min TTL
export const suggestionCache = new ResponseCache(5); // 5 min TTL
export const titleCache = new ResponseCache(30); // 30 min TTL
export const dedupe = new DedupeGuard(3000); // 3s dedup window
