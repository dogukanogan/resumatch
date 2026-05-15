import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { cv_id } = await req.json()
  const res = await fetch(`http://localhost:8000/api/ai/match/${cv_id}`, { method: "POST" })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
