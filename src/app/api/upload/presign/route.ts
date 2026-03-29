import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { requestUploadUrlSchema } from '@/schemas/upload'
import { getPresignedUploadUrl, buildR2Key, inferModality } from '@/lib/r2/upload'
import { getProjectById } from '@/server/db/projects'
import { createSource } from '@/server/db/sources'
import { getUserIdByClerkId } from '@/server/db/users'

export async function POST(request: Request) {
  const { userId: clerkId } = await auth()
  if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = await getUserIdByClerkId(clerkId)
  if (!userId) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const body: unknown = await request.json()
  const parsed = requestUploadUrlSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { projectId, filename, mimeType, fileSize } = parsed.data

  // Verify project ownership before issuing upload URL
  const project = await getProjectById(projectId, userId)
  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

  const r2Key = buildR2Key(userId, projectId, filename)
  const modality = inferModality(mimeType)

  // Create source record before upload so we have an ID to return
  const source = await createSource(projectId, filename, modality)

  const presignedUrl = await getPresignedUploadUrl(r2Key, mimeType)

  return NextResponse.json({
    presignedUrl,
    r2Key,
    sourceId: source.id,
    fileSize,
  })
}
