'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { LogOut, User, Home } from 'lucide-react'

export function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="border-b bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href={user ? '/feed' : '/'} className="text-xl font-bold text-blue-600">
              SocialHub
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/feed">
                  <Button variant="ghost" size="sm">
                    <Home className="w-4 h-4 mr-2" />
                    Feed
                  </Button>
                </Link>
                <Link href={`/profile/${user.id}`}>
                  <Button variant="ghost" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                </Link>
                <div className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/register">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
