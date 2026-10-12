# ParaQuest — The City Is Your Playground

A mobile-first, editorial web application crafted for the **DEV.to Hacktoberfest Week 1 2026 “Touch Grass” challenge**.

ParaQuest helps people reconnect with physical reality through bite-sized, mind-opening urban exploration quests with a bold, tactile **Neo-Brutalist** aesthetic.

---

## 🌿 The Core Loop

$$\text{Choose Your Time} \longrightarrow \text{Get 3 Quests} \longrightarrow \text{Pocket Phone} \longrightarrow \text{Explore} \longrightarrow \text{Record Discovery}$$

- **Zero Addictive Mechanics**: No streaks, no social leaderboards, no push notifications.
- **Strict Client-Side Privacy**: Journal entries, photos, and saved quests persist in the browser's **IndexedDB**.
- **Deterministic Safety**: Application code enforces that quests require zero trespassing, zero money spent, and zero hazard.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router with TypeScript in strict mode)
- **Styling**: Tailwind CSS with custom Neo-Brutalist tokens (deep ink borders, tactile drop shadows, forest green and ochre accents)
- **Icons**: Lucide React
- **Validation**: Zod runtime schemas
- **Persistence**: IndexedDB via `idb`
- **Inference**: Ollama (supports both local models like `gemma:2b` and cloud models like `gemma4:cloud`, plus verified Curated Demo Mode)
- **Unit Testing**: Vitest with `jsdom`

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Tests
```bash
npm test
```

### 3. Production Build
```bash
npm run build
```

### 4. Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view ParaQuest.

---

## ☁️ Deployment on Render

ParaQuest includes a pre-configured `render.yaml` Blueprint for one-click deployment on Render as a Node.js Web Service:

1. Push this repository to GitHub: `https://github.com/ezabhishek1/para-quest`.
2. In your [Render Dashboard](https://dashboard.render.com), click **New +** → **Blueprint**.
3. Select your repository `ezabhishek1/para-quest`.
4. Render will automatically detect `render.yaml`:
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Click **Apply**. Your app will be live with full dynamic App Router support!

*(Note: On cloud hosting, ParaQuest runs with high-fidelity Curated Demo Mode or connects to Ollama Cloud if you supply an `OLLAMA_API_KEY`.)*

---

## 🤖 Ollama Setup & Configuration

ParaQuest supports both **Local AI Models** and **Ollama Cloud Models**, alongside an instant **Curated Demo Mode**.

### Local Models (Offline & Free)
1. **Ollama CLI** is installed on your computer (`v0.40.3+`).
2. Pull a lightweight model suitable for your hardware (e.g. 4GB VRAM GPU):
   ```powershell
   ollama pull gemma:2b
   ```
3. Ensure the Ollama server is running:
   ```powershell
   ollama serve
   ```
4. ParaQuest connects to `http://127.0.0.1:11434` automatically.

### Ollama Cloud Models
For faster inference on larger models without downloading gigabytes of weights:
1. Sign in with the Ollama CLI:
   ```bash
   ollama signin
   ```
   Or generate an API key at [ollama.com/settings/keys](https://ollama.com/settings/keys).
2. Use cloud models like `gemma4:cloud` (included in free accounts).
3. If using an API key in environment variables:
   ```bash
   OLLAMA_API_KEY="your_api_key"
   ```

### Curated Demo Mode
If Ollama is not running, ParaQuest will gracefully notify you and offer to continue in **Demo Mode**, utilizing hand-crafted, high-fidelity urban quests without disguising output as AI-generated.

---

## 🧪 Architecture Overview

- `app/`
  - `page.tsx`: Quest creation hub and 3-card expedition display
  - `field/`: Distraction-free field mission view with elapsed outing timer
  - `journal/`: Field notebook archives with photo artifacts and saved quests
  - `journal/new/`: Discovery logging and reflection answers
  - `progress/`: Restrained exploration metrics & chronological timeline
  - `settings/`: Ollama connectivity diagnostics, privacy controls, JSON backup export, and local data purge
  - `api/quests/generate/`: Server-side API route for AI and demo quest generation
  - `api/ollama/status/`: Healthcheck API route for Ollama
- `lib/`
  - `ai/`: Ollama client with retry bounds, prompt templates, and demo catalog
  - `quests/`: Zod runtime schemas
  - `safety/`: Deterministic safety and duration validator
  - `storage/`: IndexedDB client with client-side image compression
- `tests/`: Vitest test suites for safety constraints, demo generator, and photo validation

---

## 🛡️ Privacy & Safety Guarantee

- **Zero GPS tracking**: No location permissions requested.
- **Zero data exfiltration**: Photos and journal notes are stored strictly inside your browser. No journal reflections are sent to any AI model.
- **Physical safety rules**: Checked before any quest is returned to the user.
