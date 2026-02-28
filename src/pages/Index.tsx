import { useState, useRef, useCallback } from "react";
import { Download } from "lucide-react";
import FloatingParticles from "@/components/FloatingParticles";
import GoldDivider from "@/components/GoldDivider";
import MicButton from "@/components/MicButton";
import UploadButton from "@/components/UploadButton";
import StatusIndicator from "@/components/StatusIndicator";
import PreviewArea from "@/components/PreviewArea";
import MoonPhaseAnimation from "@/components/MoonPhaseAnimation";
import GoldWaveform from "@/components/GoldWaveform";
import CommandHelp from "@/components/CommandHelp";
import useSpeechRecognition from "@/hooks/useSpeechRecognition";
import { parseDocument, type ParsedDocument } from "@/lib/documentParser";
import { processVoiceCommand } from "@/lib/voiceCommands";

const Index = () => {
  const [fileName, setFileName] = useState("");
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [history, setHistory] = useState<string[][]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [isParsing, setIsParsing] = useState(false);
  const [commandFeedback, setCommandFeedback] = useState<string | null>(null);
  const [commandSuccess, setCommandSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const clearFeedback = useCallback(() => {
    setTimeout(() => setCommandFeedback(null), 4000);
  }, []);

  const handleCommand = useCallback(
    (command: string) => {
      if (!paragraphs.length) {
        setCommandFeedback("Upload a document first before using voice commands.");
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
        setHistory((h) => [...h, paragraphs]);
        setParagraphs(result.updatedParagraphs);
      }

      clearFeedback();
    },
    [paragraphs, history, clearFeedback]
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
      setTimeout(() => {
        const cmd = transcript || "";
        if (cmd.trim()) {
          handleCommand(cmd.trim());
        }
      }, 300);
    } else {
      startListening();
    }
  }, [isListening, stopListening, startListening, transcript, handleCommand]);

  const handleUpload = () => {
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
      setCommandFeedback(`Loaded "${file.name}" — ${parsed.paragraphs.length} paragraphs found.`);
      setCommandSuccess(true);
      clearFeedback();
    } catch (err) {
      console.error("Parse error:", err);
      setCommandFeedback("Failed to parse document. Try a different file.");
      setCommandSuccess(false);
      clearFeedback();
    } finally {
      setIsParsing(false);
    }
  };

  const handleExport = () => {
    const content = paragraphs.join("\n\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const base = fileName ? fileName.replace(/\.[^.]+$/, "") : "document";
    a.download = `${base}-edited.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const displayTranscript =
    transcript + (interimTranscript ? (transcript ? " " : "") + interimTranscript : "");

  return (
    <div className="relative min-h-screen emerald-gradient-bg flex flex-col items-center justify-center p-4 overflow-hidden">
      <FloatingParticles />

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.txt"
        className="hidden"
      />

      <main className="relative z-10 flex flex-col items-center w-full max-w-xl animate-fade-in">
        {/* Moon Phase */}
        <MoonPhaseAnimation />

        {/* Decorative gold symbol instead of logo image */}
        <div className="my-6 flex flex-col items-center gap-1">
          <span className="text-primary/50 text-sm tracking-[0.4em]">✦ ✧ ✦</span>
          <span className="text-5xl drop-shadow-[0_0_20px_hsl(var(--gold)/0.3)]">☽</span>
          <span className="text-primary/50 text-sm tracking-[0.4em]">✦ ✧ ✦</span>
        </div>

        {/* Title */}
        <div className="text-center space-y-2 mb-6">
          <h1 className="font-heading text-2xl sm:text-3xl tracking-[0.2em] text-primary gold-text-glow uppercase">
            Voice PDF Editor
          </h1>
          <p className="font-body text-lg text-foreground/60 italic">
            Edit your documents with voice
          </p>
        </div>

        <GoldDivider />

        {/* Upload + Export row */}
        <div className="flex items-center gap-4">
          <UploadButton
            onUpload={handleUpload}
            hasFile={!!fileName}
            fileName={fileName}
          />

          {paragraphs.length > 0 && (
            <button
              onClick={handleExport}
              className="group flex items-center gap-2 px-6 py-3
                border border-primary/60 bg-transparent
                text-primary font-heading text-sm tracking-[0.2em] uppercase
                transition-all duration-300
                hover:border-primary hover:bg-primary/5
                gold-glow-hover cursor-pointer animate-fade-in"
            >
              <Download className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5" />
              Export
            </button>
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
          <StatusIndicator status={isListening ? "listening" : "idle"} />

          {displayTranscript && isListening && (
            <p className="font-body text-sm text-primary/60 italic text-center max-w-sm animate-fade-in">
              "{displayTranscript}"
            </p>
          )}
        </div>

        <CommandHelp />

        <GoldDivider />

        {/* Preview */}
        <PreviewArea
          paragraphs={paragraphs}
          isLoading={isParsing}
          pageCount={pageCount}
          commandFeedback={commandFeedback}
          commandSuccess={commandSuccess}
        />
      </main>
    </div>
  );
};

export default Index;
