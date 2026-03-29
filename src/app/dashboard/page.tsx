import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
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
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Each project holds your research sources and generated reports.
          </p>
        </div>
        <NewProjectForm />
      </div>

      {projects.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground text-sm">No projects yet.</p>
          <p className="text-muted-foreground text-xs mt-1">Create a project to start uploading sources.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
              <Card className="hover:border-foreground/30 transition-colors cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="text-base">{project.name}</CardTitle>
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
