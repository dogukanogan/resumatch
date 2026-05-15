"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { buttonVariants } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { cn } from "@/lib/utils"

const PRIORITY_STYLES: Record<string, string> = {
  high: "bg-red-950/40 border-red-800/40 text-red-400",
  medium: "bg-yellow-950/40 border-yellow-800/40 text-yellow-400",
  low: "bg-slate-800 border-slate-700 text-slate-400",
}

interface MissingSkill {
  skill: string
  priority: "high" | "medium" | "low"
  reason: string
  how_to_learn: string
}

interface SkillGapResult {
  match_percent: number
  strong_skills: string[]
  missing_skills: MissingSkill[]
  overall_advice: string
}

export default function SkillGapPage() {
  const [cvId, setCvId] = useState<string | null>(null)
  const [targetRole, setTargetRole] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SkillGapResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("cv_result")
    if (stored) {
      const data = JSON.parse(stored)
      setCvId(data.id ?? null)
    }
  }, [])

  const analyze = async () => {
    if (!cvId || !targetRole.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch("/api/skill-gap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cv_id: cvId, target_role: targetRole }),
      })
      const data = await res.json()
      setResult(data)
    } catch (e: any) {
      setError("Analysis failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Skill Gap Analysis</h1>
          <p className="text-slate-400 mt-1">Find out what you need to learn for your target role</p>
        </div>

        {!cvId ? (
          <Card className="bg-slate-900 border-slate-700">
            <CardContent className="flex flex-col items-center py-16 space-y-4">
              <p className="text-slate-500">Upload your CV first to run skill gap analysis.</p>
              <Link href="/upload" className={cn(buttonVariants(), "bg-indigo-600 hover:bg-indigo-500")}>
                Upload CV
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-base">Target Role</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-3">
              <Input
                placeholder="e.g. Senior Frontend Developer, ML Engineer, Product Manager..."
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && analyze()}
                className="bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-500"
              />
              <button
                onClick={analyze}
                disabled={loading || !targetRole.trim()}
                className={cn(buttonVariants(), "bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 shrink-0")}
              >
                {loading ? "Analyzing..." : "Analyze"}
              </button>
            </CardContent>
          </Card>
        )}

        {loading && (
          <div className="space-y-3">
            <p className="text-slate-400 text-sm text-center">AI is analyzing your profile...</p>
            <Progress value={null} className="h-1 animate-pulse" />
          </div>
        )}

        {error && (
          <p className="text-red-400 text-sm bg-red-950/30 border border-red-800 rounded-lg px-4 py-3">{error}</p>
        )}

        {result && (
          <div className="space-y-6">
            {/* Match score */}
            <Card className="bg-slate-900 border-slate-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-slate-300 font-medium">Readiness for <span className="text-indigo-400">{targetRole}</span></p>
                  <span className={`text-2xl font-bold ${result.match_percent >= 70 ? "text-emerald-400" : result.match_percent >= 40 ? "text-yellow-400" : "text-red-400"}`}>
                    {result.match_percent}%
                  </span>
                </div>
                <Progress value={result.match_percent} className="h-2" />
              </CardContent>
            </Card>

            {/* Overall advice */}
            {result.overall_advice && (
              <Card className="bg-indigo-950/20 border-indigo-800/30">
                <CardContent className="pt-6">
                  <p className="text-indigo-300 text-sm leading-relaxed">{result.overall_advice}</p>
                </CardContent>
              </Card>
            )}

            {/* Strong skills */}
            {result.strong_skills?.length > 0 && (
              <Card className="bg-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-base">✓ Your Strengths</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {result.strong_skills.map((s) => (
                      <Badge key={s} variant="outline" className="border-emerald-700 text-emerald-400 bg-emerald-950/20">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Missing skills */}
            {result.missing_skills?.length > 0 && (
              <Card className="bg-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-base">Skills to Learn</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {result.missing_skills.map((skill, i) => (
                    <div key={i} className={`rounded-lg border p-4 space-y-2 ${PRIORITY_STYLES[skill.priority]}`}>
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">{skill.skill}</p>
                        <Badge variant="outline" className={`text-xs capitalize ${PRIORITY_STYLES[skill.priority]}`}>
                          {skill.priority} priority
                        </Badge>
                      </div>
                      <p className="text-xs opacity-80">{skill.reason}</p>
                      {skill.how_to_learn && (
                        <p className="text-xs opacity-70">📚 {skill.how_to_learn}</p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
