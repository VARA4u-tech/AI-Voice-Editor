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
    recognition.continuous = false; // Non-continuous is much more stable on mobile
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
      let final = "";
      let interim = "";

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      if (final) {
        setTranscript(final.trim());
      }
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
      // Abort any existing session to clear stale mobile buffers
      recognitionRef.current.abort();

      setTranscript("");
      setInterimTranscript("");

      // Use a small timeout to let the browser process the abort
      setTimeout(() => {
        try {
          recognitionRef.current?.start();
          setIsListening(true);
        } catch (e) {
          console.error("Delayed start error:", e);
        }
      }, 50);
    } catch (e) {
      console.error("Failed to reset/start recognition:", e);
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
