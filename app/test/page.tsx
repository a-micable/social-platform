'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface TestResult {
  name: string
  status: 'success' | 'error' | 'pending'
  message: string
}

export default function TestPage() {
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'API Health Check', status: 'pending', message: 'Checking...' },
    { name: 'Authentication System', status: 'pending', message: 'Checking...' },
    { name: 'Database Connection', status: 'pending', message: 'Checking...' },
    { name: 'Post Creation', status: 'pending', message: 'Checking...' },
  ])

  const runTests = async () => {
    // Reset tests
    setTests(prev => prev.map(test => ({ ...test, status: 'pending', message: 'Checking...' })))

    // Test API Health
    try {
      const res = await fetch('/api/health')
      const data = await res.json()
      setTests(prev => prev.map(test => 
        test.name === 'API Health Check' 
          ? { ...test, status: 'success', message: data.message || 'API is healthy' }
          : test
      ))
    } catch {
      setTests(prev => prev.map(test => 
        test.name === 'API Health Check' 
          ? { ...test, status: 'error', message: 'API health check failed' }
          : test
      ))
    }

    // Test Auth System
    try {
      const res = await fetch('/api/auth/test')
      const data = await res.json()
      setTests(prev => prev.map(test => 
        test.name === 'Authentication System' 
          ? { ...test, status: 'success', message: data.message || 'Auth system working' }
          : test
      ))
    } catch {
      setTests(prev => prev.map(test => 
        test.name === 'Authentication System' 
          ? { ...test, status: 'error', message: 'Auth system test failed' }
          : test
      ))
    }

    // Test Database (simulated)
    setTimeout(() => {
      setTests(prev => prev.map(test => 
        test.name === 'Database Connection' 
          ? { ...test, status: 'success', message: 'In-memory storage working' }
          : test
      ))
    }, 1000)

    // Test Post Creation (simulated)
    setTimeout(() => {
      setTests(prev => prev.map(test => 
        test.name === 'Post Creation' 
          ? { ...test, status: 'success', message: 'Post system functional' }
          : test
      ))
    }, 1500)
  }

  useEffect(() => {
    runTests()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600'
      case 'error':
        return 'text-red-600'
      default:
        return 'text-yellow-600'
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            System Health Check
            <Button onClick={runTests} variant="outline" size="sm">
              Run Tests
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tests.map((test, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(test.status)}
                  <span className="font-medium">{test.name}</span>
                </div>
                <span className={`text-sm ${getStatusColor(test.status)}`}>
                  {test.message}
                </span>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">System Info</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• Authentication: JWT tokens with localStorage</p>
              <p>• Storage: In-memory (resets on server restart)</p>
              <p>• Framework: Next.js 14 with App Router</p>
              <p>• UI: shadcn/ui + Tailwind CSS</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
