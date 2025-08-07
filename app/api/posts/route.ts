import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

// In-memory storage (replace with real database in production)
const users: any[] = []
const posts: any[] = []
let postIdCounter = 1

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({ error: 'No token provided' }, { status: 401 })
    }

    // Return all posts with author information
    const postsWithAuthors = posts.map(post => {
      const author = users.find(u => u.id === post.authorId)
      return {
        ...post,
        authorName: author?.name || 'Unknown User'
      }
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return Response.json({ posts: postsWithAuthors })
  } catch (error) {
    return Response.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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

    const { content } = await request.json()
    
    if (!content || content.trim().length === 0) {
      return Response.json({ error: 'Content is required' }, { status: 400 })
    }

    // Create new post
    const post = {
      id: postIdCounter.toString(),
      content: content.trim(),
      authorId: user.id,
      createdAt: new Date().toISOString()
    }

    posts.push(post)
    postIdCounter++

    return Response.json({ post })
  } catch (error) {
    return Response.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
