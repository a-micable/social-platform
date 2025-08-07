import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

// In-memory storage (replace with real database in production)
const users: any[] = []

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({ error: 'No token provided' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    
    const userIndex = users.findIndex(u => u.id === decoded.userId)
    if (userIndex === -1) {
      return Response.json({ error: 'User not found' }, { status: 404 })
    }

    const { name, bio } = await request.json()
    
    // Update user
    users[userIndex] = {
      ...users[userIndex],
      name: name || users[userIndex].name,
      bio: bio !== undefined ? bio : users[userIndex].bio
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = users[userIndex]

    return Response.json({ user: userWithoutPassword })
  } catch (error) {
    return Response.json({ error: 'Profile update failed' }, { status: 500 })
  }
}
