import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { UserService } from '@/services/user.service'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const userService = new UserService()
    const users = await userService.getAllUsers()
    
    // Remove passwords
    const usersWithoutPassword = users.map(user => {
      const { password, ...u } = user
      return u
    })

    return NextResponse.json(usersWithoutPassword)
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
