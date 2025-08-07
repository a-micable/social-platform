export async function GET() {
  return Response.json({ 
    status: 'healthy', 
    message: 'SocialHub API is running',
    timestamp: new Date().toISOString()
  })
}
