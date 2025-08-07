'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { ProtectedRoute } from '@/components/protected-route'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'
import { Edit, Save, X } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  bio?: string
}

interface Post {
  id: string
  content: string
  createdAt: string
}

export default function ProfilePage({ params }: { params: { id: string } }) {
  const [profileUser, setProfileUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editBio, setEditBio] = useState('')
  const { user, updateProfile } = useAuth()

  const isOwnProfile = user?.id === params.id

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch(`/api/users/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        
        if (data.user) {
          setProfileUser(data.user)
          setPosts(data.posts || [])
          setEditName(data.user.name)
          setEditBio(data.user.bio || '')
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [params.id])

  const handleSaveProfile = async () => {
    if (!isOwnProfile) return

    const success = await updateProfile({
      name: editName,
      bio: editBio
    })

    if (success) {
      setProfileUser(prev => prev ? { ...prev, name: editName, bio: editBio } : null)
      setEditing(false)
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </ProtectedRoute>
    )
  }

  if (!profileUser) {
    return (
      <ProtectedRoute>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">User not found</p>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="text-xl">
                    {profileUser.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  {editing ? (
                    <div className="space-y-2">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="font-semibold text-lg"
                      />
                    </div>
                  ) : (
                    <h1 className="text-2xl font-bold">{profileUser.name}</h1>
                  )}
                  <p className="text-gray-600">{profileUser.email}</p>
                </div>
              </div>
              
              {isOwnProfile && (
                <div className="flex space-x-2">
                  {editing ? (
                    <>
                      <Button size="sm" onClick={handleSaveProfile}>
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditing(false)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardHeader>
          
          <CardContent>
            {editing ? (
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
              </div>
            ) : (
              <div>
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-gray-700">
                  {profileUser.bio || 'No bio available.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* User's Posts */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold">
            {isOwnProfile ? 'Your Posts' : `${profileUser.name}'s Posts`}
          </h2>
          
          {posts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">
                  {isOwnProfile ? "You haven't posted anything yet." : "No posts yet."}
                </p>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <Card key={post.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3">
                    <Avatar>
                      <AvatarFallback>
                        {profileUser.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold">{profileUser.name}</span>
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
