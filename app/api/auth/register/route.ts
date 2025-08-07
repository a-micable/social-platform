import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

// In-memory storage (replace with real database in production)
const users: any[] = []
let userIdCounter = 1

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Check if user already exists
    const existingUser = users.find(u => u.email === email)
    if (existingUser) {
      return Response.json({ error: 'User already exists' }, { status: 400 })
    }

    // Create new user
    const user = {
      id: userIdCounter.toString(),
      name,
      email,
      password, // In production, hash this password
      bio: '',
      createdAt: new Date().toISOString()
    }

    users.push(user)
    userIdCounter++

    // Create JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })

    // Return user without password
    const { password: _, ...userWithoutPassword } = user

    return Response.json({
      token,
      user: userWithoutPassword
    })
  } catch (error) {
    return Response.json({ error: 'Registration failed' }, { status: 500 })
  }
}
