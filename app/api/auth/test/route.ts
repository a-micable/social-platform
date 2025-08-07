export async function GET() {
  return Response.json({ 
    status: 'ok', 
    message: 'Authentication system is functional',
    features: ['JWT tokens', 'User registration', 'Login/logout', 'Profile management']
  })
}
