// Database type definitions — keep in sync with db/migrations/001_initial_schema.sql
// These are hand-written until we add Supabase CLI type generation in a later milestone.

export type SourceModality = 'text' | 'audio' | 'vision'
export type SourceStatus = 'pending' | 'processing' | 'ready' | 'failed'
export type JobStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          clerk_id: string
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          clerk_id: string
          email: string
          created_at?: string
        }
        Update: {
          email?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          description?: string | null
          updated_at?: string
        }
      }
      sources: {
        Row: {
          id: string
          project_id: string
          name: string
          modality: SourceModality
          status: SourceStatus
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          modality: SourceModality
          status?: SourceStatus
          created_at?: string
        }
        Update: {
          status?: SourceStatus
        }
      }
      uploads: {
        Row: {
          id: string
          source_id: string
          r2_key: string
          original_filename: string
          mime_type: string
          file_size: number | null
          created_at: string
        }
        Insert: {
          id?: string
          source_id: string
          r2_key: string
          original_filename: string
          mime_type: string
          file_size?: number | null
          created_at?: string
        }
        Update: Record<string, never>
      }
      jobs: {
        Row: {
          id: string
          project_id: string
          source_id: string | null
          type: string
          status: JobStatus
          error: Record<string, unknown> | null
          metadata: Record<string, unknown> | null
          attempts: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          source_id?: string | null
          type: string
          status?: JobStatus
          error?: Record<string, unknown> | null
          metadata?: Record<string, unknown> | null
          attempts?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          status?: JobStatus
          error?: Record<string, unknown> | null
          metadata?: Record<string, unknown> | null
          attempts?: number
          updated_at?: string
        }
      }
    }
    Functions: {
      set_config: {
        Args: { setting: string; value: string; is_local: boolean }
        Returns: void
      }
    }
  }
}
