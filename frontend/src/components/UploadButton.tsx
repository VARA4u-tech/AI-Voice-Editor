import { Upload } from "lucide-react";
import { useSoundEffects } from "@/hooks/useSoundEffects";

interface UploadButtonProps {
  onUpload: () => void;
  hasFile: boolean;
  fileName?: string;
}

const UploadButton = ({ onUpload, hasFile, fileName }: UploadButtonProps) => {
  const { playHover } = useSoundEffects();

  return (
    <button
      onClick={onUpload}
      onMouseEnter={() => playHover()}
      className="
        group flex items-center justify-center gap-3 px-6 sm:px-8 py-2.5 sm:py-3
        border border-primary/30 bg-primary/5
        text-primary font-tech text-[10px] sm:text-[11px] tracking-[0.25em] uppercase
        transition-all duration-300 w-full sm:w-auto
        hover:border-accent hover:bg-accent/5 hover:text-accent
        relative cursor-pointer
      "
    >
      <div className="tech-bracket-tl w-1 h-1" />
      <div className="tech-bracket-br w-1 h-1" />

      <Upload className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
      {hasFile ? (
        <span
          className="truncate max-w-[150px] sm:max-w-[180px] font-bold"
          title={fileName}
        >
          {fileName}
        </span>
      ) : (
        <span className="whitespace-nowrap font-bold tracking-[0.25em]">
          Inject{" "}
          <span className="opacity-60 text-[9px] ml-1">
            DATA_STREAM [PDF·TXT]
          </span>
        </span>
      )}
    </button>
  );
};

export default UploadButton;
