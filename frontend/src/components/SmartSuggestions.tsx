import React, { useState, useEffect, useCallback } from "react";
import { Sparkles, Loader2, ChevronRight } from "lucide-react";

interface SmartSuggestionsProps {
  paragraphs: string[];
  lastCommand: string;
  onSuggestionClick: (suggestion: string) => void;
  isVisible: boolean;
}

const SmartSuggestions = ({
  paragraphs,
  lastCommand,
  onSuggestionClick,
  isVisible,
}: SmartSuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = useCallback(async () => {
    if (!paragraphs.length || !lastCommand) return;
    setLoading(true);
    setSuggestions([]);

    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    const siteUrl = import.meta.env.VITE_SITE_URL || "http://localhost:8080";
    const siteName = import.meta.env.VITE_SITE_NAME || "AI Voice Editor";
    const sample = paragraphs.slice(0, 5).join(" ").slice(0, 600);

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
            messages: [
              {
                role: "system",
                content:
                  "You are an AI editor assistant. Based on the last command and document excerpt, suggest exactly 3 short follow-up commands the user might want to run next. Reply ONLY with a JSON array of 3 strings. Each string must be a natural voice command like 'Summarise segment 1'. Keep each under 8 words.",
              },
              {
                role: "user",
                content: `Last command: "${lastCommand}"\n\nDocument excerpt:\n${sample}\n\nSuggest 3 next commands.`,
              },
            ],
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        const raw = data.choices?.[0]?.message?.content || "[]";
        const cleaned = raw.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        if (Array.isArray(parsed)) {
          setSuggestions(parsed.slice(0, 3));
        }
      }
    } catch {
      // Silent fail — suggestions are non-critical
    } finally {
      setLoading(false);
    }
  }, [paragraphs, lastCommand]);

  useEffect(() => {
    if (isVisible && lastCommand) {
      fetchSuggestions();
    }
  }, [isVisible, lastCommand, fetchSuggestions]);

  if (!isVisible) return null;

  return (
    <div className="w-full max-w-4xl animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-3 h-3 text-accent/60" />
        <span className="font-tech text-[9px] text-primary/40 tracking-[0.25em] uppercase">
          Neural_Suggestions
        </span>
        {loading && (
          <Loader2 className="w-3 h-3 text-accent/40 animate-spin ml-1" />
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {loading
          ? // Skeleton chips while loading
            [0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-8 w-36 bg-primary/5 border border-primary/10 rounded-sm animate-pulse"
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))
          : suggestions.length > 0
            ? suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => onSuggestionClick(s)}
                  className="flex items-center gap-1.5 px-4 py-2 text-[10px] font-mono
                border border-primary/15 bg-primary/5 text-primary/70
                hover:border-accent/40 hover:bg-accent/10 hover:text-accent
                transition-all duration-300 rounded-sm group"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <ChevronRight className="w-3 h-3 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  {s}
                </button>
              ))
            : null}
      </div>
    </div>
  );
};

export default SmartSuggestions;
