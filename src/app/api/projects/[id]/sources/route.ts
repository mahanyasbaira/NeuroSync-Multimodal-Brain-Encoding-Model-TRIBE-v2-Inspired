import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getProjectById } from '@/server/db/projects'
import { getSourcesByProjectId } from '@/server/db/sources'
import { getUserIdByClerkId } from '@/server/db/users'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params
  const { userId: clerkId } = await auth()
  if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = await getUserIdByClerkId(clerkId)
  if (!userId) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  // Verify ownership
  const project = await getProjectById(projectId, userId)
  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

  const sources = await getSourcesByProjectId(projectId)
  return NextResponse.json({ sources })
}
