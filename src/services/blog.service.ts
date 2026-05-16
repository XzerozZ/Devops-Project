import { BlogRepository } from '@/repositories/blog.repository'
import { Prisma } from '@prisma/client'

export class BlogService {
  private blogRepository: BlogRepository

  constructor() {
    this.blogRepository = new BlogRepository()
  }

  async getAllBlogs() {
    return this.blogRepository.findAll()
  }

  async getBlogById(id: string) {
    return this.blogRepository.findById(id)
  }

  async searchBlogs(query: string) {
    return this.blogRepository.searchByTitle(query)
  }

  async createBlog(data: { title: string; content: string; authorId: string }) {
    const slug = this.generateSlug(data.title)
    
    // Check if slug exists
    const existingBlog = await this.blogRepository.findBySlug(slug)
    const uniqueSlug = existingBlog ? `${slug}-${Date.now()}` : slug

    return this.blogRepository.create({
      title: data.title,
      content: data.content,
      slug: uniqueSlug,
      author: {
        connect: { id: data.authorId }
      }
    })
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
}
