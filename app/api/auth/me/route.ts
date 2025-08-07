import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

// In-memory storage (replace with real database in production)
const users: any[] = []

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({ error: 'No token provided' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    
    const user = users.find(u => u.id === decoded.userId)
    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 })
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user

    return Response.json({ user: userWithoutPassword })
  } catch (error) {
    return Response.json({ error: 'Invalid token' }, { status: 401 })
  }
}
