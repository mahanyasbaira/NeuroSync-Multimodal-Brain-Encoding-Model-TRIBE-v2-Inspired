<div align="center">

# 🧠 NeuroSync

### Multimodal Brain Encoding — Powered by Meta TRIBE v2

*Upload any video, audio, or text. Predict which parts of the brain activate. Understand what that means emotionally.*

![Status](https://img.shields.io/badge/status-active-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![Python](https://img.shields.io/badge/Python-3.10+-blue)
![TRIBE v2](https://img.shields.io/badge/TRIBE_v2-Meta_FAIR-orange)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

</div>

---

## What Is NeuroSync?

NeuroSync takes any piece of media — a movie trailer, a podcast clip, a news article — and predicts the **fMRI brain response** a person would have while experiencing it.

It uses **TRIBE v2**, a brain encoding model published by Meta FAIR in March 2026, which was trained on real fMRI data from humans watching naturalistic stimuli. The model predicts activation across **20,484 cortical vertices** (the full outer surface of the brain) and **8,802 subcortical voxels** — covering every major brain region.

NeuroSync translates those predictions into something anyone can understand:

> 🔴 **Amygdala activated strongly** → Fear / Emotional Arousal  
> 🟡 **Nucleus Accumbens building** → Reward / Pleasure / Anticipation  
> 🟢 **Hippocampus engaged** → Memory formation  

---

## For Everyone — Plain English

You don't need to know neuroscience to use NeuroSync.

Think of it this way: scientists have measured what happens in real people's brains when they watch movies, listen to music, or read stories. TRIBE v2 learned those patterns. Now, for any new content you give it, it can predict: *"based on what we've seen in real brains, here's where and when this content would activate your brain — and here's what that likely means."*

**What you upload:**
- 🎬 Videos (trailers, ads, documentaries, lectures)
- 🎙️ Audio (music, podcasts, speeches, interviews)
- 📄 Text (articles, scripts, books, social posts)

**What you see:**
- A 3D brain that **lights up in real time** — colored orange-to-red where activation is strongest
- Which regions activated and **what emotion or cognitive state** that corresponds to
- A timeline showing **how activation changes second-by-second** through your content
- A breakdown of **which modality** (video vs. audio vs. text) is driving each region

---

## Brain Regions & Emotional Meanings

| Region | What it does | Emotional signal |
|--------|-------------|-----------------|
| **Amygdala** | Threat detection, emotional memory | 😨 Fear, arousal, urgency |
| **Nucleus Accumbens** | Dopamine reward circuit | 😊 Pleasure, reward, anticipation |
| **Hippocampus** | Episodic memory encoding | 🧩 Memory formation, recall |
| **TPJ / MTG** | Theory of mind, social processing | 🤝 Empathy, social cognition |
| **Visual Cortex (FFA/PPA)** | Face and scene recognition | 👁️ Recognition, familiarity |
| **Auditory Cortex (A1/STS)** | Sound processing | 👂 Auditory attention, speech |
| **Broca's Area** | Language production/reception | 💬 Language engagement |
| **Caudate + Putamen** | Habit, motivation, reward learning | ⚡ Motivated engagement |
| **Visual MT** | Motion processing | 🌀 Motion alertness, vigilance |
| **Thalamus** | Sensory relay hub | 📡 Sensory gating |

When multiple regions co-activate, NeuroSync combines their interpretations — e.g., Amygdala + Accumbens = *excited anticipation*.

---

## Features

### Core
- **3D Brain Surface Renderer** — interactive WebGL brain with hot colormap (gray → orange → red → white). Rotate, zoom, orbit. Animates frame-by-frame through your content.
- **ROI Timeseries** — line chart showing mean BOLD amplitude per region over time. See exactly when each emotion peaks.
- **Emotion Panel** — inferred emotional states with confidence %, strength value, and the anatomical region driving each state.
- **Temporal Activation Frames** — grid of brain snapshots at each 2-second timestep. Click any frame to inspect.
- **Trimodal Contribution Map** — RGB strip showing text (red), audio (green), video (blue) contribution to activation at each moment.
- **Encoding Score Chart** — bar chart showing how well the model predicts each brain region for your content (Pearson r).

### Pipeline
- Upload video/audio/text to Cloudflare R2 (up to 500 MB)
- Automatic modality detection from MIME type
- Background extraction (Gemini 2.5 Flash for text, audio, and video)
- Async brain encoding with status polling
- Results stored in Supabase, accessible instantly on return

### Infrastructure
- Clerk authentication — all routes protected
- Supabase PostgreSQL with Row Level Security
- Exponential backoff retry on all AI calls
- Playwright E2E tests for auth guards and API protection

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind CSS 4 |
| UI | Shadcn/ui, Three.js + @react-three/fiber, Recharts |
| Auth | Clerk |
| Database | Supabase (PostgreSQL + RLS) |
| Storage | Cloudflare R2 (S3-compatible) |
| Brain encoding | Meta TRIBE v2 (PyTorch, Python FastAPI microservice) |
| Extraction | Google Gemini 2.5 Flash |
| Email | Resend |
| Testing | Playwright |

---

## Architecture

```
User uploads file
       │
       ▼
Cloudflare R2 (object storage)
       │
       ▼
Gemini 2.5 Flash (text/audio/video extraction)
       │
       ▼
POST /api/projects/:id/neuro/analyze
       │
       ▼
FastAPI Brain Service (brain-service/)
       │
       ├── TRIBE_MOCK=1 (default)
       │     └── Synthetic fMRI-shaped activations in <3s
       │
       └── TRIBE_MOCK=0 (real inference)
             └── TribeModel.predict() → 20,484 vertex activations
       │
       ▼
Supabase (neuro_analyses table, JSONB results)
       │
       ▼
Next.js Neural Tab
       │
       ├── 🧠 Three.js Brain Surface (vertex colors)
       ├── 📈 ROI Timeseries (Recharts)
       ├── 💡 Emotion Panel (confidence cards)
       ├── 🎞️ Temporal Frames (timestep grid)
       ├── 🌈 Trimodal RGB Map
       └── 📊 Encoding Score Chart
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- Python 3.10+
- Free accounts: [Clerk](https://clerk.com) · [Supabase](https://supabase.com) · [Cloudflare R2](https://dash.cloudflare.com) · [Google AI Studio](https://aistudio.google.com)

### Option A — One command

```bash
git clone https://github.com/mahanyasbaira/NeuroSync-Multimodal-Brain-Encoding-Model-TRIBE-v2-Inspired.git neurosync
cd neurosync
chmod +x setup.sh && ./setup.sh
```

Then fill in `.env.local` and run the DB migrations.

### Option B — Manual

```bash
# 1. Clone and install
git clone https://github.com/mahanyasbaira/NeuroSync-Multimodal-Brain-Encoding-Model-TRIBE-v2-Inspired.git neurosync
cd neurosync
npm install

# 2. Configure environment
cp .env.local.example .env.local
# Edit .env.local with your Clerk, Supabase, R2, and Gemini credentials

# 3. Run database migrations (in Supabase SQL Editor, in order):
#    db/migrations/001_initial_schema.sql
#    db/migrations/002_extractions.sql
#    db/migrations/003_timeline.sql
#    db/migrations/004_reports.sql
#    db/migrations/005_neuro.sql

# 4. Start the brain service (mock mode — no GPU needed)
cd brain-service
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000 &
cd ..

# 5. Start Next.js
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Enabling Real TRIBE v2 Inference

By default, NeuroSync runs in **mock mode** — it generates realistic synthetic activations so you can use the full UI without a GPU. To enable real inference:

```bash
# Install the TRIBE v2 Python package (not on PyPI)
git clone https://github.com/facebookresearch/tribev2
cd tribev2
pip install -e ".[plotting]"

# Start brain service with real inference
TRIBE_MOCK=0 uvicorn main:app --reload --port 8000
```

**GPU note:** Real inference is practical on a GPU (~20–60s for a 5-minute video). On CPU it works but takes ~5–10 minutes. The model weights (709 MB) are loaded from `~/.cache/huggingface/hub/models--facebook--tribev2/`.

---

## Project Structure

```
NeuroSync/
├── brain-service/          # Python FastAPI — TRIBE v2 inference
│   ├── main.py             # API routes, job queue
│   ├── tribe_runner.py     # TRIBE v2 wrapper (mock + real)
│   └── generate_mesh.py    # Generates brain surface mesh
│
├── public/brain/           
│   └── fsaverage5.json     # 5124-vertex cortical surface mesh (296 KB)
│
├── src/
│   ├── app/
│   │   ├── page.tsx        # Landing page
│   │   ├── dashboard/      # Protected app pages
│   │   │   ├── page.tsx    # Analyses list
│   │   │   └── projects/[id]/
│   │   │       ├── page.tsx     # Sources + upload
│   │   │       └── neuro/       # Brain visualization (hero feature)
│   │   └── api/            # API routes
│   │
│   ├── components/neuro/   # All visualization components
│   │   ├── brain-surface.tsx      # Three.js WebGL renderer
│   │   ├── roi-timeseries.tsx     # Recharts line chart
│   │   ├── emotion-panel.tsx      # Emotion interpretation cards
│   │   ├── encoding-score-chart.tsx  # Bar chart
│   │   ├── temporal-frames.tsx    # Timestep thumbnail grid
│   │   ├── trimodal-map.tsx       # RGB contribution strip
│   │   └── neuro-panel.tsx        # Full tabbed panel (orchestrates all above)
│   │
│   ├── agents/             # AI extraction agents (Gemini)
│   ├── server/db/          # Supabase query helpers
│   └── lib/                # Utilities (retry, R2, email)
│
├── db/migrations/          # SQL files (run in Supabase in order)
├── tests/                  # Playwright E2E tests
├── setup.sh                # One-command setup script
└── .env.local.example      # Environment variable template
```

---

## How Emotions Are Inferred

NeuroSync does **not** ask TRIBE v2 "what emotion is this?" — TRIBE v2 only outputs BOLD signal predictions (how much each brain region activates). Emotions are a downstream interpretation layer:

1. For each timestep, extract mean activation per anatomical ROI
2. Compare to pre-defined thresholds from the neuroscience literature
3. ROIs above threshold emit their associated emotion label + confidence

This is the same mapping used in TRIBE v2's original paper (Figure 4 / Figure 9), aligned with decades of human neuroimaging research on naturalistic stimuli.

**Important:** These are computational predictions based on population-average fMRI data. They are scientifically grounded but not clinical measurements.

---

## Running Tests

```bash
# Build first, then run E2E
npm run build && npm run start

# In a second terminal:
npm run test:e2e
```

Tests cover: landing page rendering, auth redirect guards, API 401 guards on all neuro endpoints.

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

<div align="center">

Built by **Mahanyas Baira**

Powered by [Meta TRIBE v2](https://github.com/facebookresearch/tribev2) · [Next.js](https://nextjs.org) · [Supabase](https://supabase.com) · [Clerk](https://clerk.com) · [Three.js](https://threejs.org)

</div>
