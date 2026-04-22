# NeuroSync — Multimodal Brain Encoding

![Status](https://img.shields.io/badge/status-active-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![Python](https://img.shields.io/badge/Python-3.11%2B-blue)
![License](https://img.shields.io/badge/license-MIT-green)

> Upload any video, audio, or text. Predict what your brain would do.

---

## For Everyone

You know how music gives you chills, or a horror movie makes your heart race? That's your brain responding to the content — different regions light up depending on what you're experiencing.

NeuroSync takes any video, podcast, or document you upload and predicts, using a state-of-the-art neuroscience model from Meta, exactly which parts of your cortex would activate if you were watching it in an fMRI scanner. Then it translates those brain patterns into plain-English emotional states.

No neuroscience background required. Just upload and explore.

---

## What It Tells You

| Brain Region | What It Means |
|---|---|
| Amygdala | Fear, emotional arousal, threat detection |
| Nucleus Accumbens | Reward, pleasure, anticipation |
| Hippocampus | Episodic memory formation |
| TPJ / MTG | Empathy, social cognition |
| Visual Cortex (FFA) | Face and scene recognition |
| Auditory Cortex | Auditory attention and processing |
| Broca's Area | Language engagement |
| Caudate + Putamen | Motivated engagement |

---

## Features

- **Brain surface heatmap** — 3D cortical mesh colored by predicted BOLD activation, one frame every 2 seconds
- **ROI timeseries** — Line chart of activation over time for every major brain region
- **Temporal frames** — Grid showing how activation propagates across the brain
- **Trimodal contribution map** — Which modality (text / audio / video) drives each region
- **Emotion inference panel** — Plain-English emotional states with confidence percentages
- **Encoding score bar chart** — How well the model predicts each region from your content

---

## Tech Stack

- **Frontend**: Next.js 16, TypeScript, Tailwind CSS 4, Shadcn/ui
- **Auth**: Clerk
- **Database**: Supabase (Postgres + RLS)
- **Storage**: Cloudflare R2
- **Brain model**: Meta TRIBE v2 (PyTorch, via FastAPI microservice)
- **Email**: Resend
- **Visualizations**: Three.js / React Three Fiber, Recharts

---

## Architecture

```
User Upload
    │
    ▼
Cloudflare R2 (file storage)
    │
    ▼
Next.js Extraction Pipeline
  ├── Text agent (Gemini 2.5 Flash)
  ├── Audio agent (w2v-bert)
  └── Vision agent (VJEPA2)
    │
    ▼
FastAPI Brain Service (brain-service/)
    │
    └── Meta TRIBE v2 inference
          ├── cortical_activations [20,484 vertices]
          ├── subcortical_activations [8,802 voxels]
          ├── roi_timeseries {region → float[]}
          └── trimodal_contributions {r, g, b}[]
    │
    ▼
Next.js Visualization Layer
  ├── BrainSurface (Three.js)
  ├── ROITimeseries (Recharts)
  ├── EmotionPanel
  ├── TemporalFrames
  └── TrimodalMap
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- Python 3.11+
- A Clerk account (free)
- A Supabase project (free)
- A Cloudflare R2 bucket (free tier)

### 1. Clone and install

```bash
git clone https://github.com/your-username/neurosync.git
cd neurosync
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
BRAIN_SERVICE_URL=http://localhost:8000
```

### 3. Database migrations

Run migrations in `db/migrations/` against your Supabase project in order (001 → 005).

### 4. Brain service setup

```bash
cd brain-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

By default the brain service runs in **mock mode** — it returns realistic fake activations so you can develop without the 700 MB TRIBE v2 model weights. To enable real inference:

```bash
# Install TRIBE v2 from your local cache
pip install -e ~/.cache/huggingface/hub/models--facebook--tribev2/snapshots/*/

# Set environment variable
TRIBE_MOCK=false uvicorn main:app --reload --port 8000
```

### 5. Start the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## How the Brain Service Works

The brain service (`brain-service/`) is a FastAPI app that:

1. Receives a signed R2 URL for the uploaded file
2. Downloads it locally for processing
3. Runs Meta TRIBE v2 inference (or returns mock data if `TRIBE_MOCK=true`)
4. Returns structured JSON with cortical activations, ROI timeseries, and trimodal contributions
5. Results are stored in Supabase `neuro_analyses` table for instant retrieval

**Important**: TRIBE v2 outputs predicted fMRI BOLD signals, not emotions. The emotion labels in NeuroSync are our interpretation layer — mapping region activations to known functional roles from the neuroscience literature. They are computational estimates, not clinical assessments.

---

## Running Tests

```bash
# E2E tests (Playwright)
npm run test:e2e

# TypeScript check
npx tsc --noEmit
```

---

## Screenshots

*Coming soon.*

---

## License

MIT

---

Built by Mahanyas Baira
