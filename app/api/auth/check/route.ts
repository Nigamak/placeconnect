import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const backendUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL
  if (!backendUrl) {
    return NextResponse.json({ message: "Authentication backend is not configured" }, { status: 503 })
  }

  const authorization = request.headers.get("authorization")
  if (!authorization) {
    return NextResponse.json({ message: "Authentication required" }, { status: 401 })
  }

  try {
    const response = await fetch(`${backendUrl.replace(/\/$/, "")}/api/auth/check`, {
      headers: { Authorization: authorization },
    })
    const data = await response.json().catch(() => ({ message: "Authentication backend returned an invalid response" }))
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Authentication check request failed:", error)
    return NextResponse.json({ message: "Authentication backend is unavailable" }, { status: 502 })
  }
}
