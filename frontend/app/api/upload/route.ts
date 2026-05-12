import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const formData = await req.formData()

  const backendRes = await fetch("http://localhost:8000/api/cv/upload", {
    method: "POST",
    body: formData,
  })

  const data = await backendRes.json()

  return NextResponse.json(data, { status: backendRes.status })
}
