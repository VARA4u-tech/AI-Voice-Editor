import { useState, useRef } from "react";
import FloatingParticles from "@/components/FloatingParticles";
import GoldDivider from "@/components/GoldDivider";
import MicButton from "@/components/MicButton";
import UploadButton from "@/components/UploadButton";
import StatusIndicator from "@/components/StatusIndicator";
import PreviewArea from "@/components/PreviewArea";
import GoldWaveform from "@/components/GoldWaveform";
import useSpeechRecognition from "@/hooks/useSpeechRecognition";
import logo from "@/assets/logo.png";

const Index = () => {
  const [fileName, setFileName] = useState("");
  const [fileLoaded, setFileLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    startListening,
    stopListening,
  } = useSpeechRecognition();

  const handleMicToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileLoaded(false);
      setTimeout(() => setFileLoaded(true), 300);
    }
  };

  const displayTranscript = transcript + (interimTranscript ? (transcript ? " " : "") + interimTranscript : "");

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
        {/* Hero Logo — Large & Centered like the reference image */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={logo}
            alt="All I See"
            className="w-56 h-56 sm:w-72 sm:h-72 object-contain drop-shadow-[0_0_40px_hsl(var(--gold)/0.2)]"
          />
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

        {/* Upload */}
        <div className={`transition-all duration-500 ${fileLoaded ? "animate-scale-in" : ""}`}>
          <UploadButton
            onUpload={handleUpload}
            hasFile={!!fileName}
            fileName={fileName}
          />
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
        </div>

        <GoldDivider />

        {/* Preview */}
        <div
          className={`w-full transition-all duration-700 ${
            displayTranscript || fileName
              ? "opacity-100 translate-y-0"
              : "opacity-70 translate-y-1"
          }`}
        >
          <PreviewArea hasFile={!!fileName} transcript={displayTranscript} />
        </div>

        {interimTranscript && (
          <p className="text-primary/40 font-body text-sm italic animate-pulse mt-2">
            Still listening...
          </p>
        )}
      </main>
    </div>
  );
};

export default Index;
