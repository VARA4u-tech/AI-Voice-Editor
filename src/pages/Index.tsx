import { useState, useRef, useCallback } from "react";
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
import logo from "@/assets/logo.png";

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

      // Handle undo specially
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

  // When user stops listening, process the command
  const handleMicToggle = useCallback(() => {
    if (isListening) {
      stopListening();
      // Process the transcript as a command after a brief delay
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

        {/* Logo */}
        <img
          src={logo}
          alt="All I See"
          className="w-56 h-56 sm:w-72 sm:h-72 object-contain drop-shadow-[0_0_40px_hsl(var(--gold)/0.2)]"
        />

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

        {/* Upload */}
        <UploadButton
          onUpload={handleUpload}
          hasFile={!!fileName}
          fileName={fileName}
        />

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

          {/* Live transcript while listening */}
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
