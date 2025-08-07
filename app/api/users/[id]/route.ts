import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

// In-memory storage (replace with real database in production)
const users: any[] = []
const posts: any[] = []

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({ error: 'No token provided' }, { status: 401 })
    }

    const user = users.find(u => u.id === params.id)
    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 })
    }

    // Get user's posts
    const userPosts = posts
      .filter(p => p.authorId === params.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // Return user without password
    const { password: _, ...userWithoutPassword } = user

    return Response.json({
      user: userWithoutPassword,
      posts: userPosts
    })
  } catch (error) {
    return Response.json({ error: 'Failed to fetch user profile' }, { status: 500 })
  }
}
