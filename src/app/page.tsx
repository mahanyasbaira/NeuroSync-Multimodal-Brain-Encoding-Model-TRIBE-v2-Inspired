import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function LandingPage() {
  const { userId } = await auth()
  if (userId) redirect('/dashboard')

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center text-center px-6 pt-24 pb-16 gap-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur-sm">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          Powered by Meta TRIBE v2 brain encoding model
        </div>

        <div className="max-w-3xl space-y-4">
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-tight">
            See what your{' '}
            <span
              className="text-primary"
              style={{
                textShadow: '0 0 40px hsla(24,95%,53%,0.4)',
              }}
            >
              brain
            </span>{' '}
            hears
          </h1>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-xl mx-auto">
            Upload any video, audio, or text. Predict which cortical regions activate and what that reveals about emotional content.
          </p>
        </div>

        <div className="flex gap-3 flex-wrap justify-center">
          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/85 hover:shadow-[0_0_20px_hsla(24,95%,53%,0.4)]"
          >
            Start for free
          </Link>
          <Link
            href="/sign-in"
            className="inline-flex items-center justify-center rounded-lg border border-border bg-card/60 backdrop-blur-sm px-6 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
          >
            Sign in
          </Link>
        </div>

        {/* Brain region pills */}
        <div className="flex flex-wrap gap-3 justify-center mt-2">
          <span className="flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-4 py-2 text-xs">
            <span className="text-base">🔴</span>
            <span className="text-muted-foreground">Amygdala</span>
            <span className="text-foreground/70">→ Fear / Emotional Arousal</span>
          </span>
          <span className="flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-4 py-2 text-xs">
            <span className="text-base">🟡</span>
            <span className="text-muted-foreground">Nucleus Accumbens</span>
            <span className="text-foreground/70">→ Reward / Pleasure</span>
          </span>
          <span className="flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-4 py-2 text-xs">
            <span className="text-base">🟢</span>
            <span className="text-muted-foreground">Hippocampus</span>
            <span className="text-foreground/70">→ Memory Formation</span>
          </span>
        </div>
      </section>

      {/* Feature cards */}
      <section className="px-6 pb-20 max-w-4xl mx-auto w-full">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm p-6 space-y-3">
            <div className="text-3xl">📁</div>
            <h3 className="font-semibold text-sm tracking-wide uppercase text-primary">Upload</h3>
            <p className="text-muted-foreground text-sm">
              Drop in any video, audio clip, or document. We handle the extraction automatically.
            </p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm p-6 space-y-3">
            <div className="text-3xl">⚡</div>
            <h3 className="font-semibold text-sm tracking-wide uppercase text-primary">Analyze</h3>
            <p className="text-muted-foreground text-sm">
              Meta TRIBE v2 predicts the fMRI BOLD response across 20,000+ cortical vertices in real time.
            </p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm p-6 space-y-3">
            <div className="text-3xl">🧠</div>
            <h3 className="font-semibold text-sm tracking-wide uppercase text-primary">Visualize</h3>
            <p className="text-muted-foreground text-sm">
              Explore interactive brain surface maps, region timeseries, and emotional state inference.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/40 px-6 py-4 text-center text-xs text-muted-foreground">
        Powered by Meta TRIBE v2 brain encoding model — predictions are computational, not clinical.
      </footer>
    </main>
  )
}
