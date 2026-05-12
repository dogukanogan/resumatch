import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-slate-400 mt-1">Your CV analysis and job matches</p>
          </div>
          <Link href="/upload" className={cn(buttonVariants(), "bg-indigo-600 hover:bg-indigo-500")}>
            Upload New CV
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "CV Score", value: "—", hint: "Upload a CV to get scored" },
            { label: "Job Matches", value: "—", hint: "Matches appear after upload" },
            { label: "Skills Found", value: "—", hint: "Extracted from your CV" },
          ].map((stat) => (
            <Card key={stat.label} className="bg-slate-900 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-slate-400 text-sm font-medium">{stat.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-slate-500 text-xs mt-1">{stat.hint}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Recent CV Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              <p className="text-slate-500">No CV uploaded yet.</p>
              <Link href="/upload" className={cn(buttonVariants({ variant: "outline" }), "border-slate-600 text-slate-300 hover:bg-slate-800")}>
                Upload your first CV
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
