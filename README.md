<div align="center">

```
 ██████╗  █████╗ ██████╗ ███████╗
██╔═══██╗██╔══██╗██╔══██╗██╔════╝
██║   ██║███████║██████╔╝███████╗
██║   ██║██╔══██║██╔══██╗╚════██║
╚██████╔╝██║  ██║██║  ██║███████║
 ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝
```

**Omnimodal Autonomous Research System**

*Upload documents, audio, and video — get a unified, cited, contradiction-aware research brief in minutes.*

![Status](https://img.shields.io/badge/status-complete-brightgreen)
![Milestone](https://img.shields.io/badge/milestone-5%20%2F%205-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

</div>

---

## For Everyone — What Is OARS?

> **You don't need to be technical to understand this. Read this section first.**

Imagine you're a journalist. You've received 60 leaked documents, 8 hours of recorded interviews, and hours of video footage — all about the same story. You need to find the key facts, build a timeline of what happened, and spot where different sources contradict each other. That work would normally take weeks.

**OARS does it in minutes.**

Here's how it works in plain English:

```
You upload your files  →  OARS reads and listens to everything  →  You get a research report
```

**What you upload:**
- 📄 Documents and PDFs (reports, contracts, case files, research papers)
- 🎙️ Audio recordings (interviews, meetings, lectures, podcasts)
- 🎬 Videos (press conferences, recorded sessions, footage)

**What you get back:**

| Output | What it means |
|--------|--------------|
| **Timeline** | Every event mentioned across all your files, sorted by date — one single chronology |
| **Key Findings** | The most important facts, each showing exactly which file it came from |
| **Contradiction Report** | Where two sources disagree — flagged automatically, side by side |
| **Executive Summary** | A concise overview of everything, written for a human reader |
| **Markdown Export** | Download the whole report as a file you can share or publish |

**Who is it for?**

- Journalists investigating complex stories
- Lawyers and law students working across many case files
- Policy analysts synthesising government reports
- PhD researchers doing literature reviews
- Students studying across lectures, readings, and notes
- Anyone drowning in information who needs answers

**The core promise:** Every claim in your report links back to the exact source and passage it came from. Nothing is made up. Everything is traceable.

---

## The Problem OARS Solves

Research is broken for anyone working with large volumes of mixed-media sources.

A journalist has 60 leaked documents and 8 hours of recordings. A law student is cross-referencing 20 case documents for an exam. A policy analyst is synthesising government reports with academic papers. In every case the process is identical: read everything manually, take notes, try to remember what said what, build a timeline by hand, and hope you didn't miss a contradiction buried on page 34 of document 17.

**That process is slow, error-prone, and doesn't scale. OARS fixes it.**

---

## What OARS Does — Feature Overview

```
 Upload ──► Extract ──► Aggregate ──► Report ──► Export
```

| Step | What happens |
|------|-------------|
| **1. Upload** | Drag and drop PDFs, audio, video, or text files into a project |
| **2. Extract** | Specialised AI agents read, listen to, or watch each file and pull out structured facts: entities, claims, events, dates, confidence scores |
| **3. Aggregate** | A second-layer AI merges all extractions into a single unified timeline, deduplicates events, and surfaces contradictions |
| **4. Report** | A third-layer AI writes an executive summary, formats key findings with citations, and builds a contradiction matrix |
| **5. Export** | Download the full report as Markdown, or view it in the browser |

---

## Real-World Use Cases

| Who | The problem | What OARS produces |
|-----|------------|-------------------|
| Investigative journalist | 60 leaked documents, 3 weeks to read | Timeline of events + contradiction report in 20 min |
| Law student | 25 case files, exam tomorrow | Entity map + key claims per case, sorted by theme |
| Policy analyst | 10 government reports + academic papers | Unified chronology + where reports disagree |
| PhD researcher | Literature review across 50 papers | Evidence map, conflicting claims, research gaps |
| Medical student | Lecture recordings + textbook chapters | Merged timeline of concepts, conflicting treatments flagged |
| Corporate investigator | Emails, contracts, interview transcripts | Chronological facts trail with provenance |

---

## How the AI Pipeline Works

OARS is built on a three-layer AI pipeline, inspired by Meta's TRIBE v2 tri-modal perception architecture:

```
┌────────────────────────────────────────────────────────────────┐
│                      PERCEPTION LAYER                          │
│   Runs in parallel — one agent per file                        │
│                                                                │
│   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐         │
│   │  Text Agent │   │ Audio Agent │   │ Vision Agent│         │
│   │             │   │             │   │             │         │
│   │  PDF · MD   │   │  MP3 · WAV  │   │  MP4 · IMG  │         │
│   │  TXT · DOCX │   │  M4A · OGG  │   │  MOV · JPG  │         │
│   └──────┬──────┘   └──────┬──────┘   └──────┬──────┘         │
│          └────────────────┬┘──────────────────┘               │
│                           │                                    │
│     Output per file: { entities, claims, events, dates,        │
│                        confidence, source_quotes }             │
├───────────────────────────┼────────────────────────────────────┤
│                  AGGREGATION LAYER                             │
│                           │                                    │
│             ┌─────────────▼──────────────┐                    │
│             │     Temporal Aggregator     │                    │
│             │                             │                    │
│             │  · merge events             │                    │
│             │  · deduplicate              │                    │
│             │  · detect contradictions    │                    │
│             │  · assign source badges     │                    │
│             └─────────────┬──────────────┘                    │
│                           │                                    │
│     Output: unified timeline + contradiction pairs             │
├───────────────────────────┼────────────────────────────────────┤
│                  TRANSLATION LAYER                             │
│                           │                                    │
│             ┌─────────────▼──────────────┐                    │
│             │       Report Agent          │                    │
│             │                             │                    │
│             │  · executive summary        │                    │
│             │  · key findings + citations │                    │
│             │  · contradiction matrix     │                    │
│             │  · methodology note         │                    │
│             └─────────────────────────────┘                   │
└────────────────────────────────────────────────────────────────┘
```

Each agent is independent. Adding support for a new file format means adding a new perception agent — nothing else changes.

---

## What's Built — Complete Feature List

### Core Pipeline
- [x] Text Agent — extracts entities, claims, events, and dates from PDFs and text files
- [x] Audio Agent — transcribes and extracts structured knowledge from audio recordings
- [x] Vision Agent — analyses video frames and images for visual + transcript evidence
- [x] Temporal Aggregator — merges all extractions into one timeline, detects contradictions
- [x] Report Agent — generates executive summary, key findings, contradiction matrix

### Infrastructure
- [x] File upload to Cloudflare R2 with presigned URLs (up to 500 MB per file)
- [x] Automatic modality detection from MIME type (text / audio / vision)
- [x] Background workers — processing happens asynchronously, UI polls for status
- [x] Job queue with status tracking (queued → running → done / failed)
- [x] Deduplication guard — re-uploading the same source is a no-op
- [x] Exponential backoff retry — all agent calls retry up to 3× on failure (2s → 4s → 8s)
- [x] Email notifications via Resend — notified when extraction and report are ready

### Data & Security
- [x] Supabase (PostgreSQL) with Row Level Security on every table
- [x] Clerk authentication — all `/dashboard` routes and API endpoints are protected
- [x] Service-role Supabase client used server-side only; every query scoped by `user_id`

### UI
- [x] Dashboard — project list, create project modal
- [x] Sources tab — file list, upload dialog, live status badges with confidence %
- [x] Timeline tab — merged chronological event list with source attribution and conflict indicators
- [x] Report tab — full report viewer with executive summary, findings, contradiction matrix
- [x] Export button — download full report as a `.md` file

### Testing
- [x] Playwright E2E tests — landing page, auth redirect guards, API 401 guards

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Next.js 16 (App Router) + TypeScript | Server components, API routes, file-based routing |
| Styling | Tailwind CSS 4 + Shadcn/ui | Utility-first, accessible components |
| Auth | Clerk | Drop-in auth with middleware protection |
| Database | Supabase (PostgreSQL) | Managed Postgres with RLS, free tier |
| Object Storage | Cloudflare R2 | S3-compatible, free egress, 10 GB free tier |
| AI — Multimodal | Google Gemini 2.5 Flash | Free tier: 15 req/min, handles text + audio + vision |
| Email | Resend | Transactional emails, 3,000/month free |
| E2E Testing | Playwright | Cross-browser, first-class Next.js support |
| Validation | Zod 4 | Schema-first, shared between agents and API routes |

> All AI work runs on free-tier APIs. No paid API keys required to develop and test.

---

## Milestones

| # | Milestone | Status |
|---|-----------|--------|
| 1 | Auth + Projects + File Upload | ✅ Complete |
| 2 | Text Extraction Pipeline | ✅ Complete |
| 3 | Timeline Aggregation | ✅ Complete |
| 4 | Audio + Vision Agents + Report Generation | ✅ Complete |
| 5 | Production Hardening (retry, email, export, tests) | ✅ Complete |

---

## Getting Started

### Prerequisites

- Node.js 20+
- Free accounts at: [Clerk](https://clerk.com) · [Supabase](https://supabase.com) · [Cloudflare](https://dash.cloudflare.com) · [Google AI Studio](https://aistudio.google.com)

### 1 — Clone and install

```bash
git clone https://github.com/mahanyasbaira/OARS.git
cd OARS
npm install
```

### 2 — Configure environment

```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in your keys. Every variable has a comment explaining where to get it — all from free-tier dashboards.

### 3 — Run database migrations

In your Supabase project → SQL Editor, run each file in order:

```
db/migrations/001_initial_schema.sql
db/migrations/002_extractions.sql
db/migrations/003_timeline.sql
db/migrations/004_reports.sql
```

### 4 — Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), sign up, create a project, and upload a file.

### 5 — Run E2E tests (optional)

```bash
npm run build && npm run start
# In a second terminal:
npm run test:e2e
```

---

## Project Structure

```
OARS/
├── src/
│   ├── agents/              # AI perception + synthesis agents
│   │   ├── text-agent.ts    # PDF and text extraction (Gemini)
│   │   ├── audio-agent.ts   # Audio transcription + extraction
│   │   ├── vision-agent.ts  # Video frame + image analysis
│   │   ├── aggregator-agent.ts  # Timeline merge + contradiction detection
│   │   └── report-agent.ts  # Report synthesis
│   │
│   ├── workers/             # Pipeline orchestration (called from API routes)
│   │   ├── extract-text.ts
│   │   ├── extract-multimodal.ts
│   │   ├── aggregate-timeline.ts
│   │   └── generate-report.ts
│   │
│   ├── app/
│   │   ├── api/             # API routes (projects, upload, timeline, report, export)
│   │   └── dashboard/       # UI pages (projects, timeline, report)
│   │
│   ├── components/          # React components (sources, timeline, report views)
│   ├── schemas/             # Zod schemas shared across agents and routes
│   ├── server/db/           # Supabase query helpers
│   └── lib/                 # Utilities (retry, email, R2 upload, Supabase clients)
│
├── db/migrations/           # SQL migration files (run in order)
├── tests/                   # Playwright E2E tests
└── docs/                    # Architecture notes, changelog, roadmap
```

---

## What Makes OARS Different

Most AI tools summarise one document at a time. OARS works across an entire corpus:

**Multi-source by design** — every extraction is tagged to its source file and passage, so citations are automatic and verifiable, not hallucinated.

**Contradiction-aware** — the aggregator doesn't just look for consensus. It actively looks for cases where Source A and Source B say different things about the same topic and puts them side by side.

**Chronology-first** — the primary output is a timeline, because most research questions are fundamentally about what happened when and in what order.

**Modality-agnostic** — the same pipeline handles text, audio, and video. All three perception agents emit the same structured schema, so the aggregator doesn't care what type of file a fact came from.

**Traceable, not generative** — OARS does not invent facts. Every claim in a report traces back to an exact source quote. If there's no quote, there's no claim.

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

<div align="center">

Built with [Next.js](https://nextjs.org) · [Supabase](https://supabase.com) · [Clerk](https://clerk.com) · [Gemini](https://aistudio.google.com) · [Cloudflare R2](https://developers.cloudflare.com/r2) · [Resend](https://resend.com)

</div>
