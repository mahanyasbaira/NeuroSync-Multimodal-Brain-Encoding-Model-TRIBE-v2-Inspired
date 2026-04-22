import { auth } from '@clerk/nextjs/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getUserIdByClerkId } from '@/server/db/users'
import { getProjectById } from '@/server/db/projects'
import { getSourcesByProjectId } from '@/server/db/sources'
import { UploadDialog } from '@/components/sources/upload-dialog'
import { SourceList } from '@/components/sources/source-list'

export default async function ProjectPage({
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

  const sources = await getSourcesByProjectId(projectId)
  const readySources = sources.filter((s) => s.status === 'ready')

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link href="/dashboard" className="hover:text-foreground transition-colors">
              Analyses
            </Link>
            <span>/</span>
            <span>{project.name}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
          {project.description && (
            <p className="text-muted-foreground text-sm mt-1">{project.description}</p>
          )}
        </div>
        <UploadDialog projectId={project.id} />
      </div>

      {readySources.length > 0 && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 px-5 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-primary">
              {readySources.length} source{readySources.length !== 1 ? 's' : ''} ready for brain encoding
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Click Analyze on any source below, then view your results in the Neural tab.
            </p>
          </div>
          <Link
            href={`/dashboard/projects/${projectId}/neuro`}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/85 transition-all hover:shadow-[0_0_16px_hsla(24,95%,53%,0.35)]"
          >
            🧠 View Brain Results
          </Link>
        </div>
      )}

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

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Sources</h2>
          <span className="text-xs text-muted-foreground">
            {sources.length} file{sources.length !== 1 ? 's' : ''}
          </span>
        </div>

        {sources.length === 0 ? (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <p className="text-muted-foreground text-sm">No sources yet.</p>
            <p className="text-muted-foreground text-xs mt-1">
              Upload a PDF, audio file, or video to get started.
            </p>
          </div>
        ) : (
          <SourceList sources={sources} projectId={project.id} />
        )}
      </div>
    </div>
  )
}
