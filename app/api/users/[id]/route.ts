import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { UserService } from '@/services/user.service'
import bcrypt from 'bcryptjs'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const userService = new UserService()
    const user = await userService.getUserById(id)

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    const { password, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword)
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions)

  if (!session || ((session.user as any).id !== id && (session.user as any).role !== 'ADMIN')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, currentPassword, newPassword } = body
    const userService = new UserService()

    // If changing password, verify current password first
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ message: 'Current password is required' }, { status: 400 })
      }

      const user = await userService.getUserById(id)
      if (!user || !user.password) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 })
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, user.password)
      if (!isPasswordValid) {
        return NextResponse.json({ message: 'Incorrect current password' }, { status: 400 })
      }

      const updatedUser = await userService.updateUser(id, { name, password: newPassword })
      const { password: _, ...userWithoutPassword } = updatedUser
      return NextResponse.json(userWithoutPassword)
    }

    // Normal profile update
    const updatedUser = await userService.updateUser(id, { name })
    const { password: _, ...userWithoutPassword } = updatedUser
    return NextResponse.json(userWithoutPassword)
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions)

  if (!session || ((session.user as any).id !== id && (session.user as any).role !== 'ADMIN')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const userService = new UserService()
    await userService.deleteUser(id)
    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
