"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { buttonVariants } from "@/components/ui/button"
import JobFiltersPanel from "@/components/jobs/JobFilters"
import { JobFilters, defaultFilters } from "@/lib/filters"
import Link from "next/link"
import { cn } from "@/lib/utils"

const WORK_MODE_COLORS: Record<string, string> = {
  remote: "bg-emerald-900/40 text-emerald-400 border-emerald-800",
  hybrid: "bg-blue-900/40 text-blue-400 border-blue-800",
  onsite: "bg-orange-900/40 text-orange-400 border-orange-800",
}

const EXPERIENCE_COLORS: Record<string, string> = {
  internship: "bg-purple-900/40 text-purple-400 border-purple-800",
  entry: "bg-sky-900/40 text-sky-400 border-sky-800",
  associate: "bg-teal-900/40 text-teal-400 border-teal-800",
  mid_senior: "bg-indigo-900/40 text-indigo-400 border-indigo-800",
  director: "bg-rose-900/40 text-rose-400 border-rose-800",
  executive: "bg-amber-900/40 text-amber-400 border-amber-800",
}

function scoreColor(score: number) {
  if (score >= 80) return "text-emerald-400"
  if (score >= 60) return "text-yellow-400"
  return "text-red-400"
}

function formatSalary(min: number | null, max: number | null) {
  if (!min && !max) return null
  if (min && max) return `$${(min / 1000).toFixed(0)}k – $${(max / 1000).toFixed(0)}k`
  if (min) return `From $${(min / 1000).toFixed(0)}k`
  return `Up to $${(max! / 1000).toFixed(0)}k`
}

function JobCard({ job }: { job: any }) {
  const salary = formatSalary(job.salary_min, job.salary_max)
  const location = [job.city, job.country].filter(Boolean).join(", ")

  return (
    <Card className="bg-slate-900 border-slate-700 hover:border-slate-500 transition-colors">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-0.5 min-w-0">
            <h3 className="text-white font-semibold truncate">{job.title}</h3>
            <p className="text-slate-400 text-sm">{job.company_name}</p>
            {location && <p className="text-slate-500 text-xs">{location}</p>}
          </div>
          <div className="shrink-0 flex flex-col items-end gap-0.5">
            <div className={`text-2xl font-bold ${scoreColor(job.match_score ?? 0)}`}>
              {job.match_score ?? "—"}%
            </div>
            <div className="text-xs text-slate-500">match</div>
          </div>
        </div>

        {job.match_reason && (
          <p className="text-slate-400 text-xs mt-3 leading-relaxed">{job.match_reason}</p>
        )}

        <div className="flex flex-wrap gap-2 mt-3">
          {job.work_mode && (
            <Badge variant="outline" className={`text-xs capitalize ${WORK_MODE_COLORS[job.work_mode] ?? ""}`}>
              {job.work_mode}
            </Badge>
          )}
          {job.experience_level && (
            <Badge variant="outline" className={`text-xs ${EXPERIENCE_COLORS[job.experience_level] ?? ""}`}>
              {job.experience_level.replace("_", "-")}
            </Badge>
          )}
          {job.job_type && (
            <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
              {job.job_type.replace("_", " ")}
            </Badge>
          )}
          {salary && (
            <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">{salary}</Badge>
          )}
        </div>

        {job.missing_skills?.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-slate-500 mb-1.5">Missing skills:</p>
            <div className="flex flex-wrap gap-1.5">
              {job.missing_skills.map((s: string) => (
                <span key={s} className="text-xs bg-red-950/40 border border-red-900/40 text-red-400 px-2 py-0.5 rounded">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function MatchesPage() {
  const [filters, setFilters] = useState<JobFilters>(defaultFilters)
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [matching, setMatching] = useState(false)
  const [cvId, setCvId] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("cv_result")
    if (stored) {
      const data = JSON.parse(stored)
      setCvId(data.id ?? null)
      if (data.id) loadMatches(data.id)
    }
  }, [])

  const loadMatches = async (id: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/matches?cv_id=${id}`)
      const data = await res.json()
      setJobs(data.matches ?? [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const runMatching = async () => {
    if (!cvId) return
    setMatching(true)
    try {
      const res = await fetch(`/api/match`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cv_id: cvId }),
      })
      const data = await res.json()
      setJobs(data.matches ?? [])
    } catch (e) {
      console.error(e)
    } finally {
      setMatching(false)
    }
  }

  const filtered = jobs.filter((job) => {
    if (filters.query && !job.title?.toLowerCase().includes(filters.query.toLowerCase())) return false
    if (filters.country && job.country?.toLowerCase() !== filters.country.toLowerCase()) return false
    if (filters.city && job.city?.toLowerCase() !== filters.city.toLowerCase()) return false
    if (filters.work_mode.length && !filters.work_mode.includes(job.work_mode)) return false
    if (filters.job_type.length && !filters.job_type.includes(job.job_type)) return false
    if (filters.experience_level.length && !filters.experience_level.includes(job.experience_level)) return false
    if (filters.salary_min && job.salary_max && job.salary_max < Number(filters.salary_min)) return false
    if (filters.salary_max && job.salary_min && job.salary_min > Number(filters.salary_max)) return false
    return true
  })

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Job Matches</h1>
            <p className="text-slate-400 mt-1">AI-scored matches based on your CV</p>
          </div>
          {cvId ? (
            <button
              onClick={runMatching}
              disabled={matching}
              className={cn(buttonVariants(), "bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50")}
            >
              {matching ? "Matching..." : "Run Matching"}
            </button>
          ) : (
            <Link href="/upload" className={cn(buttonVariants(), "bg-indigo-600 hover:bg-indigo-500")}>
              Upload CV First
            </Link>
          )}
        </div>

        <Input
          placeholder="Search by title or keyword..."
          value={filters.query}
          onChange={(e) => setFilters((f) => ({ ...f, query: e.target.value }))}
          className="bg-slate-900 border-slate-700 text-slate-200 placeholder:text-slate-500"
        />

        <div className="flex gap-8 items-start">
          <JobFiltersPanel filters={filters} onChange={setFilters} />

          <div className="flex-1 space-y-4">
            {loading ? (
              <div className="text-slate-500 text-sm py-20 text-center">Loading matches...</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 text-slate-500 space-y-3">
                <p>{cvId ? "No matches yet. Click \"Run Matching\" to find jobs." : "Upload your CV to see job matches."}</p>
              </div>
            ) : (
              <>
                <p className="text-slate-500 text-sm">{filtered.length} job{filtered.length !== 1 ? "s" : ""} found</p>
                {filtered.map((job) => <JobCard key={job.id} job={job} />)}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
