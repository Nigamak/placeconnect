import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password, role } = await request.json()

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      typeof role !== "string"
    ) {
      return NextResponse.json({ message: "Email, password, and role are required" }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const backendUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL
    if (!backendUrl) {
      return NextResponse.json({ message: "Authentication backend is not configured" }, { status: 503 })
    }

    try {
      const response = await fetch(`${backendUrl.replace(/\/$/, "")}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, password, role }),
      })
      const data = await response.json().catch(() => ({ message: "Authentication backend returned an invalid response" }))
      return NextResponse.json(data, { status: response.status })
    } catch (error) {
      console.error("Authentication backend request failed:", error)
      return NextResponse.json({ message: "Authentication backend is unavailable" }, { status: 502 })
    }
  } catch {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 })
  }
}
