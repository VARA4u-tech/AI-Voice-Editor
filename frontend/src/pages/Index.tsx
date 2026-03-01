import { useState, useRef, useCallback, useEffect } from "react";
import { Download, X } from "lucide-react";
import FloatingParticles from "@/components/FloatingParticles";
import GoldDivider from "@/components/GoldDivider";
import MicButton from "@/components/MicButton";
import UploadButton from "@/components/UploadButton";
import StatusIndicator from "@/components/StatusIndicator";
import PreviewArea from "@/components/PreviewArea";
import MysticalHero from "@/components/MysticalHero";
import CyberHero from "@/components/CyberHero";
import ScribeSidebar from "@/components/ScribeSidebar";
import AmbientPlayer from "@/components/AmbientPlayer";
import MysticalBackground from "@/components/MysticalBackground";
import useSpeechRecognition from "@/hooks/useSpeechRecognition";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { Sparkles } from "lucide-react";
import MoonPhaseAnimation from "@/components/MoonPhaseAnimation";
import GoldWaveform from "@/components/GoldWaveform";
import CommandHelp from "@/components/CommandHelp";
import { parseDocument, type ParsedDocument } from "@/lib/documentParser";
import { processVoiceCommand } from "@/lib/voiceCommands";

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
  const saved = loadSession();
  const [fileName, setFileName] = useState(saved?.fileName ?? "");
  const [paragraphs, setParagraphs] = useState<string[]>(
    saved?.paragraphs ?? [],
  );
  const [history, setHistory] = useState<string[][]>([]);
  const [pageCount, setPageCount] = useState(saved?.pageCount ?? 0);
  const [isParsing, setIsParsing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    playClick,
    playSuccess,
    playError,
    playHover,
    playStart,
    playStop,
    playTransition,
  } = useSoundEffects();

  // ── Persist session to localStorage on every change ──
  useEffect(() => {
    if (paragraphs.length === 0) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ fileName, paragraphs, pageCount }),
      );
    } catch {
      /* quota exceeded — ignore silently */
    }
  }, [fileName, paragraphs, pageCount]);

  const clearFeedback = useCallback(() => {
    setTimeout(() => setCommandFeedback(null), 4000);
  }, []);

  const handleCommand = useCallback(
    (command: string) => {
      if (!paragraphs.length) {
        setCommandFeedback(
          "Upload a document first before using voice commands.",
        );
        setCommandSuccess(false);
        clearFeedback();
        return;
      }

      if (/^undo$/i.test(command.trim())) {
        if (history.length > 0) {
          const prev = history[history.length - 1];
          setParagraphs(prev);
          setHistory((h) => h.slice(0, -1));
          setCommandFeedback("Undone last change.");
          setCommandSuccess(true);
        } else {
          setCommandFeedback("Nothing to undo.");
          setCommandSuccess(false);
        }
        clearFeedback();
        return;
      }

      const result = processVoiceCommand(command, paragraphs);
      setCommandFeedback(result.message);
      setCommandSuccess(result.success);

      if (result.success) {
        playSuccess();
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
        } else {
          setHistory((h) => [...h, paragraphs]);
          setParagraphs(result.updatedParagraphs);
          if (result.affectedIndices) {
            setLastEditedIndices(result.affectedIndices);
            // Clear highlights after 3 seconds
            setTimeout(() => setLastEditedIndices([]), 3000);
          }
        }
      } else {
        playError();
      }

      clearFeedback();
    },
    [paragraphs, history, clearFeedback],
  );

  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    startListening,
    stopListening,
  } = useSpeechRecognition();

  const handleMicToggle = useCallback(() => {
    if (isListening) {
      stopListening();
      playStop();
      setIsProcessing(true);
      setTimeout(() => {
        const cmd = transcript || "";
        if (cmd.trim()) {
          handleCommand(cmd.trim());
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
  }, [handleMicToggle]);

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

  // Export as styled HTML page that can be Print → Save as PDF
  const handleExport = () => {
    const base = fileName ? fileName.replace(/\.[^.]+$/, "") : "document";
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${base} — Gilded Voice Scribe</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400&family=Cormorant+Garamond:ital,wght@0,400;1,400&display=swap');
    body { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 14pt; line-height: 1.8;
           color: #1a1a1a; max-width: 720px; margin: 40px auto; padding: 0 40px; }
    h1 { font-family: 'Cinzel', serif; font-size: 18pt; letter-spacing: 0.2em;
         text-align: center; border-bottom: 1px solid #c8922a; padding-bottom: 16px;
         margin-bottom: 32px; color: #7a5213; }
    p { margin: 0 0 1.4em; text-align: justify; }
    .para-num { font-family: 'Cinzel', serif; font-size: 8pt; color: #c8922a;
                letter-spacing: 0.15em; margin-right: 8px; opacity: 0.6; }
    footer { margin-top: 48px; border-top: 1px solid #ccc; padding-top: 12px;
             font-size: 9pt; color: #999; text-align: center; font-style: italic; }
    @media print { body { margin: 20px; padding: 0; } }
  </style>
</head>
<body>
  <h1>${base}</h1>
  ${paragraphs.map((p, i) => `<p><span class="para-num">${i + 1}.</span>${p}</p>`).join("\n  ")}
  <footer>Edited with Gilded Voice Scribe · ${new Date().toLocaleDateString()}</footer>
  <script>window.onload = () => { window.print(); }<\/script>
</body>
</html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    playSuccess();
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    function playHover(): void {
      throw new Error("Function not implemented.");
    }
  };

  const displayTranscript =
    transcript +
    (interimTranscript ? (transcript ? " " : "") + interimTranscript : "");

  return (
    <div
      className={`relative min-h-screen emerald-gradient-bg flex flex-col items-center justify-center p-4 overflow-hidden transition-all duration-1000 ${isFocusMode ? "bg-black/80" : ""}`}
    >
      <MysticalBackground />
      <FloatingParticles />

      {/* Focus Mode Backdrop overlay */}
      <div
        className={`fixed inset-0 z-0 bg-background/60 backdrop-blur-sm pointer-events-none transition-opacity duration-1000 ${isFocusMode ? "opacity-100" : "opacity-0"}`}
      />

      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        onMouseEnter={() => playHover()}
        className="fixed top-6 right-6 z-40 p-3 rounded-full border border-primary/20 bg-background/40 backdrop-blur-md text-primary hover:bg-primary/10 transition-all duration-300 shadow-xl group"
      >
        <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
        {scribeLog.length > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-primary text-[10px] items-center justify-center text-background font-bold">
              {scribeLog.length}
            </span>
          </span>
        )}
      </button>

      <ScribeSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        scribeLog={scribeLog}
        paragraphs={paragraphs}
      />

      <AmbientPlayer />

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.txt"
        className="hidden"
      />

      <main
        className={`w-full max-w-4xl flex flex-col items-center mx-auto relative z-10 transition-all duration-1000 pt-8 sm:pt-12 ${
          isListening
            ? "scale-[1.02] filter drop-shadow-[0_0_30px_hsl(var(--gold)/0.15)]"
            : "scale-100"
        } ${isFocusMode ? "opacity-100" : ""} animate-fade-in`}
      >
        {/* Everything inside main stays visible in focus mode, but we can dim specific parts */}
        <div
          className={`transition-all duration-1000 flex flex-col items-center w-full ${isFocusMode ? "opacity-20 blur-[1px] grayscale-[0.5]" : "opacity-100 blur-0"}`}
        >
          <CyberHero fileName={fileName} paragraphsCount={paragraphs.length} />
        </div>

        {/* Upload + Export + Clear row */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 px-4 w-full">
          <UploadButton
            onUpload={handleUpload}
            hasFile={!!fileName}
            fileName={fileName}
          />

          {paragraphs.length > 0 && (
            <>
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
            </>
          )}
        </div>

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
          />
        </div>
      </main>

      {/* Mystical Footer */}
      <footer className="w-full mt-10 sm:mt-20 pb-10 flex flex-col items-center gap-4 animate-fade-in pointer-events-none px-4 text-center">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="w-12 sm:w-20 h-[1px] bg-gradient-to-r from-transparent to-primary" />
          <span className="font-heading text-[13px] sm:text-[15px] tracking-[0.5em] uppercase text-primary font-bold gold-text-glow">
            Hand-Crafted in Silence
          </span>
          <div className="w-12 sm:w-20 h-[1px] bg-gradient-to-l from-transparent to-primary" />
        </div>
        <p className="font-body text-[13px] sm:text-[15px] italic text-primary font-medium tracking-wide">
          The AI Voice Editor · MDXXVI
        </p>
      </footer>
    </div>
  );
};

export default Index;
