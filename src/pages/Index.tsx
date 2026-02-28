import { useState, useRef, useCallback } from "react";
import FloatingParticles from "@/components/FloatingParticles";
import GoldDivider from "@/components/GoldDivider";
import MicButton from "@/components/MicButton";
import UploadButton from "@/components/UploadButton";
import StatusIndicator from "@/components/StatusIndicator";
import PreviewArea from "@/components/PreviewArea";
import logo from "@/assets/logo.png";

const Index = () => {
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState<"idle" | "listening" | "processing">("idle");
  const [fileName, setFileName] = useState("");
  const [transcript, setTranscript] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMicToggle = useCallback(() => {
    if (isListening) {
      setIsListening(false);
      setStatus("processing");
      setTimeout(() => {
        setTranscript("Replace paragraph two with the updated summary text.");
        setStatus("idle");
      }, 2000);
    } else {
      setIsListening(true);
      setStatus("listening");
      setTranscript("");
    }
  }, [isListening]);

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

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

      <main className="relative z-10 flex flex-col items-center gap-6 w-full max-w-xl animate-fade-in">
        {/* Logo */}
        <img
          src={logo}
          alt="All I See - Voice PDF Editor"
          className="w-28 h-28 object-contain mb-2 opacity-90"
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
        <UploadButton
          onUpload={handleUpload}
          hasFile={!!fileName}
          fileName={fileName}
        />

        {/* Mic */}
        <div className="flex flex-col items-center gap-4 my-4">
          <MicButton isListening={isListening} onClick={handleMicToggle} />
          <StatusIndicator status={status} />
        </div>

        <GoldDivider />

        {/* Preview */}
        <PreviewArea hasFile={!!fileName} transcript={transcript} />
      </main>
    </div>
  );
};

export default Index;
