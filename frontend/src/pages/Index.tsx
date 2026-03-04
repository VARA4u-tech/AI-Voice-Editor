import { useState, useRef, useCallback, useEffect } from "react";
import FloatingParticles from "@/components/FloatingParticles";
import GoldDivider from "@/components/GoldDivider";
import MicButton from "@/components/MicButton";
import UploadButton from "@/components/UploadButton";
import StatusIndicator from "@/components/StatusIndicator";
import PreviewArea from "@/components/PreviewArea";
import MysticalHero from "@/components/MysticalHero";
import CyberHero from "@/components/CyberHero";
import ChatWidget from "@/components/ChatWidget";
import ScribeSidebar from "@/components/ScribeSidebar";
import MysticalBackground from "@/components/MysticalBackground";
import useSpeechRecognition from "@/hooks/useSpeechRecognition";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Sparkles, Activity } from "lucide-react";
import MoonPhaseAnimation from "@/components/MoonPhaseAnimation";
import GoldWaveform from "@/components/GoldWaveform";
import CommandHelp from "@/components/CommandHelp";
import { parseDocument, type ParsedDocument } from "@/lib/documentParser";
import { processVoiceCommand, type CommandResult } from "@/lib/voiceCommands";
import { processCommandWithAI, processChatOnly } from "@/lib/aiService";
import { exportToPdf } from "@/lib/pdfExport";
import { useSessionTimer } from "@/hooks/useSessionTimer";
import {
  Download,
  X,
  Wand2,
  Timer,
  Save,
  Target,
  RotateCcw,
  RotateCw,
  History as HistoryIcon,
} from "lucide-react";
import OnboardingTutorial from "@/components/OnboardingTutorial";
import SmartSuggestions from "@/components/SmartSuggestions";
import Footer from "@/components/Footer";
import { titleCache, docFingerprint, minifyPrompt } from "@/lib/tokenOptimizer";

const STORAGE_KEY = "gilded-scribe-session";

function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as {
      fileName: string;
      paragraphs: string[];
      pageCount: number;
    };
  } catch {
    return null;
  }
}

const Index = () => {
  const { user } = useAuth();
  const saved = loadSession();
  const [fileName, setFileName] = useState(saved?.fileName ?? "");
  const [paragraphs, setParagraphs] = useState<string[]>(
    saved?.paragraphs ?? [],
  );
  // Session timer — starts/resets with document
  const { formatted: sessionTime } = useSessionTimer(
    paragraphs.length > 0,
    fileName,
  );
  const [history, setHistory] = useState<string[][]>([]);
  const [future, setFuture] = useState<string[][]>([]);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [pageCount, setPageCount] = useState(saved?.pageCount ?? 0);
  const [isParsing, setIsParsing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [lastCommand, setLastCommand] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [pdfType, setPdfType] = useState<"text" | "scanned" | "mixed" | null>(
    null,
  );
  const [commandFeedback, setCommandFeedback] = useState<string | null>(null);
  const [commandSuccess, setCommandSuccess] = useState(false);
  const [lastEditedIndices, setLastEditedIndices] = useState<number[]>([]);
  const [scribeLog, setScribeLog] = useState<
    Array<{
      title?: string;
      content: string;
      type: "summary" | "stats" | "info" | "error";
      timestamp: Date;
    }>
  >([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [selectedParagraphIndex, setSelectedParagraphIndex] = useState<
    number | null
  >(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    playClick,
    playSuccess,
    playError,
    playHover,
    playStart,
    playStop,
    playTransition,
    playTypewriterTick,
  } = useSoundEffects();

  // ── Sync with Supabase on Login ──
  useEffect(() => {
    if (user && paragraphs.length === 0) {
      supabase
        .from("user_documents")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(1)
        .single()
        .then(({ data, error }) => {
          if (data && !error) {
            setFileName(data.file_hash);
            setParagraphs(data.content);
            setPageCount(data.page_count);
            setCommandFeedback("Ritual_Restored: Cloud synchronize complete.");
            playSuccess();
          }
        });
    }
  }, [user, paragraphs.length, playSuccess]);

  // ── Persist session on every change ──
  useEffect(() => {
    // Local Persistence fallback
    if (paragraphs.length > 0) {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ fileName, paragraphs, pageCount }),
        );
      } catch {
        /* ignore quota */
      }
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }

    // Supabase Persistence
    if (user && paragraphs.length > 0) {
      supabase
        .from("user_documents")
        .upsert({
          user_id: user.id,
          file_hash: fileName || "unnamed_ritual",
          content: paragraphs,
          page_count: pageCount,
          updated_at: new Date().toISOString(),
        })
        .then(({ error }) => {
          if (error) console.error("Ritual_Backup Failed:", error.message);
        });
    }
  }, [fileName, paragraphs, pageCount, user]);

  const clearFeedback = useCallback(() => {
    setTimeout(() => setCommandFeedback(null), 4000);
  }, []);

  const handleCommand = useCallback(
    async (command: string) => {
      if (!paragraphs.length) {
        setCommandFeedback(
          "Upload a document first before using voice commands.",
        );
        setCommandSuccess(false);
        clearFeedback();
        return;
      }

      const trimmedCmd = command.trim();

      // 1. Handle Undo (Special case, local only)
      if (/^undo$/i.test(trimmedCmd)) {
        if (history.length > 0) {
          const prev = history[history.length - 1];
          setFuture((f) => [...f, paragraphs]); // save current for redo
          setParagraphs(prev);
          setHistory((h) => h.slice(0, -1));
          setCommandFeedback("Undone last change.");
          setCommandSuccess(true);
          playSuccess();
        } else {
          setCommandFeedback("Nothing to undo.");
          setCommandSuccess(false);
          playError();
        }
        clearFeedback();
        return;
      }

      // 1b. Handle Redo (voice command)
      if (/^redo$/i.test(trimmedCmd)) {
        if (future.length > 0) {
          const next = future[future.length - 1];
          setFuture((f) => f.slice(0, -1));
          setHistory((h) => [...h, paragraphs]);
          setParagraphs(next);
          setCommandFeedback("Redone last undone change.");
          setCommandSuccess(true);
          playSuccess();
        } else {
          setCommandFeedback("Nothing to redo.");
          setCommandSuccess(false);
          playError();
        }
        clearFeedback();
        return;
      }

      setIsProcessing(true);
      let result: CommandResult;

      // 2. Try the Regex Engine first (FAST)
      // Regex commands generally apply to the whole document, unless it's a specific targeting command
      result = processVoiceCommand(
        trimmedCmd,
        paragraphs,
        selectedParagraphIndex,
      );

      // 3. Fallback to AI (LLM) if regex didn't recognize it
      if (!result.success && result.message.includes("Not recognized")) {
        const targetParagraphs =
          selectedParagraphIndex !== null
            ? [paragraphs[selectedParagraphIndex]]
            : paragraphs;

        setCommandFeedback(
          selectedParagraphIndex !== null
            ? `Scribe_AI: Modulating Segment ${selectedParagraphIndex + 1}...`
            : "Scribe_AI: Decrypting intent...",
        );
        result = await processCommandWithAI(trimmedCmd, targetParagraphs);

        // If we were in targeted mode for the AI fallback, we need to merge the result back into the full document
        if (selectedParagraphIndex !== null && result.success) {
          const newParagraphs = [...paragraphs];
          newParagraphs[selectedParagraphIndex] = result.updatedParagraphs[0];
          result.updatedParagraphs = newParagraphs;
          // Adjust affected indices if they exist (though in single mode it's always just one)
          result.affectedIndices = [selectedParagraphIndex];
        }
      }

      setCommandFeedback(result.message);
      setCommandSuccess(result.success);
      setIsProcessing(false);

      if (result.success) {
        playSuccess();

        // Log to Supabase Activity
        if (user) {
          supabase
            .from("scribe_activity")
            .insert({
              user_id: user.id,
              document_name: fileName || "unnamed_ritual",
              command_type: result.structuredData?.action || "unknown",
              transcript: trimmedCmd,
              is_success: true,
            })
            .then(({ error }) => {
              if (error) console.error("Ritual_Log Failed:", error.message);
            });
        }

        if (result.scribeResponse) {
          // Check for Focus Mode Toggle
          if (result.structuredData?.action === "focus_toggle") {
            setIsFocusMode((prev) => !prev);
          }

          setScribeLog((prev) => [
            {
              ...result.scribeResponse!,
              timestamp: new Date(),
            },
            ...prev,
          ]);
          setIsSidebarOpen(true);
        }

        // If the AI updated the paragraphs, save to history
        if (
          JSON.stringify(result.updatedParagraphs) !==
          JSON.stringify(paragraphs)
        ) {
          setHistory((h) => [...h, paragraphs]);
          setParagraphs(result.updatedParagraphs);
          if (result.affectedIndices) {
            setLastEditedIndices(result.affectedIndices);
            setTimeout(() => setLastEditedIndices([]), 3000);
          }
        }
      } else {
        playError();
      }

      clearFeedback();

      // Trigger Smart Suggestions after a successful AI command
      if (result.success) {
        setLastCommand(trimmedCmd);
        setShowSuggestions(true);
      }

      return result;
    },
    [
      paragraphs,
      history,
      future,
      clearFeedback,
      playSuccess,
      playError,
      user,
      fileName,
      selectedParagraphIndex,
    ],
  );

  const handleSelectParagraph = useCallback((index: number | null) => {
    setSelectedParagraphIndex(index);
    if (index !== null) {
      setCommandFeedback(`Target_Locked: Segment ${index + 1} selected.`);
      setCommandSuccess(true);
    } else {
      setCommandFeedback("Target_Released: Global editing active.");
      setCommandSuccess(true);
    }
    setTimeout(() => setCommandFeedback(null), 3000);
  }, []);

  const handleChat = useCallback(
    async (message: string) => {
      setIsProcessing(true);
      const response = await processChatOnly(message, paragraphs);
      setIsProcessing(false);
      return response;
    },
    [paragraphs],
  );

  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    startListening,
    stopListening,
  } = useSpeechRecognition();

  // ── Typewriter Sound: plays a soft tick as voice text streams in ──
  useEffect(() => {
    if (interimTranscript) playTypewriterTick();
  }, [interimTranscript, playTypewriterTick]);

  const handleMicToggle = useCallback(() => {
    if (isListening) {
      stopListening();
      playStop();
      setTimeout(async () => {
        const cmd = transcript || "";
        if (cmd.trim()) {
          await handleCommand(cmd.trim());
        }
        setIsProcessing(false);
      }, 600);
    } else {
      playStart();
      startListening();
    }
  }, [
    isListening,
    stopListening,
    startListening,
    transcript,
    handleCommand,
    playStart,
    playStop,
  ]);

  // ── Keyboard shortcut: Space (when not typing) or Ctrl+M ──
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      const isTyping =
        tag === "input" ||
        tag === "textarea" ||
        (e.target as HTMLElement)?.isContentEditable;
      if (isTyping) return;

      // Escape — exit Focus Mode
      if (e.key === "Escape") {
        setIsFocusMode(false);
        return;
      }
      // Ctrl+Shift+F — toggle Focus Mode
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        e.key.toLowerCase() === "f"
      ) {
        e.preventDefault();
        setIsFocusMode((prev) => !prev);
        return;
      }
      // Ctrl+Z — Undo
      if (
        (e.ctrlKey || e.metaKey) &&
        !e.shiftKey &&
        e.key.toLowerCase() === "z"
      ) {
        e.preventDefault();
        if (history.length > 0) {
          const prev = history[history.length - 1];
          setFuture((f) => [...f, paragraphs]);
          setParagraphs(prev);
          setHistory((h) => h.slice(0, -1));
          setCommandFeedback(
            `↩ Undo — ${history.length - 1} step${history.length - 1 !== 1 ? "s" : ""} left`,
          );
          setCommandSuccess(true);
          playSuccess();
          clearFeedback();
        }
        return;
      }
      // Ctrl+Y — Redo
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        if (future.length > 0) {
          const next = future[future.length - 1];
          setFuture((f) => f.slice(0, -1));
          setHistory((h) => [...h, paragraphs]);
          setParagraphs(next);
          setCommandFeedback(
            `↪ Redo — ${future.length - 1} step${future.length - 1 !== 1 ? "s" : ""} left`,
          );
          setCommandSuccess(true);
          playSuccess();
          clearFeedback();
        }
        return;
      }
      // Ctrl+H — toggle History Panel
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "h") {
        e.preventDefault();
        setShowHistoryPanel((p) => !p);
        return;
      }
      // Space bar — hold-to-talk feel (toggle)
      if (e.code === "Space" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        handleMicToggle();
        return;
      }
      // Ctrl+M — explicit mic shortcut
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "m") {
        e.preventDefault();
        handleMicToggle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    handleMicToggle,
    isFocusMode,
    history,
    paragraphs,
    playSuccess,
    clearFeedback,
    future,
  ]);

  const handleUpload = () => {
    playClick();
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsParsing(true);
    setParagraphs([]);
    setHistory([]);
    setCommandFeedback(null);

    try {
      const parsed: ParsedDocument = await parseDocument(file);
      setParagraphs(parsed.paragraphs);
      setPageCount(parsed.pageCount);
      setPdfType(parsed.pdfType);
      const typeNote =
        parsed.pdfType === "mixed" ? " ⚠ Some pages are image-only." : "";
      setCommandFeedback(
        `Loaded "${file.name}" — ${parsed.paragraphs.length} paragraphs found.${typeNote}`,
      );
      setCommandSuccess(true);
      playSuccess();
      clearFeedback();

      // ── Auto-save to Supabase history on successful upload ────────────────
      if (user) {
        supabase
          .from("user_documents")
          .upsert(
            {
              user_id: user.id,
              file_hash: file.name,
              content: parsed.paragraphs,
              page_count: parsed.pageCount, // ← now saved correctly
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id,file_hash" },
          )
          .then(({ error }) => {
            if (error) {
              console.error("History auto-save failed:", error.message);
            } else {
              console.info("History: Document auto-saved →", file.name);
            }
          });
      }
    } catch (err) {
      console.error("Parse error:", err);
      const msg = err instanceof Error ? err.message : "";
      if (msg.startsWith("SCANNED_PDF:")) {
        setCommandFeedback(
          "🖼 Scanned PDF detected — no text layer found. " +
            "Please run it through Google Drive or Adobe Acrobat OCR first, then re-upload.",
        );
      } else {
        setCommandFeedback("Failed to parse document. Try a different file.");
      }
      setCommandSuccess(false);
      playError();
      clearFeedback();
    } finally {
      setIsParsing(false);
    }
  };

  const handleClearDocument = () => {
    setFileName("");
    setParagraphs([]);
    setPageCount(0);
    setHistory([]);
    setCommandFeedback("Scroll cleared. Ready for a new document.");
    setCommandSuccess(true);
    playTransition();
    clearFeedback();

    // Clear input value so same file can be uploaded again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Export as a properly formatted PDF using jsPDF
  const handleExport = () => {
    if (!paragraphs.length) return;
    exportToPdf(fileName, paragraphs);
    playSuccess();
  };

  // ── Save Version ──────────────────────────────────────────────────────────
  const [isSavingVersion, setIsSavingVersion] = useState(false);
  const [versionLabel, setVersionLabel] = useState("");
  const [showVersionModal, setShowVersionModal] = useState(false);

  const handleSaveVersion = useCallback(async () => {
    if (!paragraphs.length || !user) return;
    setIsSavingVersion(true);
    const label =
      versionLabel.trim() ||
      `v_${new Date().toISOString().slice(0, 16).replace("T", "_")}`;

    const { error } = await supabase.from("user_documents").upsert(
      {
        user_id: user.id,
        file_hash: label,
        content: paragraphs,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,file_hash" },
    );

    if (error) {
      setCommandFeedback("Failed to save version to the archive.");
      setCommandSuccess(false);
      playError();
    } else {
      setCommandFeedback(`Version "${label}" sealed in the archive.`);
      setCommandSuccess(true);
      playSuccess();
    }
    setVersionLabel("");
    setShowVersionModal(false);
    setIsSavingVersion(false);
    clearFeedback();
  }, [paragraphs, user, versionLabel, playSuccess, playError, clearFeedback]);

  // ── AI Auto-Title Generator ───────────────────────────────────────────────
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);

  const handleGenerateTitle = useCallback(async () => {
    if (!paragraphs.length) return;
    playClick();

    // ── Cache: same doc → same title, no extra API call ────────────────────
    const fp = docFingerprint(paragraphs);
    const cached = titleCache.get("auto-title", fp);
    if (cached) {
      const title = cached as string;
      setFileName(title);
      setCommandFeedback(`Title recalled from cache: "${title}"`);
      setCommandSuccess(true);
      playSuccess();
      clearFeedback();
      return;
    }

    setIsGeneratingTitle(true);
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    const siteUrl = import.meta.env.VITE_SITE_URL || "http://localhost:8080";
    const siteName = import.meta.env.VITE_SITE_NAME || "AI Voice Editor";
    // Only first 500 chars — plenty for a title
    const sample = paragraphs.slice(0, 3).join(" ").slice(0, 500);
    const sysMsg = minifyPrompt(
      "You are a document analyst. Reply ONLY with a concise document title (5 words max, no quotes, no punctuation).",
    );

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
            max_tokens: 30, // a title is max 5 words — very small cap
            temperature: 0.3,
            messages: [
              { role: "system", content: sysMsg },
              { role: "user", content: `Title for: ${sample}` },
            ],
          }),
        },
      );
      if (response.ok) {
        const data = await response.json();
        const suggested = data.choices?.[0]?.message?.content?.trim();
        if (suggested) {
          titleCache.set("auto-title", fp, suggested);
          setFileName(suggested);
          setCommandFeedback(`Title conjured: "${suggested}"`);
          setCommandSuccess(true);
          playSuccess();
          clearFeedback();
        }
      }
    } catch {
      setCommandFeedback("Title generation failed. Check your API key.");
      setCommandSuccess(false);
      playError();
      clearFeedback();
    } finally {
      setIsGeneratingTitle(false);
    }
  }, [paragraphs, playClick, playSuccess, playError, clearFeedback]);

  const displayTranscript =
    transcript +
    (interimTranscript ? (transcript ? " " : "") + interimTranscript : "");

  return (
    <div
      className={`relative min-h-screen emerald-gradient-bg flex flex-col items-center justify-center p-4 overflow-hidden transition-all duration-1000 ${isFocusMode ? "bg-black/80" : ""}`}
    >
      <MysticalBackground />
      <FloatingParticles />
      <ChatWidget paragraphs={paragraphs} onChat={handleChat} />

      {/* ──────────────── Focus Mode Layers ──────────────── */}
      {/* 1. Deep vignette that covers the full screen */}
      <div
        className={`fixed inset-0 z-[5] pointer-events-none transition-opacity duration-700 ${
          isFocusMode ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.92) 100%)",
        }}
      />
      {/* 2. Blur overlay for background chrome */}
      <div
        className={`fixed inset-0 z-[4] bg-background/80 backdrop-blur-sm pointer-events-none transition-opacity duration-700 ${
          isFocusMode ? "opacity-100" : "opacity-0"
        }`}
      />
      {/* 3. Pulsing ambient glow behind the document */}
      {isFocusMode && (
        <div
          className="fixed z-[6] pointer-events-none"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "72vw",
            height: "60vh",
            background:
              "radial-gradient(ellipse at center, hsl(var(--accent)/0.06) 0%, transparent 70%)",
            animation: "pulse 4s ease-in-out infinite",
          }}
        />
      )}
      {/* 4. Floating Exit Focus Mode pill */}
      {isFocusMode && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] animate-fade-in">
          <button
            onClick={() => setIsFocusMode(false)}
            className="flex items-center gap-2.5 px-6 py-2.5 bg-background/80 border border-accent/30 backdrop-blur-md text-accent font-tech text-[10px] uppercase tracking-[0.25em] hover:bg-accent/10 transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.5)]"
          >
            <X className="w-3.5 h-3.5" />
            Exit_Focus · Esc
          </button>
        </div>
      )}

      {/* Onboarding Tutorial */}
      <OnboardingTutorial
        forceShow={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />

      {/* Help Button — hidden in focus mode */}
      {!isFocusMode && (
        <button
          onClick={() => setShowOnboarding(true)}
          title="Open Tutorial"
          className="fixed bottom-6 left-6 z-40 w-9 h-9 flex items-center justify-center rounded-full border border-primary/20 bg-background/60 backdrop-blur-md text-primary/50 hover:text-accent hover:border-accent/40 transition-all duration-300 font-tech text-sm"
        >
          ?
        </button>
      )}

      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        onMouseEnter={() => playHover()}
        className="fixed top-6 right-6 z-40 flex items-center gap-2.5 px-4 py-2.5 bg-slate-950/80 backdrop-blur-xl border border-primary/20 text-primary hover:border-accent/50 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.4)] group overflow-hidden rounded-sm"
      >
        <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="tech-bracket-tl w-1.5 h-1.5" />
        <div className="tech-bracket-br w-1.5 h-1.5" />

        <Activity className="w-4 h-4 group-hover:text-accent group-hover:scale-110 transition-all" />
        <span className="font-tech text-xs tracking-[0.2em] uppercase mt-0.5 group-hover:text-accent font-bold transition-colors hidden sm:block">
          System Log
        </span>

        {scribeLog.length > 0 && (
          <div className="ml-1 sm:ml-2 flex items-center justify-center px-2 py-0.5 bg-accent/20 border border-accent/40 rounded-sm relative">
            <span className="absolute inset-0 bg-accent/20 animate-ping opacity-50 rounded-sm" />
            <span className="font-mono text-[10px] text-accent font-bold tabular-nums relative z-10">
              {scribeLog.length}
            </span>
          </div>
        )}
      </button>

      <ScribeSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        scribeLog={scribeLog}
        paragraphs={paragraphs}
      />

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.txt"
        className="hidden"
      />

      <main
        className={`w-full max-w-5xl flex flex-col items-center mx-auto relative transition-all duration-700 pt-8 sm:pt-16 gap-y-10 ${
          isListening
            ? "scale-[1.02] filter drop-shadow-[0_0_30px_hsl(var(--gold)/0.15)]"
            : "scale-100"
        } ${isFocusMode ? "z-[10]" : "z-10"} animate-fade-in`}
      >
        {/* Hero — collapses in focus mode */}
        <div
          className={`transition-all duration-700 flex flex-col items-center w-full overflow-hidden ${
            isFocusMode
              ? "max-h-0 opacity-0 pointer-events-none"
              : "max-h-[1600px] opacity-100"
          }`}
        >
          <CyberHero fileName={fileName} paragraphsCount={paragraphs.length} />
        </div>

        {/* Upload + Export + Clear row — collapses in Focus Mode */}
        <div
          className={`transition-all duration-700 overflow-hidden w-full ${
            isFocusMode
              ? "max-h-0 opacity-0 pointer-events-none mb-0"
              : "max-h-[500px] opacity-100 mb-8"
          }`}
        >
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 px-4 w-full">
            <UploadButton
              onUpload={handleUpload}
              hasFile={!!fileName}
              fileName={fileName}
            />

            {/* Session Timer Badge */}
            {paragraphs.length > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-2 border border-primary/20 bg-primary/5 rounded-sm animate-fade-in">
                <Timer className="w-3.5 h-3.5 text-accent/60 animate-pulse" />
                <span className="font-mono text-[11px] text-primary/70 tracking-widest tabular-nums">
                  {sessionTime}
                </span>
                <span className="font-tech text-[8px] text-primary/30 uppercase">
                  Session
                </span>
              </div>
            )}

            {paragraphs.length > 0 && (
              <>
                {/* Auto-Title Button */}
                <button
                  onClick={handleGenerateTitle}
                  onMouseEnter={() => playHover()}
                  disabled={isGeneratingTitle}
                  title="AI Auto-Title Generator"
                  className="group relative flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3
                    border border-primary/20 bg-primary/5
                    text-primary font-tech text-[10px] sm:text-[11px] tracking-[0.2em] uppercase
                    transition-all duration-300 w-full sm:w-auto
                    hover:border-accent hover:bg-accent/5 hover:text-accent
                    cursor-pointer animate-fade-in overflow-hidden disabled:opacity-50"
                >
                  <div className="tech-bracket-tl w-1 h-1" />
                  <div className="tech-bracket-br w-1 h-1" />
                  {isGeneratingTitle ? (
                    <div className="w-3.5 h-3.5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Wand2 className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-rotate-12" />
                  )}
                  {isGeneratingTitle ? "Conjuring..." : "Auto_Title"}
                </button>

                {/* Save Version Button — only when logged in */}
                {user && (
                  <button
                    onClick={() => setShowVersionModal(true)}
                    onMouseEnter={() => playHover()}
                    title="Save Version to Archive"
                    className="group relative flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3
                      border border-primary/20 bg-primary/5
                      text-primary font-tech text-[10px] sm:text-[11px] tracking-[0.2em] uppercase
                      transition-all duration-300 w-full sm:w-auto
                      hover:border-accent hover:bg-accent/5 hover:text-accent
                      cursor-pointer animate-fade-in overflow-hidden"
                  >
                    <div className="tech-bracket-tl w-1 h-1" />
                    <div className="tech-bracket-br w-1 h-1" />
                    <Save className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110" />
                    Save_Version
                  </button>
                )}

                <button
                  onClick={handleExport}
                  onMouseEnter={() => playHover()}
                  className="group relative flex items-center justify-center gap-2 px-6 py-2.5 sm:py-3
                    border border-primary/20 bg-primary/5
                    text-primary font-tech text-[10px] sm:text-[11px] tracking-[0.2em] uppercase
                    transition-all duration-300 w-full sm:w-auto
                    hover:border-accent hover:bg-accent/5 hover:text-accent
                    cursor-pointer animate-fade-in overflow-hidden"
                >
                  <div className="tech-bracket-tl w-1 h-1" />
                  <div className="tech-bracket-br w-1 h-1" />
                  <Download className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-y-0.5" />
                  Export_Out
                </button>

                <button
                  onClick={handleClearDocument}
                  onMouseEnter={() => playHover()}
                  title="Clear document"
                  className="group flex items-center justify-center p-2.5 sm:p-3
                    border border-destructive/40 bg-transparent rounded-full
                    text-destructive/80 transition-all duration-300
                    hover:border-destructive hover:bg-destructive/10 hover:text-destructive
                    cursor-pointer animate-fade-in"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-90" />
                </button>

                <div className="flex items-center gap-2 bg-primary/5 px-3 py-1.5 border border-primary/20 rounded-full">
                  <button
                    onClick={() => {
                      if (history.length > 0) {
                        const prev = history[history.length - 1];
                        setFuture((f) => [...f, paragraphs]);
                        setParagraphs(prev);
                        setHistory((h) => h.slice(0, -1));
                        setCommandFeedback(
                          `↩ Undo — ${history.length - 1} step(s) left`,
                        );
                        setCommandSuccess(true);
                        playSuccess();
                        clearFeedback();
                      }
                    }}
                    disabled={history.length === 0}
                    title="Undo (Ctrl+Z)"
                    className="p-1.5 text-primary/40 hover:text-accent disabled:opacity-20 transition-all"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <span className="w-[1px] h-4 bg-primary/10" />
                  <button
                    onClick={() => {
                      if (future.length > 0) {
                        const next = future[future.length - 1];
                        setFuture((f) => f.slice(0, -1));
                        setHistory((h) => [...h, paragraphs]);
                        setParagraphs(next);
                        setCommandFeedback(
                          `↪ Redo — ${future.length - 1} step(s) left`,
                        );
                        setCommandSuccess(true);
                        playSuccess();
                        clearFeedback();
                      }
                    }}
                    disabled={future.length === 0}
                    title="Redo (Ctrl+Y)"
                    className="p-1.5 text-primary/40 hover:text-accent disabled:opacity-20 transition-all"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                  <span className="w-[1px] h-4 bg-primary/10" />
                  <button
                    onClick={() => setShowHistoryPanel((p) => !p)}
                    title="Toggle History Viewer (Ctrl+H)"
                    className={`p-1.5 transition-all ${showHistoryPanel ? "text-accent" : "text-primary/40 hover:text-accent"}`}
                  >
                    <HistoryIcon className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    setIsFocusMode((p) => !p);
                    playTransition();
                  }}
                  onMouseEnter={() => playHover()}
                  title="Toggle Focus Mode (Ctrl+Shift+F)"
                  className="group flex items-center justify-center p-2.5 sm:p-3
                    border border-primary/20 bg-transparent rounded-full
                    text-primary/50 transition-all duration-300
                    hover:border-accent/40 hover:text-accent
                    cursor-pointer animate-fade-in"
                >
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:scale-110" />
                </button>
              </>
            )}
          </div>
        </div>
        {/* end collapsing toolbar wrapper */}

        {!isSupported && (
          <p className="text-destructive/80 font-body text-sm italic mt-2">
            Speech recognition is not supported in this browser
          </p>
        )}

        {/* Mic + Waveform */}
        <div className="flex flex-col items-center gap-3 my-6">
          <MicButton isListening={isListening} onClick={handleMicToggle} />
          <GoldWaveform isActive={isListening} />
          <StatusIndicator
            status={
              isListening ? "listening" : isProcessing ? "processing" : "idle"
            }
          />

          {selectedParagraphIndex !== null && (
            <button
              onClick={() => handleSelectParagraph(null)}
              className="group flex items-center gap-2 px-3 py-1.5 border border-accent/40 bg-accent/10 rounded-full animate-fade-in hover:bg-accent/20 transition-all shadow-[0_0_15px_rgba(255,215,0,0.2)]"
            >
              <Target className="w-3 h-3 text-accent animate-spin-slow" />
              <span className="font-tech text-[10px] text-accent tracking-[0.2em] uppercase">
                Targeting Seg {selectedParagraphIndex + 1}
              </span>
              <X className="w-2.5 h-2.5 text-accent/50 group-hover:text-accent" />
            </button>
          )}

          {displayTranscript && isListening && (
            <div className="relative font-mono text-[11px] text-accent tracking-wider text-center max-w-md animate-fade-in group px-6 py-2 border-x border-accent/20">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
              <p className="relative z-10 uppercase opacity-80">
                <span className="opacity-40 mr-2">Capture:</span>"
                {displayTranscript}"
                <span className="inline-block w-1.5 h-3 bg-accent/60 ml-1 animate-pulse" />
              </p>
            </div>
          )}

          {/* Keyboard shortcut hint */}
          {!isListening && isSupported && (
            <p className="font-heading text-[10px] sm:text-xs tracking-[0.25em] font-bold uppercase text-primary/80 gold-text-glow mt-1 select-none">
              Space · Ctrl+M to speak
            </p>
          )}
        </div>

        <div className="flex justify-center w-full mb-6 relative z-20">
          <CommandHelp />
        </div>

        <GoldDivider />

        {/* ── History Timeline Panel ── */}
        {showHistoryPanel && history.length > 0 && (
          <div className="w-full mb-4 border border-primary/10 bg-primary/5 rounded-sm overflow-hidden animate-fade-in">
            <div className="flex items-center justify-between px-4 py-2 border-b border-primary/10 bg-primary/5">
              <span className="font-tech text-[9px] text-primary/40 uppercase tracking-widest">
                Edit_Timeline — {history.length} snapshot
                {history.length !== 1 ? "s" : ""}
              </span>
              <button
                onClick={() => setShowHistoryPanel(false)}
                className="text-primary/30 hover:text-primary transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="max-h-48 overflow-y-auto divide-y divide-primary/5">
              {[...history].reverse().map((snap, i) => {
                const idx = history.length - 1 - i;
                const wordCount = snap.join(" ").trim().split(/\s+/).length;
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between px-4 py-2.5 hover:bg-primary/10 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[9px] text-primary/20 w-5 tabular-nums">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="font-mono text-[10px] text-primary/60">
                          {snap.length} segments · {wordCount.toLocaleString()}{" "}
                          words
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setFuture((f) => [...f, paragraphs]);
                        setParagraphs(snap);
                        setHistory((h) => h.slice(0, idx));
                        setCommandFeedback(`Restored snapshot ${idx + 1}.`);
                        setCommandSuccess(true);
                        playSuccess();
                        clearFeedback();
                        setShowHistoryPanel(false);
                      }}
                      className="opacity-0 group-hover:opacity-100 px-3 py-1 font-tech text-[8px] uppercase tracking-widest border border-accent/20 text-accent bg-accent/5 hover:bg-accent/15 transition-all rounded-sm"
                    >
                      Restore
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div
          className={`transition-all duration-1000 w-full flex flex-col items-center ${isFocusMode ? "mt-12" : "mt-0"}`}
        >
          <PreviewArea
            paragraphs={paragraphs}
            isLoading={isParsing}
            pageCount={pageCount}
            commandFeedback={commandFeedback}
            commandSuccess={commandSuccess}
            lastEditedIndices={lastEditedIndices}
            onParagraphEdit={(idx, newText) => {
              if (!newText || newText === paragraphs[idx]) return;
              setHistory((h) => [...h, paragraphs]);
              setParagraphs((prev) => {
                const updated = [...prev];
                updated[idx] = newText;
                return updated;
              });
              setLastEditedIndices([idx]);
              setTimeout(() => setLastEditedIndices([]), 3000);
              setCommandFeedback(`Segment ${idx + 1} updated manually.`);
              setCommandSuccess(true);
              playSuccess();
              clearFeedback();
            }}
            selectedParagraphIndex={selectedParagraphIndex}
            onSelectParagraph={handleSelectParagraph}
          />

          {/* Smart Suggestions — appears after each successful command */}
          {paragraphs.length > 0 && (
            <div className="mt-4 px-2 w-full">
              <SmartSuggestions
                paragraphs={paragraphs}
                lastCommand={lastCommand}
                isVisible={showSuggestions}
                onSuggestionClick={(s) => {
                  setShowSuggestions(false);
                  handleCommand(s);
                }}
              />
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Save Version Modal */}
      {showVersionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md p-8 bg-background border border-accent/30 shadow-[0_0_60px_rgba(0,0,0,0.8)] relative mx-4">
            <div className="tech-bracket-tl" />
            <div className="tech-bracket-tr" />
            <div className="tech-bracket-bl" />
            <div className="tech-bracket-br" />
            <h2 className="font-tech text-sm text-primary tracking-[0.3em] uppercase mb-2">
              Seal Version to Archive
            </h2>
            <p className="font-mono text-[10px] text-primary/40 mb-6">
              // Leave blank for auto-timestamp label
            </p>
            <input
              type="text"
              value={versionLabel}
              onChange={(e) => setVersionLabel(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveVersion();
                if (e.key === "Escape") setShowVersionModal(false);
              }}
              placeholder="e.g. Draft_v2 or Final_Review"
              autoFocus
              className="w-full bg-primary/5 border border-primary/20 focus:border-accent/40 rounded-sm px-4 py-3 text-sm font-mono text-primary placeholder:text-primary/20 focus:outline-none transition-colors mb-6"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowVersionModal(false);
                  setVersionLabel("");
                }}
                className="px-5 py-2 font-tech text-[10px] tracking-widest uppercase text-primary/40 hover:text-primary border border-primary/10 hover:border-primary/30 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveVersion}
                disabled={isSavingVersion}
                className="px-5 py-2 font-tech text-[10px] tracking-widest uppercase text-accent border border-accent/30 bg-accent/5 hover:bg-accent/15 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isSavingVersion ? (
                  <div className="w-3 h-3 border border-accent border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-3 h-3" />
                )}
                {isSavingVersion ? "Sealing..." : "Seal_Version"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
