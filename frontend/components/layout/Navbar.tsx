"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const navLinks = [
  { href: "/upload", label: "Upload CV" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/matches", label: "Job Matches" },
  { href: "/skill-gap", label: "Skill Gap" },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-white font-bold text-lg tracking-tight shrink-0">
          re<span className="text-indigo-400">match</span>
        </Link>

        <div className="flex items-center gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm transition-colors",
                pathname === l.href
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {user ? (
            <>
              <span className="text-slate-500 text-xs hidden sm:block truncate max-w-[140px]">{user.email}</span>
              <button
                onClick={handleSignOut}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white")}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-slate-400 hover:text-white")}>
                Sign in
              </Link>
              <Link href="/register" className={cn(buttonVariants({ size: "sm" }), "bg-indigo-600 hover:bg-indigo-500")}>
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
