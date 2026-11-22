import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, roll_number, email, password } = body

    if (
      typeof name !== "string" ||
      typeof roll_number !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return NextResponse.json({ message: "All registration fields are required" }, { status: 400 })
    }

    const backendUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL
    if (!backendUrl) {
      return NextResponse.json(
        { message: "Registration backend is not configured. Set API_URL on Vercel." },
        { status: 503 },
      )
    }

    try {
      const response = await fetch(`${backendUrl.replace(/\/$/, "")}/api/students/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, roll_number, email: email.trim().toLowerCase(), password }),
      })
      const data = await response.json().catch(() => ({ message: "Registration failed" }))
      return NextResponse.json(data, { status: response.status })
    } catch (error) {
      console.error("Registration backend request failed:", error)
      return NextResponse.json({ message: "Registration backend is unavailable" }, { status: 502 })
    }
  } catch {
    return NextResponse.json({ message: "Invalid registration request" }, { status: 400 })
  }
}
