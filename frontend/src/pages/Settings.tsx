import Layout from "@/components/Layout";
import {
  Settings,
  Volume2,
  Mic,
  Palette,
  Bell,
  Save,
  Globe,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSoundEffects } from "@/hooks/useSoundEffects";

const SystemSettings = () => {
  const { playClick, playSuccess } = useSoundEffects();
  const [volume, setVolume] = useState(65);
  const [ambience, setAmbience] = useState(40);
  const [language, setLanguage] = useState("en-US");
  const [options, setOptions] = useState([
    {
      id: "sensitivity",
      label: "High Sensitivity Mode",
      value: true,
      desc: "Increase detection range for whispered commands.",
    },
    {
      id: "synthesis",
      label: "Continuous Synthesis",
      value: false,
      desc: "AI will attempt to summarize document changes in real-time.",
    },
    {
      id: "autoscroll",
      label: "Auto-Scroll on Focus",
      value: true,
      desc: "Automatically center the document on the paragraph being edited.",
    },
  ]);

  useEffect(() => {
    const saved = localStorage.getItem("scribe_settings");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.volume !== undefined) setVolume(parsed.volume);
      if (parsed.ambience !== undefined) setAmbience(parsed.ambience);
      if (parsed.options) setOptions(parsed.options);
      if (parsed.language) setLanguage(parsed.language);
    }
  }, []);

  const toggleOption = (id: string) => {
    playClick();
    setOptions((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, value: !opt.value } : opt)),
    );
  };

  const handleSave = () => {
    playSuccess();
    localStorage.setItem(
      "scribe_settings",
      JSON.stringify({ volume, ambience, options, language }),
    );
    toast.success("Settings committed to neural core.");
  };

  return (
    <Layout title="Settings" subtitle="Control_Panel" icon={Settings}>
      <div className="space-y-10">
        <section className="space-y-6">
          <h3 className="flex items-center gap-2 font-tech text-xs text-primary tracking-widest uppercase pb-2 border-b border-primary/10">
            <Volume2 className="w-4 h-4 text-accent" />
            Audio_Configuration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="block text-[10px] font-mono text-primary/40 uppercase">
                System Volume ({volume}%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="w-full transition-all accent-accent bg-primary/10"
              />
            </div>
            <div className="space-y-4">
              <label className="block text-[10px] font-mono text-primary/40 uppercase">
                Ambience Saturation ({ambience}%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={ambience}
                onChange={(e) => setAmbience(parseInt(e.target.value))}
                className="w-full accent-primary bg-primary/10"
              />
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="flex items-center gap-2 font-tech text-xs text-primary tracking-widest uppercase pb-2 border-b border-primary/10">
            <Globe className="w-4 h-4 text-accent" />
            Language_Configuration
          </h3>
          <div className="space-y-4 max-w-md">
            <label className="block text-[10px] font-mono text-primary/40 uppercase">
              Transcription Language
            </label>
            <select
              value={language}
              onChange={(e) => {
                playClick();
                setLanguage(e.target.value);
              }}
              className="w-full bg-primary/5 border border-primary/20 p-3 text-sm text-foreground focus:outline-none focus:border-accent font-tech tracking-wider rounded-sm"
            >
              <option className="bg-slate-900 text-foreground" value="en-US">
                English (US)
              </option>
              <option className="bg-slate-900 text-foreground" value="en-GB">
                English (UK)
              </option>
              <option className="bg-slate-900 text-foreground" value="hi-IN">
                Hindi (India)
              </option>
              <option className="bg-slate-900 text-foreground" value="te-IN">
                Telugu (India)
              </option>
              <option className="bg-slate-900 text-foreground" value="es-ES">
                Spanish (Spain)
              </option>
              <option className="bg-slate-900 text-foreground" value="fr-FR">
                French (France)
              </option>
              <option className="bg-slate-900 text-foreground" value="de-DE">
                German (Germany)
              </option>
            </select>
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="flex items-center gap-2 font-tech text-xs text-primary tracking-widest uppercase pb-2 border-b border-primary/10">
            <Mic className="w-4 h-4 text-accent" />
            Voice_Engine_Options
          </h3>
          <div className="space-y-4">
            {options.map((option) => (
              <div
                key={option.id}
                className="flex justify-between items-start gap-8 p-4 border border-primary/5 bg-primary/5 rounded-sm"
              >
                <div>
                  <h4 className="font-tech text-[10px] text-primary tracking-widest uppercase mb-1">
                    {option.label}
                  </h4>
                  <p className="font-body text-[13px] text-foreground/60 italic">
                    {option.desc}
                  </p>
                </div>
                <button
                  onClick={() => toggleOption(option.id)}
                  className={`shrink-0 w-10 h-5 rounded-full relative transition-colors ${option.value ? "bg-accent/40" : "bg-primary/5 border border-primary/20"}`}
                >
                  <div
                    className={`absolute top-1 w-3 h-3 rounded-full transition-all ${option.value ? "right-1 bg-accent" : "left-1 bg-primary/40"}`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="flex items-center gap-2 font-tech text-xs text-primary tracking-widest uppercase pb-2 border-b border-primary/10">
            <Palette className="w-4 h-4 text-accent" />
            Aesthetic_Manifestation
          </h3>
          <div className="flex gap-4">
            <div
              className="w-10 h-10 rounded-sm border-2 border-accent bg-background cursor-pointer"
              title="Emerald Protocol"
            />
            <div
              className="w-10 h-10 rounded-sm border border-primary/20 bg-slate-900 cursor-pointer"
              title="Obsidian Core"
            />
            <div
              className="w-10 h-10 rounded-sm border border-primary/20 bg-blue-950 cursor-pointer"
              title="Deep Azure"
            />
          </div>
        </section>

        <div className="pt-8 flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-8 py-3 bg-accent/20 border border-accent/40 text-accent font-tech text-[11px] tracking-widest uppercase hover:bg-accent/30 transition-all group"
          >
            <Save className="w-4 h-4" />
            Commit_Changes
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default SystemSettings;
