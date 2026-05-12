"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface Experience {
  company?: string
  title?: string
  start_date?: string
  end_date?: string
  description?: string
}

interface Education {
  institution?: string
  degree?: string
  field?: string
  year?: string
}

interface Links {
  linkedin?: string
  github?: string
  portfolio?: string
  other?: string[]
}

interface ParsedCV {
  name?: string
  email?: string
  phone?: string
  location?: string
  summary?: string
  skills: string[]
  languages: string[]
  links?: Links
  experience: Experience[]
  education: Education[]
}

interface CVResult {
  filename: string
  parsed: ParsedCV
}

export default function DashboardPage() {
  const [cv, setCv] = useState<CVResult | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("cv_result")
    if (stored) setCv(JSON.parse(stored))
  }, [])

  if (!cv) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-10">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <p className="text-slate-400 mt-1">Your CV analysis and job matches</p>
            </div>
            <Link href="/upload" className={cn(buttonVariants(), "bg-indigo-600 hover:bg-indigo-500")}>
              Upload CV
            </Link>
          </div>
          <Card className="bg-slate-900 border-slate-700">
            <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
              <p className="text-slate-500">No CV uploaded yet.</p>
              <Link href="/upload" className={cn(buttonVariants({ variant: "outline" }), "border-slate-600 text-slate-300 hover:bg-slate-800")}>
                Upload your first CV
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const { parsed, filename } = cv

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">{parsed.name ?? "Your CV"}</h1>
            <p className="text-slate-400 mt-1">{filename}</p>
          </div>
          <Link href="/upload" className={cn(buttonVariants(), "bg-indigo-600 hover:bg-indigo-500")}>
            Upload New CV
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-slate-400 text-sm font-medium">Skills Found</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{parsed.skills.length}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-slate-400 text-sm font-medium">Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{parsed.experience.length}</p>
              <p className="text-slate-500 text-xs mt-1">positions</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-slate-400 text-sm font-medium">Education</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{parsed.education.length}</p>
              <p className="text-slate-500 text-xs mt-1">entries</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Contact */}
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-base">Contact Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {parsed.email && <p className="text-slate-300">📧 {parsed.email}</p>}
              {parsed.phone && <p className="text-slate-300">📞 {parsed.phone}</p>}
              {parsed.location && <p className="text-slate-300">📍 {parsed.location}</p>}
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-base">Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {parsed.skills.map((s) => (
                  <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Links */}
          {parsed.links && (parsed.links.linkedin || parsed.links.github || parsed.links.portfolio || parsed.links.other?.length) && (
            <Card className="bg-slate-900 border-slate-700 md:col-span-2">
              <CardHeader>
                <CardTitle className="text-white text-base">Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {parsed.links.linkedin && (
                    <a
                      href={parsed.links.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 border border-[#0A66C2]/30 text-[#5ba4f5] text-sm px-4 py-2 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      LinkedIn
                    </a>
                  )}
                  {parsed.links.github && (
                    <a
                      href={parsed.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 text-sm px-4 py-2 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                      </svg>
                      GitHub
                    </a>
                  )}
                  {parsed.links.portfolio && (
                    <a
                      href={parsed.links.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-indigo-900/20 hover:bg-indigo-900/30 border border-indigo-800/40 text-indigo-400 text-sm px-4 py-2 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                      </svg>
                      Portfolio
                    </a>
                  )}
                  {parsed.links.other?.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-400 text-sm px-4 py-2 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      {url.replace(/^https?:\/\//, "").split("/")[0]}
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Experience */}
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-base">Experience</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {parsed.experience.map((exp, i) => (
                <div key={i}>
                  {i > 0 && <Separator className="bg-slate-700 mb-4" />}
                  <p className="text-white font-medium">{exp.title}</p>
                  <p className="text-slate-400 text-sm">{exp.company}</p>
                  {(exp.start_date || exp.end_date) && (
                    <p className="text-slate-500 text-xs mt-1">
                      {exp.start_date} {exp.end_date ? `→ ${exp.end_date}` : "→ Present"}
                    </p>
                  )}
                  {exp.description && (
                    <p className="text-slate-400 text-xs mt-2 leading-relaxed">{exp.description}</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Education */}
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-base">Education</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {parsed.education.map((edu, i) => (
                <div key={i}>
                  {i > 0 && <Separator className="bg-slate-700 mb-4" />}
                  <p className="text-white font-medium">{edu.institution}</p>
                  <p className="text-slate-400 text-sm">
                    {[edu.degree, edu.field].filter(Boolean).join(" · ")}
                  </p>
                  {edu.year && <p className="text-slate-500 text-xs mt-1">{edu.year}</p>}
                </div>
              ))}
            </CardContent>
          </Card>

        </div>

        {/* Summary */}
        {parsed.summary && (
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-base">Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 text-sm leading-relaxed">{parsed.summary}</p>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  )
}
