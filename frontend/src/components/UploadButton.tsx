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
      className="font-tech group relative flex w-full cursor-pointer items-center justify-center gap-3 border border-primary/30 bg-primary/5 px-6 py-2.5 text-[10px] uppercase tracking-[0.25em] text-primary transition-all duration-300 hover:border-accent hover:bg-accent/5 hover:text-accent sm:w-auto sm:px-8 sm:py-3 sm:text-[11px]"
    >
      <div className="tech-bracket-tl h-1 w-1" />
      <div className="tech-bracket-br h-1 w-1" />

      <Upload className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
      {hasFile ? (
        <span
          className="max-w-[150px] truncate font-bold sm:max-w-[180px]"
          title={fileName}
        >
          {fileName}
        </span>
      ) : (
        <span className="whitespace-nowrap font-bold tracking-[0.25em]">
          Inject{" "}
          <span className="ml-1 text-[9px] opacity-60">
            DATA_STREAM [PDF·TXT]
          </span>
        </span>
      )}
    </button>
  );
};

export default UploadButton;
