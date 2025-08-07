import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

// In-memory storage (replace with real database in production)
const users: any[] = []

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Find user
    const user = users.find(u => u.email === email && u.password === password)
    if (!user) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Create JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })

    // Return user without password
    const { password: _, ...userWithoutPassword } = user

    return Response.json({
      token,
      user: userWithoutPassword
    })
  } catch (error) {
    return Response.json({ error: 'Login failed' }, { status: 500 })
  }
}
