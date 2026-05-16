import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { BlogService } from '@/services/blog.service'

export async function GET() {
  try {
    const blogService = new BlogService()
    const blogs = await blogService.getAllBlogs()
    return NextResponse.json(blogs)
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { title, content } = body

    if (!title || !content) {
      return NextResponse.json(
        { message: 'Missing title or content' },
        { status: 400 }
      )
    }

    const blogService = new BlogService()
    const blog = await blogService.createBlog({
      title,
      content,
      authorId: (session.user as any).id,
    })

    return NextResponse.json(blog, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
