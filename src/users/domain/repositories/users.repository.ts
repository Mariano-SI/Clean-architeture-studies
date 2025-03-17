import { RepositoryInterface } from '@/common/domain/repositories/repository-interface'
import { UserModel } from '../models/users.model'

interface CreateUserProps {
  id?: string
  name: string
  email: string
  password: string
  avatar?: string
  created_at?: Date
  updated_at?: Date
}

export interface UsersRepository
  extends RepositoryInterface<UserModel, CreateUserProps> {
  findByName(name: string): Promise<UserModel>
  findByEmail(email: string): Promise<UserModel>
}
