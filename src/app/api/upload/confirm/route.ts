import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { confirmUploadSchema } from '@/schemas/upload'
import { createUpload } from '@/server/db/sources'
import { getProjectById } from '@/server/db/projects'
import { getUserIdByClerkId } from '@/server/db/users'

export async function POST(request: Request) {
  const { userId: clerkId } = await auth()
  if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = await getUserIdByClerkId(clerkId)
  if (!userId) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const body: unknown = await request.json()
  const parsed = confirmUploadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { projectId, sourceId, r2Key, originalFilename, mimeType, fileSize } = parsed.data

  // Verify project ownership
  const project = await getProjectById(projectId, userId)
  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

  const upload = await createUpload(sourceId, r2Key, originalFilename, mimeType, fileSize)

  return NextResponse.json({ uploadId: upload.id }, { status: 201 })
}
