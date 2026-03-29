-- =============================================================================
-- OARS — Initial Schema (Migration 001)
-- Run this in Supabase SQL Editor: Project → SQL Editor → New query
-- =============================================================================

-- Enable pgvector extension (for embeddings in later milestones)
CREATE EXTENSION IF NOT EXISTS vector;

-- =============================================================================
-- USERS
-- Synced from Clerk via webhook (Milestone 2+)
-- Created on first sign-in via upsert in server code
-- =============================================================================
CREATE TABLE IF NOT EXISTS users (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id     TEXT UNIQUE NOT NULL,
  email        TEXT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- PROJECTS
-- Top-level container for all research work
-- =============================================================================
CREATE TABLE IF NOT EXISTS projects (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  description  TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS projects_user_id_idx ON projects(user_id);

-- =============================================================================
-- SOURCES
-- A single uploaded file or linked resource within a project
-- =============================================================================
CREATE TYPE source_modality AS ENUM ('text', 'audio', 'vision');
CREATE TYPE source_status   AS ENUM ('pending', 'processing', 'ready', 'failed');

CREATE TABLE IF NOT EXISTS sources (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  modality     source_modality NOT NULL,
  status       source_status NOT NULL DEFAULT 'pending',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sources_project_id_idx ON sources(project_id);
CREATE INDEX IF NOT EXISTS sources_status_idx     ON sources(status);

-- =============================================================================
-- UPLOADS
-- Raw file metadata — binary lives in Cloudflare R2
-- =============================================================================
CREATE TABLE IF NOT EXISTS uploads (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id         UUID NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
  r2_key            TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  mime_type         TEXT NOT NULL,
  file_size         BIGINT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS uploads_source_id_idx ON uploads(source_id);

-- =============================================================================
-- JOBS
-- Async job lifecycle tracking (used from Milestone 2 onwards)
-- =============================================================================
CREATE TYPE job_status AS ENUM ('queued', 'running', 'completed', 'failed', 'cancelled');

CREATE TABLE IF NOT EXISTS jobs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  source_id    UUID REFERENCES sources(id) ON DELETE SET NULL,
  type         TEXT NOT NULL,
  status       job_status NOT NULL DEFAULT 'queued',
  error        JSONB,
  metadata     JSONB,
  attempts     INT NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS jobs_project_id_idx ON jobs(project_id);
CREATE INDEX IF NOT EXISTS jobs_status_idx     ON jobs(status);

-- =============================================================================
-- ROW LEVEL SECURITY
-- Users can only access their own data
-- =============================================================================
ALTER TABLE users    ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE sources  ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploads  ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs     ENABLE ROW LEVEL SECURITY;

-- Users: can only read/update their own row
CREATE POLICY "users_select_own" ON users
  FOR SELECT USING (clerk_id = current_setting('app.clerk_id', true));

CREATE POLICY "users_insert_own" ON users
  FOR INSERT WITH CHECK (clerk_id = current_setting('app.clerk_id', true));

CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (clerk_id = current_setting('app.clerk_id', true));

-- Projects: scoped to user
CREATE POLICY "projects_select_own" ON projects
  FOR SELECT USING (
    user_id = (SELECT id FROM users WHERE clerk_id = current_setting('app.clerk_id', true))
  );

CREATE POLICY "projects_insert_own" ON projects
  FOR INSERT WITH CHECK (
    user_id = (SELECT id FROM users WHERE clerk_id = current_setting('app.clerk_id', true))
  );

CREATE POLICY "projects_update_own" ON projects
  FOR UPDATE USING (
    user_id = (SELECT id FROM users WHERE clerk_id = current_setting('app.clerk_id', true))
  );

CREATE POLICY "projects_delete_own" ON projects
  FOR DELETE USING (
    user_id = (SELECT id FROM users WHERE clerk_id = current_setting('app.clerk_id', true))
  );

-- Sources: scoped via project ownership
CREATE POLICY "sources_select_own" ON sources
  FOR SELECT USING (
    project_id IN (
      SELECT id FROM projects
      WHERE user_id = (SELECT id FROM users WHERE clerk_id = current_setting('app.clerk_id', true))
    )
  );

CREATE POLICY "sources_insert_own" ON sources
  FOR INSERT WITH CHECK (
    project_id IN (
      SELECT id FROM projects
      WHERE user_id = (SELECT id FROM users WHERE clerk_id = current_setting('app.clerk_id', true))
    )
  );

CREATE POLICY "sources_delete_own" ON sources
  FOR DELETE USING (
    project_id IN (
      SELECT id FROM projects
      WHERE user_id = (SELECT id FROM users WHERE clerk_id = current_setting('app.clerk_id', true))
    )
  );

-- Uploads: scoped via source → project ownership
CREATE POLICY "uploads_select_own" ON uploads
  FOR SELECT USING (
    source_id IN (
      SELECT s.id FROM sources s
      JOIN projects p ON p.id = s.project_id
      WHERE p.user_id = (SELECT id FROM users WHERE clerk_id = current_setting('app.clerk_id', true))
    )
  );

CREATE POLICY "uploads_insert_own" ON uploads
  FOR INSERT WITH CHECK (
    source_id IN (
      SELECT s.id FROM sources s
      JOIN projects p ON p.id = s.project_id
      WHERE p.user_id = (SELECT id FROM users WHERE clerk_id = current_setting('app.clerk_id', true))
    )
  );

-- Jobs: scoped via project ownership
CREATE POLICY "jobs_select_own" ON jobs
  FOR SELECT USING (
    project_id IN (
      SELECT id FROM projects
      WHERE user_id = (SELECT id FROM users WHERE clerk_id = current_setting('app.clerk_id', true))
    )
  );

CREATE POLICY "jobs_insert_own" ON jobs
  FOR INSERT WITH CHECK (
    project_id IN (
      SELECT id FROM projects
      WHERE user_id = (SELECT id FROM users WHERE clerk_id = current_setting('app.clerk_id', true))
    )
  );

-- =============================================================================
-- updated_at trigger
-- =============================================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
