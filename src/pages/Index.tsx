import { useState, useRef } from "react";
import FloatingParticles from "@/components/FloatingParticles";
import GoldDivider from "@/components/GoldDivider";
import MicButton from "@/components/MicButton";
import UploadButton from "@/components/UploadButton";
import StatusIndicator from "@/components/StatusIndicator";
import PreviewArea from "@/components/PreviewArea";
import MoonPhaseAnimation from "@/components/MoonPhaseAnimation";
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

  const status = isListening ? "listening" : transcript ? "idle" : "idle";

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
      // Simulate load transition
      setTimeout(() => setFileLoaded(true), 300);
    }
  };

  const displayTranscript = transcript + (interimTranscript ? (transcript ? " " : "") + interimTranscript : "");

  return (
    <div className="relative min-h-screen emerald-gradient-bg flex items-center justify-center p-4 overflow-hidden">
      <FloatingParticles />

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.txt"
        className="hidden"
      />

      <main className="relative z-10 flex flex-col items-center gap-5 w-full max-w-xl animate-fade-in">
        {/* Moon Phase */}
        <MoonPhaseAnimation />

        {/* Logo */}
        <img
          src={logo}
          alt="All I See - Voice PDF Editor"
          className="w-28 h-28 object-contain opacity-90 transition-transform duration-700 hover:scale-105"
        />

        {/* Title */}
        <div className="text-center space-y-3">
          <h1 className="font-heading text-3xl sm:text-4xl tracking-[0.15em] text-primary gold-text-glow uppercase">
            Voice PDF Editor
          </h1>
          <p className="font-body text-xl text-foreground/70 italic">
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
          <p className="text-destructive/80 font-body text-sm italic">
            Speech recognition is not supported in this browser
          </p>
        )}

        {/* Mic + Waveform */}
        <div className="flex flex-col items-center gap-4 my-2">
          <MicButton isListening={isListening} onClick={handleMicToggle} />
          <GoldWaveform isActive={isListening} />
          <StatusIndicator status={isListening ? "listening" : status} />
        </div>

        <GoldDivider />

        {/* Preview with fade transition */}
        <div
          className={`w-full transition-all duration-700 ${
            displayTranscript || fileName
              ? "opacity-100 translate-y-0"
              : "opacity-70 translate-y-1"
          }`}
        >
          <PreviewArea hasFile={!!fileName} transcript={displayTranscript} />
        </div>

        {/* Interim indicator */}
        {interimTranscript && (
          <p className="text-primary/40 font-body text-sm italic animate-pulse">
            Still listening...
          </p>
        )}
      </main>
    </div>
  );
};

export default Index;
