import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const cv_id = req.nextUrl.searchParams.get("cv_id")
  const res = await fetch(`http://localhost:8000/api/ai/matches/${cv_id}`)
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
