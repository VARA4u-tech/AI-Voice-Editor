import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, Bot, User, Sparkles } from "lucide-react";
import { useSoundEffects } from "@/hooks/useSoundEffects";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface ChatWidgetProps {
  paragraphs: string[];
  onCommand: (command: string) => Promise<unknown>;
}

const ChatWidget = ({ paragraphs, onCommand }: ChatWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Greetings, Scribe. I am the Logic_Alchemy core. How can I assist your document session today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { playSuccess, playStart } = useSoundEffects();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      // Execute the command through the main handleCommand flow
      // which already includes regex + AI fallback
      const result = await onCommand(userMsg.text);

      let responseText = "Command processed. No specific output recorded.";

      if (result && typeof result === "object") {
        const res = result as Record<string, unknown>;
        if (
          res.scribeResponse &&
          typeof res.scribeResponse === "object" &&
          (res.scribeResponse as Record<string, unknown>).content
        ) {
          responseText = String(
            (res.scribeResponse as Record<string, unknown>).content,
          );
        } else if (typeof res.message === "string") {
          responseText = res.message;
        }
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "The neural link encountered an error during transmission.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
      playSuccess();
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start animate-fade-in">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[320px] sm:w-[380px] h-[450px] bg-slate-950/80 backdrop-blur-2xl border border-primary/20 rounded-lg shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Header */}
          <div className="p-4 border-b border-primary/10 bg-primary/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center border border-accent/40">
                  <Bot className="w-4 h-4 text-accent" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-950 animate-pulse" />
              </div>
              <div>
                <h3 className="text-[11px] font-tech tracking-[0.2em] text-primary uppercase">
                  Scribe_AI
                </h3>
                <p className="text-[9px] font-mono text-accent/60 uppercase">
                  Status: Core_Online
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/5 rounded-full transition-colors text-primary/40 hover:text-primary"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-sm text-[13px] font-body leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-accent/10 border border-accent/20 text-foreground/90 ml-4"
                      : "bg-white/5 border border-white/10 text-primary/90 mr-4"
                  } relative group`}
                >
                  {/* Decorative corner brackets for bot */}
                  {msg.sender === "bot" && (
                    <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-primary/40" />
                  )}
                  {msg.text}
                  <div
                    className={`mt-1 text-[8px] font-mono opacity-30 ${msg.sender === "user" ? "text-right" : "text-left"}`}
                  >
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/10 p-3 rounded-sm flex gap-1">
                  <div className="w-1 h-1 bg-primary/40 rounded-full animate-bounce" />
                  <div className="w-1 h-1 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1 h-1 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-primary/5 border-t border-primary/10">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Transmitting signal..."
                className="w-full bg-slate-900/50 border border-primary/20 rounded-md py-2 pl-3 pr-10 text-[12px] font-mono text-primary placeholder:text-primary/20 focus:outline-none focus:border-accent/40 transition-colors"
              />
              <button
                onClick={handleSend}
                className="absolute right-2 p-1.5 text-accent hover:text-primary transition-colors"
                title="Send Transmission"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) playStart();
        }}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl relative group ${
          isOpen
            ? "bg-accent/20 border border-accent/40 rotate-90"
            : "bg-slate-950 border border-primary/30 hover:border-accent hover:scale-110 active:scale-95"
        }`}
      >
        <div className="absolute inset-0 rounded-full bg-accent/5 animate-ping opacity-20 pointer-events-none" />
        {isOpen ? (
          <X className="w-6 h-6 text-primary" />
        ) : (
          <div className="relative">
            <MessageSquare className="w-6 h-6 text-primary group-hover:text-accent transition-colors" />
            <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-accent animate-pulse" />
          </div>
        )}

        {/* HUD Elements around button */}
        {!isOpen && (
          <div className="absolute inset-[-4px] border border-primary/10 rounded-full border-dashed animate-[spin_10s_linear_infinite]" />
        )}
      </button>
    </div>
  );
};

export default ChatWidget;
