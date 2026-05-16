import { UserRepository } from '@/repositories/user.repository'
import bcrypt from 'bcryptjs'
import { Prisma } from '@prisma/client'

export class AuthService {
  private userRepository: UserRepository

  constructor() {
    this.userRepository = new UserRepository()
  }

  async register(data: Prisma.UserCreateInput) {
    const existingUser = await this.userRepository.findByEmail(data.email)
    if (existingUser) {
      throw new Error('User already exists')
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)
    
    return this.userRepository.create({
      ...data,
      password: hashedPassword,
    })
  }
}
