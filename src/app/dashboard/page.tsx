import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { getUserIdByClerkId, upsertUser } from '@/server/db/users'
import { getProjectsByUserId } from '@/server/db/projects'
import { NewProjectForm } from '@/components/projects/new-project-form'

export default async function DashboardPage() {
  const { userId: clerkId, sessionClaims } = await auth()
  if (!clerkId) return null

  const email = sessionClaims?.email as string ?? ''
  await upsertUser(clerkId, email)

  const userId = await getUserIdByClerkId(clerkId)
  const projects = userId ? await getProjectsByUserId(userId) : []

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Your Analyses</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Upload any content to see predicted brain activation patterns.
          </p>
        </div>
        <NewProjectForm />
      </div>

      {projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/60 p-12 text-center">
          <div className="text-4xl mb-3">🧠</div>
          <p className="text-muted-foreground text-sm">No analyses yet.</p>
          <p className="text-muted-foreground text-xs mt-1">
            Create a new analysis and upload a video, audio file, or document to begin.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link key={project.id} href={`/dashboard/projects/${project.id}/neuro`}>
              <Card className="hover:border-primary/40 transition-colors cursor-pointer h-full bg-card/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    🧠 {project.name}
                  </CardTitle>
                  {project.description && (
                    <CardDescription className="text-xs line-clamp-2">
                      {project.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    {new Date(project.updated_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
