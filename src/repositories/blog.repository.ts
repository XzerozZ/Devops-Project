import prisma from '@/lib/db'
import { Prisma, Blog } from '@prisma/client'

export class BlogRepository {
  async findAll(): Promise<Blog[]> {
    return prisma.blog.findMany({
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
  }

  async findById(id: string): Promise<Blog | null> {
    return prisma.blog.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })
  }

  async findBySlug(slug: string): Promise<Blog | null> {
    return prisma.blog.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })
  }

  async create(data: Prisma.BlogCreateInput): Promise<Blog> {
    return prisma.blog.create({
      data,
    })
  }

  async update(id: string, data: Prisma.BlogUpdateInput): Promise<Blog> {
    return prisma.blog.update({
      where: { id },
      data,
    })
  }

  async delete(id: string): Promise<Blog> {
    return prisma.blog.delete({
      where: { id },
    })
  }

  async searchByTitle(query: string): Promise<Blog[]> {
    return prisma.blog.findMany({
      where: {
        title: {
          contains: query,
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
  }
}
