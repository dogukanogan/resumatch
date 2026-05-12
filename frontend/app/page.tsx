import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex flex-col items-center justify-center px-4">
      <div className="max-w-3xl w-full text-center space-y-8">
        <div className="space-y-4">
          <Badge variant="secondary" className="text-sm px-4 py-1">
            AI-Powered Career Matching
          </Badge>
          <h1 className="text-5xl font-bold text-white tracking-tight">
            Find your perfect job <br />
            <span className="text-indigo-400">with AI precision</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Upload your CV, let AI parse and analyze it, then get matched with the best opportunities — with skill gap insights and LinkedIn alignment score.
          </p>
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/upload" className={cn(buttonVariants({ size: "lg" }), "bg-indigo-600 hover:bg-indigo-500")}>
            Upload Your CV
          </Link>
          <Link href="/dashboard" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "border-slate-600 text-slate-300 hover:bg-slate-800")}>
            View Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-6 pt-8 text-center">
          {[
            { label: "CV Parsing", desc: "Extracts skills, experience & education automatically" },
            { label: "Smart Matching", desc: "Semantic matching beyond simple keyword search" },
            { label: "Skill Gap Analysis", desc: "Know exactly what to learn for your target role" },
          ].map((f) => (
            <div key={f.label} className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
              <h3 className="text-white font-semibold mb-2">{f.label}</h3>
              <p className="text-slate-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
