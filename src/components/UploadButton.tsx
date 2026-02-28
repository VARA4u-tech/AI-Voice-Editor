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
        group flex items-center gap-3 px-8 py-3
        border border-primary/60 bg-transparent
        text-primary font-heading text-sm tracking-[0.2em] uppercase
        transition-all duration-300
        hover:border-primary hover:bg-primary/5
        gold-glow-hover cursor-pointer
      "
    >
      <Upload className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
      {hasFile ? fileName : "Upload Document"}
    </button>
  );
};

export default UploadButton;
