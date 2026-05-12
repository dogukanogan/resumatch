"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export default function UploadPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const API_URL = "/api"

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped && (dropped.type === "application/pdf" || dropped.name.endsWith(".docx"))) {
      setFile(dropped)
    }
  }, [])

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    setProgress(20)
    setError(null)

    const formData = new FormData()
    formData.append("file", file)

    try {
      setProgress(50)
      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      })
      setProgress(90)
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.detail ?? `Server error: ${res.status}`)
      }
      const data = await res.json()
      setProgress(100)
      localStorage.setItem("cv_result", JSON.stringify(data))
      router.push("/dashboard")
    } catch (err: any) {
      console.error(err)
      setError(err.message ?? "Upload failed. Make sure the backend is running.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <Card className="w-full max-w-lg bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-2xl">Upload Your CV</CardTitle>
          <CardDescription className="text-slate-400">
            Supported formats: PDF, DOCX — max 10MB
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => document.getElementById("file-input")?.click()}
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
              dragOver ? "border-indigo-400 bg-indigo-950/30" : "border-slate-600 hover:border-slate-500"
            }`}
          >
            <input
              id="file-input"
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            {file ? (
              <div className="space-y-2">
                <Badge variant="secondary" className="text-sm">{file.name}</Badge>
                <p className="text-slate-400 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-slate-300 font-medium">Drop your CV here</p>
                <p className="text-slate-500 text-sm">or click to browse</p>
              </div>
            )}
          </div>

          {uploading && <Progress value={progress} className="h-2" />}

          {error && (
            <p className="text-red-400 text-sm bg-red-950/30 border border-red-800 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          <Button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
          >
            {uploading ? "Analyzing..." : "Upload & Analyze"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
