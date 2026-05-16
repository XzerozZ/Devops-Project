import { BlogRepository } from '@/repositories/blog.repository'
import prisma from '@/lib/db'

// Mock the prisma client
jest.mock('@/lib/db', () => ({
  blog: {
    findMany: jest.fn(),
  },
}))

describe('BlogRepository', () => {
  let blogRepository: BlogRepository

  beforeEach(() => {
    blogRepository = new BlogRepository()
    jest.clearAllMocks()
  })

  describe('searchByTitle', () => {
    it('should return blogs matching the title query', async () => {
      const mockBlogs = [
        { id: '1', title: 'Test Blog', content: 'Content', slug: 'test-blog' },
      ]
      ;(prisma.blog.findMany as jest.Mock).mockResolvedValue(mockBlogs)

      const result = await blogRepository.searchByTitle('Test')

      expect(result).toEqual(mockBlogs)
      expect(prisma.blog.findMany).toHaveBeenCalledWith({
        where: {
          title: {
            contains: 'Test',
            mode: 'insensitive',
          },
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    })
  })
})
