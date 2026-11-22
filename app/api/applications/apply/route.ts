import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const backendUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL
    const body = await request.json()

    if (!backendUrl) {
      return NextResponse.json(
        { message: "Application backend is not configured. Set API_URL on Vercel." },
        { status: 503 },
      )
    }

    const authorization = request.headers.get("authorization")
    const headers: HeadersInit = { "Content-Type": "application/json" }
    if (authorization) {
      headers.Authorization = authorization
    }

    const response = await fetch(`${backendUrl.replace(/\/$/, "")}/api/applications/apply`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })
    const data = await response.json().catch(() => ({ message: "Failed to submit application" }))
    return NextResponse.json(data, { status: response.status })
  } catch {
    return NextResponse.json({ message: "Invalid application request" }, { status: 400 })
  }
}
