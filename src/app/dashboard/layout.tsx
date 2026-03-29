import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b px-6 py-3 flex items-center justify-between">
        <span className="font-semibold tracking-tight">OARS</span>
        <UserButton />
      </header>
      <main className="flex-1 p-6 max-w-5xl mx-auto w-full">{children}</main>
    </div>
  )
}
