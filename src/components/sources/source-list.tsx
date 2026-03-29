import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { SourceModality, SourceStatus } from '@/lib/supabase/types'

type Source = {
  id: string
  name: string
  modality: SourceModality
  status: SourceStatus
  created_at: string
  uploads: Array<{
    id: string
    original_filename: string
    mime_type: string
    file_size: number | null
  }>
}

const MODALITY_LABELS: Record<SourceModality, string> = {
  text: 'Text',
  audio: 'Audio',
  vision: 'Vision',
}

const STATUS_VARIANT: Record<SourceStatus, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  pending: 'outline',
  processing: 'secondary',
  ready: 'default',
  failed: 'destructive',
}

function formatBytes(bytes: number | null): string {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function SourceList({ sources }: { sources: Source[] }) {
  return (
    <div className="rounded-lg border divide-y">
      {sources.map((source) => {
        const upload = source.uploads?.[0]
        return (
          <div key={source.id} className="flex items-center justify-between px-4 py-3 gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{source.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {upload ? formatBytes(upload.file_size) : '—'} ·{' '}
                {new Date(source.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge variant="outline" className="text-xs">
                {MODALITY_LABELS[source.modality]}
              </Badge>
              <Badge variant={STATUS_VARIANT[source.status]} className="text-xs capitalize">
                {source.status}
              </Badge>
            </div>
          </div>
        )
      })}
    </div>
  )
}
