import { BlogService } from '@/services/blog.service'
import { BlogRepository } from '@/repositories/blog.repository'

// Mock the BlogRepository
jest.mock('@/repositories/blog.repository')

describe('BlogService', () => {
  let blogService: BlogService
  let blogRepositoryMock: jest.Mocked<BlogRepository>

  beforeEach(() => {
    blogRepositoryMock = new BlogRepository() as jest.Mocked<BlogRepository>
    blogService = new BlogService()
    // Inject the mock into the service (assuming it's instantiated in constructor)
    // In our implementation, it IS instantiated in constructor, so we might need a better way to inject if we want pure unit tests.
    // For now, let's just mock the class.
    ;(BlogRepository as jest.Mock).mockImplementation(() => blogRepositoryMock)
    blogService = new BlogService() // Re-instantiate with mock implementation active
  })

  describe('searchBlogs', () => {
    it('should call searchByTitle on the repository', async () => {
      const mockBlogs = [{ id: '1', title: 'Test' }]
      blogRepositoryMock.searchByTitle.mockResolvedValue(mockBlogs as any)

      const result = await blogService.searchBlogs('Test')

      expect(result).toEqual(mockBlogs)
      expect(blogRepositoryMock.searchByTitle).toHaveBeenCalledWith('Test')
    })
  })
})
