'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, MessageSquare, User } from 'lucide-react'

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/feed')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect to feed
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to SocialHub
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Connect with others, share your thoughts, and discover what's happening in your community.
        </p>
        <div className="space-x-4">
          <Link href="/register">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg">Sign In</Button>
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <Card>
          <CardHeader>
            <Users className="w-8 h-8 text-blue-600 mb-2" />
            <CardTitle>Connect</CardTitle>
            <CardDescription>
              Build your network and discover interesting people in your community.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <MessageSquare className="w-8 h-8 text-blue-600 mb-2" />
            <CardTitle>Share</CardTitle>
            <CardDescription>
              Post your thoughts, ideas, and updates for everyone to see.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <User className="w-8 h-8 text-blue-600 mb-2" />
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Create your profile and showcase your posts and interests.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Ready to join?</CardTitle>
            <CardDescription>
              Create your account and start connecting today.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/register">
              <Button className="w-full">Sign Up Now</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
