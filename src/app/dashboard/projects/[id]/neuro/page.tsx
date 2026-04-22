import { auth } from '@clerk/nextjs/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getUserIdByClerkId } from '@/server/db/users'
import { getProjectById } from '@/server/db/projects'
import { getNeuroAnalysesByProject } from '@/server/db/neuro'
import { NeuroPanel } from '@/components/neuro/neuro-panel'

export default async function NeuroPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: projectId } = await params
  const { userId: clerkId } = await auth()
  if (!clerkId) return null

  const userId = await getUserIdByClerkId(clerkId)
  if (!userId) return null

  const project = await getProjectById(projectId, userId)
  if (!project) notFound()

  const analyses = await getNeuroAnalysesByProject(projectId, userId)

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <Link href="/dashboard" className="hover:text-foreground transition-colors">
            Analyses
          </Link>
          <span>/</span>
          <Link
            href={`/dashboard/projects/${projectId}`}
            className="hover:text-foreground transition-colors"
          >
            {project.name}
          </Link>
          <span>/</span>
          <span className="text-primary">Neural</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Brain Encoding Analysis</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Cortical activation predictions via Meta TRIBE v2 — {project.name}
        </p>
      </div>

      <div className="flex gap-4 border-b border-border pb-2">
        <Link
          href={`/dashboard/projects/${projectId}/neuro`}
          className="text-sm font-semibold text-primary border-b-2 border-primary pb-2 -mb-[9px] flex items-center gap-1"
        >
          🧠 Neural
        </Link>
        <Link
          href={`/dashboard/projects/${projectId}`}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors pb-2"
        >
          Sources
        </Link>
        <Link
          href={`/dashboard/projects/${projectId}/timeline`}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors pb-2"
        >
          Timeline
        </Link>
        <Link
          href={`/dashboard/projects/${projectId}/report`}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors pb-2"
        >
          Report
        </Link>
      </div>

      <NeuroPanel projectId={projectId} initialAnalyses={analyses} />
    </div>
  )
}
