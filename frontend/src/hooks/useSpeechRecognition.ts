import { useState, useRef, useCallback, useEffect } from "react";

interface UseSpeechRecognitionResult {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

// SpeechRecognitionErrorEvent is NOT reliably present in globalThis across all
// TypeScript versions, so we define a minimal local interface instead.
interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

interface SpeechRecognitionResultEvent extends Event {
  readonly resultIndex: number;
  readonly results: {
    readonly length: number;
    [index: number]: {
      readonly isFinal: boolean;
      readonly length: number;
      [index: number]: {
        readonly transcript: string;
      };
    };
  };
}

// Minimal interface describing the SpeechRecognition *instance* we use,
// so we don't depend on the global `SpeechRecognition` type which isn't
// reliably available in every TypeScript DOM lib version.
interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

// Constructor type for SpeechRecognition.
interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

interface WindowWithSpeechRecognition extends Window {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
}

const useSpeechRecognition = (): UseSpeechRecognitionResult => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const isSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  useEffect(() => {
    if (!isSupported) return;

    const w = window as WindowWithSpeechRecognition;
    const SpeechRecognition = w.SpeechRecognition || w.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    // Load preferred language from saved settings
    let preferredLang = "en-US";
    try {
      const savedSettings = localStorage.getItem("scribe_settings");
      if (savedSettings) {
        preferredLang = JSON.parse(savedSettings).language || "en-US";
      }
    } catch (e) {
      console.error("Failed to load language settings", e);
    }
    recognition.lang = preferredLang;

    recognition.onresult = (event: SpeechRecognitionResultEvent) => {
      let fullTranscript = "";
      let interim = "";

      // Rebuild the entire transcript from the beginning of the results list
      // this prevents the "duplicate word" issue common on mobile browsers
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          fullTranscript += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      setTranscript(fullTranscript.trim());
      setInterimTranscript(interim);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "aborted") return; // Ignore intentional aborts

      console.error("Speech recognition error:", event.error);
      if (event.error !== "no-speech") {
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript("");
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, [isSupported]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;

    try {
      setTranscript("");
      setInterimTranscript("");
      recognitionRef.current.start();
      setIsListening(true);
    } catch (e) {
      // If already started, just sync the state
      if (e instanceof Error && e.message.includes("already started")) {
        setIsListening(true);
      } else {
        console.error("Failed to start recognition:", e);
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;

    try {
      recognitionRef.current.stop();
      setIsListening(false);
    } catch (e) {
      console.error("Failed to stop recognition:", e);
      // Force state update regardless of error
      setIsListening(false);
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    setInterimTranscript("");
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  };
};

export default useSpeechRecognition;
