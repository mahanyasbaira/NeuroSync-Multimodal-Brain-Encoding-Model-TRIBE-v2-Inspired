import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createProjectSchema } from '@/schemas/project'
import { createProject, getProjectsByUserId } from '@/server/db/projects'
import { getUserIdByClerkId, upsertUser } from '@/server/db/users'

export async function GET() {
  const { userId: clerkId, sessionClaims } = await auth()
  if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const email = sessionClaims?.email as string ?? ''
  await upsertUser(clerkId, email)

  const userId = await getUserIdByClerkId(clerkId)
  if (!userId) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const projects = await getProjectsByUserId(userId)
  return NextResponse.json({ projects })
}

export async function POST(request: Request) {
  const { userId: clerkId, sessionClaims } = await auth()
  if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const email = sessionClaims?.email as string ?? ''
  await upsertUser(clerkId, email)

  const userId = await getUserIdByClerkId(clerkId)
  if (!userId) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const body: unknown = await request.json()
  const parsed = createProjectSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const project = await createProject(userId, parsed.data)
  return NextResponse.json({ project }, { status: 201 })
}
