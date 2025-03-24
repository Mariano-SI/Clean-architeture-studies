import { RepositoryInterface } from '@/common/domain/repositories/repository-interface'
import { UserTokensModel } from '../models/user-tokens.model'

export interface CreateUserTokensProps {
  user_id: string
}

export interface UserTokensRepository
  extends RepositoryInterface<UserTokensModel, CreateUserTokensProps> {
  findByToken(token: string): Promise<UserTokensModel>
}
