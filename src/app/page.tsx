import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default async function LandingPage() {
  const { userId } = await auth()
  if (userId) redirect('/dashboard')

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <div className="text-center max-w-xl">
        <h1 className="text-4xl font-bold tracking-tight mb-3">OARS</h1>
        <p className="text-muted-foreground text-lg mb-2">Omnimodal Autonomous Research System</p>
        <p className="text-muted-foreground text-sm mb-8">
          Upload PDFs, audio, and video. Specialized agents extract structured findings,
          align them on a shared timeline, and generate source-grounded research reports.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/sign-up" className={cn(buttonVariants({ variant: 'default' }))}>
            Get started
          </Link>
          <Link href="/sign-in" className={cn(buttonVariants({ variant: 'outline' }))}>
            Sign in
          </Link>
        </div>
      </div>
    </main>
  )
}
