<div align="center">

# 🎙️ Gilded Voice Scribe
![FAVICON](https://github.com/user-attachments/assets/e7b5a78b-5f25-4d47-bd97-1d568d31b7d5)


### _AI-Powered Voice-Controlled PDF Editor_

[![Built with React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Auth-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![License](https://img.shields.io/badge/License-MIT-F59E0B?style=for-the-badge)](LICENSE)

> **Speak. Edit. Transform.** — A mystical, AI-driven document editor where your voice commands reshape text in real time. Upload a PDF, speak your intent, and watch the _Gilded Scribe_ bring your words to life.

[✨ Live Demo](#) · [🐛 Report Bug](https://github.com/VARA4u-tech/gilded-voice-scribe/issues) · [💡 Request Feature](https://github.com/VARA4u-tech/gilded-voice-scribe/issues)

---

</div>

## 📖 Table of Contents

- [🌟 Overview](#-overview)
- [🎯 Key Features](#-key-features)
- [🗣️ Voice Commands](#️-voice-commands)
- [🛠️ Tech Stack](#️-tech-stack)
- [⚡ Getting Started](#-getting-started)
- [📁 Project Structure](#-project-structure)
- [🔑 Environment Variables](#-environment-variables)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🌟 Overview

**Gilded Voice Scribe** is a next-gen, browser-based document editor that lets you control everything with your voice. Powered by **AI (via OpenRouter)** and the **Web Speech API**, it transforms spoken commands into precise document edits — from deleting paragraphs to translating text into any language.

The interface features a **mystical dark theme** with floating particles, golden accents, and smooth micro-animations — making the editing experience feel truly enchanting.

---

## 🎯 Key Features

<table>
<tr>
<td width="50%">

### 🎤 Voice-Controlled Editing

Speak naturally to edit documents. The Web Speech API captures your voice and the AI interprets your intent.

### 📄 PDF Upload & Parsing

Upload any PDF file and have it instantly parsed into editable paragraphs using `pdfjs-dist`.

### 🤖 AI-Powered Commands

Complex edits (summarize, translate, rewrite tone) are handled by an AI model via OpenRouter with smart caching and token optimization.

### 📝 Inline Text Editing

Click any paragraph to edit it directly. Full manual control alongside voice commands.

</td>
<td width="50%">

### 🌐 Multi-Language Translation

Translate any paragraph into dozens of languages with a single voice command — _"translate paragraph 1 to Telugu"_.

### 🎨 Voice-Driven Formatting

Apply **bold**, _italic_, <u>underline</u>, or ==highlight== formatting by voice.

### 🔍 Smart Search & Navigation

Find words, scroll to paragraphs, and navigate your document hands-free.

### 📊 Document Analytics

Get instant word counts, reading time estimates, paragraph stats, and AI-powered summaries.

</td>
</tr>
</table>

### ✨ More Features

| Feature                    | Description                                                |
| -------------------------- | ---------------------------------------------------------- |
| 🎵 **Ambient Soundscapes** | Focus mode with ambient audio for distraction-free editing |
| 🧠 **Smart Suggestions**   | AI-powered contextual suggestions while you edit           |
| 💬 **Chat Widget**         | Ask the Scribe questions about your document anytime       |
| 📖 **Onboarding Tutorial** | Interactive walkthrough for first-time users               |
| ⏱️ **Session Timer**       | Track your editing session duration                        |
| 💾 **Auto-Save**           | Sessions persist in local storage automatically            |
| 📥 **PDF Export**          | Export your edited document as a formatted PDF via `jsPDF` |
| 🔐 **Authentication**      | Supabase-powered auth with secure user sessions            |
| 📈 **Analytics Dashboard** | View usage statistics and editing history                  |
| 🛡️ **Security Panel**      | Manage security settings and access controls               |

---

## 🗣️ Voice Commands

> Just press the **microphone button** and speak any of these commands:

### ✏️ Editing Commands

| Command              | Example                                    | Description                        |
| -------------------- | ------------------------------------------ | ---------------------------------- |
| **Delete paragraph** | _"delete paragraph 3"_                     | Remove a specific paragraph        |
| **Replace word**     | _"replace hello with greetings"_           | Find & replace across the document |
| **Add after**        | _"add Once upon a time after paragraph 2"_ | Insert text after a paragraph      |
| **Add before**       | _"add In summary before paragraph 1"_      | Insert text before a paragraph     |
| **Swap paragraphs**  | _"swap paragraph 1 with 3"_                | Reorder paragraphs                 |
| **Undo**             | _"undo"_                                   | Revert the last change             |

### 🎨 Formatting Commands

| Command       | Example                   | Description                |
| ------------- | ------------------------- | -------------------------- |
| **Bold**      | _"bold paragraph 2"_      | Apply bold formatting      |
| **Italic**    | _"italic paragraph 1"_    | Apply italic formatting    |
| **Underline** | _"underline paragraph 3"_ | Apply underline formatting |
| **Highlight** | _"highlight paragraph 4"_ | Highlight a paragraph      |

### 🧠 AI-Powered Commands

| Command            | Example                                    | Description                                     |
| ------------------ | ------------------------------------------ | ----------------------------------------------- |
| **Summarize**      | _"summarize the document"_                 | Get an AI-generated summary                     |
| **Get stats**      | _"get stats for the document"_             | Word count, read time & more                    |
| **Translate**      | _"translate paragraph 1 to Telugu"_        | Translate to any language                       |
| **Rewrite tone**   | _"rewrite paragraph 2 to be professional"_ | Shift tone (professional/poetic/simple/shorter) |
| **Ask the Scribe** | _"ask Scribe: What is the main point?"_    | Document Q&A                                    |

### 🔍 Navigation Commands

| Command        | Example               | Description                     |
| -------------- | --------------------- | ------------------------------- |
| **Find**       | _"find student"_      | Search for a word or phrase     |
| **Go to**      | _"go to paragraph 5"_ | Scroll to a specific paragraph  |
| **Read aloud** | _"read paragraph 1"_  | Text-to-speech for a paragraph  |
| **Focus mode** | _"enter focus mode"_  | Toggle distraction-free editing |

---

## 🛠️ Tech Stack

<div align="center">

| Layer           | Technology                                   |
| --------------- | -------------------------------------------- |
| **Frontend**    | React 18, TypeScript, Vite                   |
| **Styling**     | Tailwind CSS, shadcn/ui, Radix UI Primitives |
| **AI Engine**   | OpenRouter API (StepFun Step-3.5 Flash)      |
| **Voice**       | Web Speech API (SpeechRecognition)           |
| **PDF Parsing** | pdfjs-dist                                   |
| **PDF Export**  | jsPDF                                        |
| **Auth & DB**   | Supabase                                     |
| **State**       | React Query, Local Storage                   |
| **Testing**     | Vitest, Testing Library                      |
| **Linting**     | ESLint, TypeScript ESLint                    |

</div>

---

## ⚡ Getting Started

### Prerequisites

- **Node.js** ≥ 18.x — [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **npm** ≥ 9.x (comes with Node.js)
- A modern browser with **Web Speech API** support (Chrome recommended)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/VARA4u-tech/gilded-voice-scribe.git

# 2. Navigate to the frontend directory
cd gilded-voice-scribe/frontend

# 3. Install dependencies
npm install

# 4. Create your environment file
cp .env.example .env
# Edit .env and add your API keys (see Environment Variables below)

# 5. Start the development server
npm run dev
```

The app will be running at **`http://localhost:8080`** 🚀

### Available Scripts

| Script               | Description                       |
| -------------------- | --------------------------------- |
| `npm run dev`        | Start development server with HMR |
| `npm run build`      | Build for production              |
| `npm run preview`    | Preview the production build      |
| `npm run lint`       | Run ESLint checks                 |
| `npm run test`       | Run tests with Vitest             |
| `npm run test:watch` | Run tests in watch mode           |

---

## 📁 Project Structure

```
gilded-voice-scribe/
└── frontend/
    ├── public/                  # Static assets
    ├── src/
    │   ├── components/          # React components
    │   │   ├── ui/              # shadcn/ui primitives (49 components)
    │   │   ├── CyberHero.tsx    # Landing hero section
    │   │   ├── MysticalBackground.tsx
    │   │   ├── PreviewArea.tsx  # Document preview & inline editing
    │   │   ├── ScribeSidebar.tsx # Navigation sidebar
    │   │   ├── ChatWidget.tsx   # AI chat assistant
    │   │   ├── SmartSuggestions.tsx
    │   │   ├── OnboardingTutorial.tsx
    │   │   ├── MicButton.tsx    # Voice toggle
    │   │   ├── AmbientPlayer.tsx # Focus mode audio
    │   │   └── ...
    │   ├── hooks/               # Custom React hooks
    │   │   ├── useSpeechRecognition.ts  # Web Speech API
    │   │   ├── useSoundEffects.ts       # Audio feedback
    │   │   ├── useSessionTimer.ts       # Session tracking
    │   │   └── useAuth.ts               # Auth state
    │   ├── lib/                 # Core utilities
    │   │   ├── voiceCommands.ts    # Voice command engine (15+ commands)
    │   │   ├── aiService.ts        # OpenRouter AI integration
    │   │   ├── tokenOptimizer.ts   # Caching, dedup & token savings
    │   │   ├── documentParser.ts   # PDF text extraction
    │   │   ├── pdfExport.ts        # PDF generation
    │   │   └── supabase.ts         # Supabase client
    │   ├── pages/               # Route pages
    │   │   ├── Index.tsx        # Main editor (core app)
    │   │   ├── History.tsx      # Session history
    │   │   ├── Analytics.tsx    # Usage analytics
    │   │   ├── Settings.tsx     # System settings
    │   │   ├── Security.tsx     # Security panel
    │   │   ├── Auth.tsx         # Login / Signup
    │   │   └── SystemInfo.tsx   # System information
    │   ├── App.tsx              # Route definitions
    │   └── main.tsx             # Entry point
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.ts
    └── tsconfig.json
```


> 💡 **Tip:** Get a free OpenRouter API key at [openrouter.ai](https://openrouter.ai) — the app uses the free `step-3.5-flash` model by default.

---

## 🚀 Deployment

### Build for Production

```bash
cd frontend
npm run build
```

The optimized output will be in the `dist/` folder, ready to deploy to any static hosting provider:

| Platform             | Deploy Command / Method            |
| -------------------- | ---------------------------------- |
| **Vercel**           | `npx vercel --prod`                |
| **Netlify**          | Drag & drop `dist/` or connect Git |
| **GitHub Pages**     | Use `gh-pages` package             |
| **Cloudflare Pages** | Connect your GitHub repo           |

> ⚠️ **Note:** Set your environment variables in your hosting provider's dashboard.

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit** your changes
   ```bash
   git commit -m "feat: add amazing feature"
   ```
4. **Push** to the branch
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open** a Pull Request

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix      | Usage                      |
| ----------- | -------------------------- |
| `feat:`     | New feature                |
| `fix:`      | Bug fix                    |
| `docs:`     | Documentation              |
| `style:`    | Formatting, no code change |
| `refactor:` | Code restructuring         |
| `test:`     | Adding tests               |
| `chore:`    | Maintenance                |

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

### 🌟 Star this repo if you found it useful!

**Built with ❤️ by [VARA4u-tech](https://github.com/VARA4u-tech)**

_"Speak your truth, and the Scribe shall write it in gold."_

</div>
