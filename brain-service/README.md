# NeuroSync Brain Service

A FastAPI microservice that wraps Meta FAIR's **TRIBE v2** brain encoding model.
It accepts a file URL, downloads the content, runs cortical activation prediction
across 20,484 fsaverage5 vertices, and returns structured JSON consumed by the
Next.js frontend.

---

## Quick start (mock mode — no GPU required)

```bash
cd brain-service

# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the service (mock mode on by default)
uvicorn main:app --reload --port 8000
```

The service is now running at **http://localhost:8000**.

Verify with:
```bash
curl http://localhost:8000/health
# {"status":"ok","mock":true,"model_path_exists":true}
```

---

## Mock mode vs. real inference

| Mode | `TRIBE_MOCK` | What happens |
|------|-------------|--------------|
| **Mock** (default) | `1` | Generates realistic synthetic fMRI-shaped activations in <3s. No GPU needed. UI looks identical to real inference. |
| **Real** | `0` | Downloads the file, runs TRIBE v2 forward pass. Requires GPU for practical speed (~20–120s depending on content length). |

Mock activations are **file-type aware**:
- **Video** → Visual cortex (V1/V2/V3, ventral stream) lights up
- **Audio** → Auditory cortex (A1, superior temporal sulcus) peaks
- **Text/PDF** → Language regions (Broca's area, VWFA) dominate
- **All types** → Amygdala peaks early (arousal onset), nucleus accumbens builds late (reward/resolution)

---

## Enabling real TRIBE v2 inference

### Step 1 — Install the tribev2 Python package

```bash
# TRIBE v2 source is not on PyPI — clone from Meta's repo
git clone https://github.com/facebookresearch/tribev2
cd tribev2
pip install -e ".[plotting]"
```

### Step 2 — Verify model weights exist

The model weights (709 MB) should already be at:
```
~/.cache/huggingface/hub/models--facebook--tribev2/
```

If not, they will be downloaded automatically on first inference (requires HuggingFace Hub access).

### Step 3 — Start with real inference

```bash
TRIBE_MOCK=0 uvicorn main:app --reload --port 8000
```

---

## API reference

### `POST /analyze`

Submit a file for brain encoding analysis. Returns immediately with a `job_id`;
results are computed in the background.

**Request body:**
```json
{
  "file_url":      "https://...",
  "file_type":     "video | audio | text | pdf",
  "project_id":    "uuid",
  "extraction_id": "uuid",
  "duration_hint": 30
}
```

**Headers:**
```
X-Brain-Secret: <BRAIN_SERVICE_SECRET>
```

**Response (202):**
```json
{"job_id": "abc123", "status": "running"}
```

---

### `GET /status/{job_id}`

Poll job status. When `status == "complete"`, the `result` field contains the
full cortical activation data.

**Response:**
```json
{
  "job_id": "abc123",
  "status": "complete",
  "result": {
    "mock": true,
    "n_timesteps": 15,
    "timestep_seconds": 2,
    "cortical_activations": [0.12, 0.34, "...20484 values"],
    "subcortical_activations": [0.05, "...8802 values"],
    "cortical_frames": [["..."], ["..."]],
    "roi_timeseries": {
      "amygdala": [0.3, 0.45, 0.5],
      "nucleus_accumbens": [0.1, 0.2, 0.38]
    },
    "trimodal_contributions": [{"r": 0.3, "g": 0.5, "b": 0.2}],
    "emotions": [
      {"roi": "amygdala", "emotion": "Fear / Emotional Arousal", "confidence": 0.82, "strength": 0.71}
    ],
    "encoding_scores": {"visual_early": 0.43, "amygdala": 0.38},
    "segments": [{"start": 0, "end": 2, "label": "Segment 1"}]
  }
}
```

---

### `GET /health`

Liveness check. Returns mock mode status and whether model weights exist on disk.

---

## Brain regions

| Key | Anatomical region | Emotion / cognitive state |
|-----|------------------|--------------------------|
| `visual_early` | V1, V2, V3 | Low-level visual processing |
| `visual_ventral` | V4, LOC, FFA, PPA | Face / scene recognition |
| `visual_dorsal` | V3A, V7, IPS | Spatial attention |
| `visual_mt` | MT+ | Motion-driven alertness |
| `multisensory_tpj` | TPJ, MTG | Empathy, social cognition |
| `auditory_early` | A1, Belt | Auditory attention |
| `auditory_assoc` | STS | Auditory association |
| `inferior_frontal` | Broca's area | Language engagement |
| `vwfa` | VWFA | Visual word / reading |
| `hippocampus` | Hippocampus | Episodic memory formation |
| `amygdala` | Amygdala | Fear, emotional arousal |
| `thalamus` | Thalamus | Sensory relay |
| `caudate` | Caudate | Reward / motivation |
| `putamen` | Putamen | Procedural learning |
| `nucleus_accumbens` | Nucleus Accumbens | Reward, pleasure |
| `pallidum` | Pallidum | Motor gating |
| `lateral_ventricle` | Lateral Ventricle | Reference (should be ~0) |

---

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `TRIBE_MOCK` | `1` | Set to `0` to enable real inference |
| `BRAIN_SERVICE_SECRET` | `dev-secret` | Shared secret checked in `X-Brain-Secret` header |

---

## Architecture

```
Next.js app
    │
    │  POST /analyze  {file_url, file_type, ...}
    │  Header: X-Brain-Secret
    ▼
FastAPI (brain-service/main.py)
    │
    ├─ Validates secret
    ├─ Creates background job (in-memory dict)
    └─ Background task:
           │
           ├─ MOCK_MODE=1: _mock_predict() → synthetic activations
           └─ MOCK_MODE=0: download file → TribeModel.predict() → real BOLD
                  │
                  ▼
           {cortical_activations, roi_timeseries, emotions, ...}
                  │
    Next.js polls GET /status/{job_id}
    When complete → stores results in Supabase neuro_analyses.results (JSONB)
    Frontend renders:
      - Three.js brain surface (vertex colors from cortical_activations)
      - ROI timeseries (Recharts LineChart)
      - Emotion panel (confidence cards)
      - Temporal frames (activation thumbnails)
      - Trimodal RGB map
      - Encoding score bar chart
```

---

## File structure

```
brain-service/
├── main.py          # FastAPI app — routes, job management, auth
├── tribe_runner.py  # TRIBE v2 wrapper — mock + real inference
├── generate_mesh.py # Generates public/brain/fsaverage5.json mesh
└── requirements.txt # Python dependencies
```
