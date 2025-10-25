import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect"

export async function POST(request: NextRequest) {
  try {
    // Get data from request body
    const body = await request.json()
    const { name, username, email, password } = body

    // Basic validation
    if (!name || !username || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    // Connect to database
    const { client, collection } = await dbConnect("users")

    try {
      // Check if user already exists
      const existingUser = await collection.findOne({
        $or: [{ email }, { username }]
      })

      if (existingUser) {
        if (existingUser.email === email) {
          return NextResponse.json(
            { error: "User with this email already exists" },
            { status: 400 }
          )
        }
        if (existingUser.username === username) {
          return NextResponse.json(
            { error: "Username is already taken" },
            { status: 400 }
          )
        }
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12)

      // Create new user
      const newUser = {
        name,
        username,
        email,
        hashedPassword,
        role: "user",
        avatar: null,
        isVerified: true,
        createdAt: new Date(),
      }

      // Save to database
      const result = await collection.insertOne(newUser)

      return NextResponse.json(
        { 
          message: "User created successfully",
          userId: result.insertedId.toString()
        },
        { status: 201 }
      )

    } finally {
      await client.close()
    }

  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}