import { UserRepository } from '@/repositories/user.repository'
import { Prisma } from '@prisma/client'
import bcrypt from 'bcryptjs'

export class UserService {
  private userRepository: UserRepository

  constructor() {
    this.userRepository = new UserRepository()
  }

  async getAllUsers() {
    return this.userRepository.findAll()
  }

  async getUserById(id: string) {
    return this.userRepository.findById(id)
  }

  async updateUser(id: string, data: Prisma.UserUpdateInput) {
    if (data.password && typeof data.password === 'string') {
      data.password = await bcrypt.hash(data.password, 10)
    }
    return this.userRepository.update(id, data)
  }

  async deleteUser(id: string) {
    return this.userRepository.delete(id)
  }
}
