# OARS — Changelog

All notable changes to OARS are recorded here.
Format: `[date] — description`

---

## [2026-03-28] — Milestone 1: Auth + Projects + File Upload

### Added
- Clerk auth: sign-in, sign-up, middleware protecting all `/dashboard` routes
- Supabase migration `001_initial_schema.sql`: `users`, `projects`, `sources`, `uploads`, `jobs` tables with full RLS
- File upload flow: presigned R2 URL → direct client upload → confirm record in Supabase
- API routes: `GET/POST /api/projects`, `GET /api/projects/[id]/sources`, `POST /api/upload/presign`, `POST /api/upload/confirm`
- Dashboard UI: project list, new project modal, project detail page with source list and status badges
- Modality auto-detection from MIME type (text / audio / vision)
- File validation: 500MB size limit, accepted MIME type allowlist
- Shadcn/ui component set: Button, Card, Input, Label, Badge, Separator, DropdownMenu, Avatar

### Architecture notes
- Service-role Supabase client used server-side only; every query scoped by explicit `user_id` filter
- Client-side Supabase client (anon key) reserved for future browser-side queries
- R2 presign → upload → confirm pattern prevents orphaned DB records if upload fails

## [2026-03-28] — Project initialization

- Next.js 16 scaffold with TypeScript, Tailwind CSS, App Router
- `.gitignore` protecting all secret files
- `.env.local.example` with free-tier setup guide for all services
- `docs/` folder: architecture, changelog, roadmap
- Directory scaffold: `agents/`, `schemas/`, `server/`, `db/migrations/`, `workers/`
