'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { ProtectedRoute } from '@/components/protected-route'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

interface Post {
  id: string
  content: string
  authorId: string
  authorName: string
  createdAt: string
}

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [newPost, setNewPost] = useState('')
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)
  const { user } = useAuth()

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/posts', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setPosts(data.posts || [])
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPost.trim()) return

    setPosting(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content: newPost })
      })

      if (res.ok) {
        setNewPost('')
        fetchPosts() // Refresh posts
      }
    } catch (error) {
      console.error('Failed to create post:', error)
    } finally {
      setPosting(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Create Post */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-lg font-semibold">What's on your mind?</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                placeholder="Share your thoughts..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                rows={3}
              />
              <Button type="submit" disabled={posting || !newPost.trim()}>
                {posting ? 'Posting...' : 'Post'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Posts Feed */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Recent Posts</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : posts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No posts yet. Be the first to share something!</p>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <Card key={post.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3">
                    <Avatar>
                      <AvatarFallback>
                        {post.authorName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Link 
                          href={`/profile/${post.authorId}`}
                          className="font-semibold hover:underline"
                        >
                          {post.authorName}
                        </Link>
                        <span className="text-gray-500 text-sm">
                          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-gray-900 whitespace-pre-wrap">{post.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
