import { Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import { Mic, Pencil, Loader2, StopCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { DOMSerializer } from 'prosemirror-model';
import { processSelectionEditWithAI } from '../lib/aiService';
import { toast } from 'sonner';

export default function VoiceSelectionMenu({ editor }: { editor: Editor }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  // Preserve the selection range so we don't lose it if editor blurs
  const [selectionRange, setSelectionRange] = useState<{ from: number, to: number } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true; // allow pausing briefly
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        recognition.onerror = (e: any) => {
          console.error("Speech recognition error", e.error);
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }
  }, []);

  const getSelectedHtml = () => {
    const slice = editor.state.selection.content();
    const serializer = DOMSerializer.fromSchema(editor.schema);
    const div = document.createElement("div");
    div.appendChild(serializer.serializeFragment(slice.content));
    return div.innerHTML;
  };

  const startRecording = (e: React.MouseEvent) => {
    e.preventDefault(); // Keep editor focus and selection
    if (!recognitionRef.current) {
      toast.error("Speech recognition is not supported in this browser.");
      return;
    }
    
    // Save selection range before we start doing things
    setSelectionRange({
      from: editor.state.selection.from,
      to: editor.state.selection.to
    });
    
    setTranscript("");
    setIsRecording(true);
    try {
      recognitionRef.current.start();
    } catch (e) {
      console.warn("Recognition already started", e);
    }
  };

  const stopRecording = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isRecording) return;
    
    recognitionRef.current?.stop();
    setIsRecording(false);
    
    const finalTranscript = transcript.trim();
    if (!finalTranscript) {
      toast.info("No voice command detected.");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Re-apply the saved selection if we lost it
      if (selectionRange) {
        editor.commands.setTextSelection(selectionRange);
      }
      
      const selectedHtml = getSelectedHtml();
      if (!selectedHtml) {
        toast.error("No text selected.");
        setIsProcessing(false);
        return;
      }

      toast.info("Applying AI edit...");
      const newHtml = await processSelectionEditWithAI(selectedHtml, finalTranscript);
      
      // Replace selection with new HTML
      // insertContent automatically replaces the current selection
      editor.commands.insertContent(newHtml);
      toast.success("Edit applied successfully!");
    } catch (error: any) {
      console.error("Selection Edit Error", error);
      toast.error(error.message || "Failed to apply AI edit.");
    } finally {
      setIsProcessing(false);
      setTranscript("");
      setSelectionRange(null);
    }
  };

  if (!editor) return null;

  return (
    <BubbleMenu
      editor={editor}
      updateDelay={100}
      options={{ placement: 'top' }}
      className="flex items-center gap-1 overflow-hidden rounded-lg border border-primary/30 bg-background/95 p-1 shadow-2xl backdrop-blur-xl"
    >
      {isProcessing ? (
        <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-accent">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="font-tech tracking-wider uppercase">Editing...</span>
        </div>
      ) : isRecording ? (
        <div className="flex items-center gap-2 px-2 py-1">
          <button 
            onMouseDown={stopRecording}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors"
          >
            <StopCircle className="h-4 w-4 animate-pulse" />
          </button>
          <span className="max-w-[200px] truncate text-xs text-foreground/80 italic pr-2">
            "{transcript || "Listening..."}"
          </span>
        </div>
      ) : (
        <>
          <button
            onMouseDown={startRecording}
            className="flex items-center gap-2 rounded px-3 py-1.5 text-xs font-medium text-primary/80 transition-colors hover:bg-accent/20 hover:text-accent"
          >
            <Mic className="h-4 w-4" />
            Voice Edit
          </button>
          <div className="h-4 w-[1px] bg-primary/20" />
          <div className="flex items-center gap-2 rounded px-3 py-1.5 text-xs font-medium text-primary/50 cursor-default" title="Just start typing to manually edit the selection">
            <Pencil className="h-3.5 w-3.5" />
            Manual Edit
          </div>
        </>
      )}
    </BubbleMenu>
  );
}
