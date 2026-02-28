import { Upload } from "lucide-react";

interface UploadButtonProps {
  onUpload: () => void;
  hasFile: boolean;
  fileName?: string;
}

const UploadButton = ({ onUpload, hasFile, fileName }: UploadButtonProps) => {
  return (
    <button
      onClick={onUpload}
      className="
        group flex items-center justify-center gap-3 px-6 sm:px-8 py-2.5 sm:py-3
        border border-primary/60 bg-transparent
        text-primary font-heading text-xs sm:text-sm tracking-[0.2em] uppercase
        transition-all duration-300 w-full sm:w-auto
        hover:border-primary hover:bg-primary/5
        gold-glow-hover cursor-pointer
      "
    >
      <Upload className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
      {hasFile ? (
        <span
          className="truncate max-w-[150px] sm:max-w-[180px] font-bold"
          title={fileName}
        >
          {fileName}
        </span>
      ) : (
        <span className="whitespace-nowrap font-bold tracking-[0.25em] gold-text-glow">
          Upload <span className="opacity-80 text-[11px] ml-1">PDF · TXT</span>
        </span>
      )}
    </button>
  );
};

export default UploadButton;
