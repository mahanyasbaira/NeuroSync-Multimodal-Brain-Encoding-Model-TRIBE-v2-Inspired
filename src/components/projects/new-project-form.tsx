'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createProjectSchema } from '@/schemas/project'

type FormState = { status: 'idle' } | { status: 'loading' } | { status: 'error'; message: string }

export function NewProjectForm() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [state, setState] = useState<FormState>({ status: 'idle' })

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState({ status: 'loading' })

    const formData = new FormData(e.currentTarget)
    const parsed = createProjectSchema.safeParse({
      name: formData.get('name'),
      description: formData.get('description') || undefined,
    })

    if (!parsed.success) {
      setState({ status: 'error', message: parsed.error.issues[0].message })
      return
    }

    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.data),
    })

    if (!res.ok) {
      setState({ status: 'error', message: 'Failed to create project. Please try again.' })
      return
    }

    const { project } = await res.json() as { project: { id: string } }
    setOpen(false)
    setState({ status: 'idle' })
    router.push(`/dashboard/projects/${project.id}`)
    router.refresh()
  }

  if (!open) {
    return <Button onClick={() => setOpen(true)}>New project</Button>
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background rounded-lg border shadow-lg w-full max-w-md p-6">
        <h2 className="font-semibold text-lg mb-4">New project</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" placeholder="e.g. Q4 Earnings Investigation" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Description <span className="text-muted-foreground">(optional)</span></Label>
            <Input id="description" name="description" placeholder="What is this research about?" />
          </div>
          {state.status === 'error' && (
            <p className="text-sm text-destructive">{state.message}</p>
          )}
          <div className="flex gap-2 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => { setOpen(false); setState({ status: 'idle' }) }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={state.status === 'loading'}>
              {state.status === 'loading' ? 'Creating…' : 'Create project'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
