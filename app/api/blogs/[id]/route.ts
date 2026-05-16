import { NextResponse } from 'next/server'
import { BlogService } from '@/services/blog.service'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const blogService = new BlogService()
    const blog = await blogService.getBlogById(id)

    if (!blog) {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 })
    }

    return NextResponse.json(blog)
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
