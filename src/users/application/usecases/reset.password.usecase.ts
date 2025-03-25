import { BadRequestError } from '@/common/domain/errors/bad-request-error'
import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { HashProvider } from '@/common/domain/providers/hash-provider'
import { UserTokensRepository } from '@/users/domain/repositories/user-tokens.repository'
import { UsersRepository } from '@/users/domain/repositories/users.repository'
import { addHours, isAfter } from 'date-fns'

interface Input {
  token: string
  password: string
}

export class ResetPasswordUsecase {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly userTokensRepository: UserTokensRepository,
    private readonly hashProvider: HashProvider,
  ) {}

  async execute(input: Input): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(input.token)

    if (!userToken) {
      throw new NotFoundError('User token not found')
    }

    const user = await this.userRepository.findById(userToken.user_id)

    if (!user) {
      throw new NotFoundError('User not found')
    }

    const compareDate = addHours(userToken.created_at, 2)

    if (isAfter(Date.now(), compareDate)) {
      throw new BadRequestError('Token expired')
    }

    user.password = await this.hashProvider.generateHash(input.password)

    await this.userRepository.update(user)
  }
}
