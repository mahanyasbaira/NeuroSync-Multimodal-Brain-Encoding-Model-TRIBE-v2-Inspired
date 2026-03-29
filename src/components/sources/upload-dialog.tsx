'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ACCEPTED_MIME_TYPES, MAX_FILE_SIZE_BYTES } from '@/lib/r2/upload'

type UploadState =
  | { status: 'idle' }
  | { status: 'selecting' }
  | { status: 'uploading'; progress: number; filename: string }
  | { status: 'error'; message: string }
  | { status: 'done' }

export function UploadDialog({ projectId }: { projectId: string }) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [state, setState] = useState<UploadState>({ status: 'idle' })

  function openPicker() {
    setState({ status: 'selecting' })
    fileInputRef.current?.click()
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) { setState({ status: 'idle' }); return }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setState({ status: 'error', message: 'File exceeds 500MB limit.' })
      return
    }
    if (!(ACCEPTED_MIME_TYPES as readonly string[]).includes(file.type)) {
      setState({ status: 'error', message: `Unsupported file type: ${file.type}` })
      return
    }

    setState({ status: 'uploading', progress: 0, filename: file.name })

    // Step 1: get presigned URL + create source record
    const presignRes = await fetch('/api/upload/presign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId,
        filename: file.name,
        mimeType: file.type,
        fileSize: file.size,
      }),
    })

    if (!presignRes.ok) {
      setState({ status: 'error', message: 'Failed to prepare upload. Please try again.' })
      return
    }

    const { presignedUrl, r2Key, sourceId } = await presignRes.json() as {
      presignedUrl: string
      r2Key: string
      sourceId: string
    }

    // Step 2: upload directly to R2 via presigned URL
    const uploadRes = await fetch(presignedUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
    })

    if (!uploadRes.ok) {
      setState({ status: 'error', message: 'Upload to storage failed. Please try again.' })
      return
    }

    setState({ status: 'uploading', progress: 90, filename: file.name })

    // Step 3: confirm upload — creates the upload record in Supabase
    const confirmRes = await fetch('/api/upload/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId,
        sourceId,
        r2Key,
        originalFilename: file.name,
        mimeType: file.type,
        fileSize: file.size,
      }),
    })

    if (!confirmRes.ok) {
      setState({ status: 'error', message: 'Failed to save upload record. Please try again.' })
      return
    }

    setState({ status: 'done' })
    router.refresh()

    // Reset after brief delay
    setTimeout(() => setState({ status: 'idle' }), 1500)
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_MIME_TYPES.join(',')}
        className="hidden"
        onChange={handleFileChange}
      />

      {state.status === 'idle' || state.status === 'selecting' ? (
        <Button onClick={openPicker}>Upload source</Button>
      ) : state.status === 'uploading' ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="animate-pulse">Uploading {state.filename}…</span>
        </div>
      ) : state.status === 'done' ? (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <span>Upload complete</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-sm text-destructive">{state.message}</span>
          <Button variant="outline" size="sm" onClick={() => setState({ status: 'idle' })}>
            Dismiss
          </Button>
        </div>
      )}
    </>
  )
}
