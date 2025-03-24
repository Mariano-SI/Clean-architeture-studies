import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { UserModel } from '@/users/domain/models/users.model'
import { UserTokensRepository } from '@/users/domain/repositories/user-tokens.repository'
import { UsersRepository } from '@/users/domain/repositories/users.repository'
import { UserOutputDto } from '../dtos/user-output.dto'

interface Input {
  email: string
}

interface Output {
  user: UserOutputDto
  token: string
}

export class SendEmailToResetPasswordUsecase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly userTokensRepository: UserTokensRepository,
  ) {}

  async execute(input: Input): Promise<Output> {
    const user = await this.usersRepository.findByEmail(input.email)

    if (!user) {
      throw new NotFoundError('User not found')
    }

    const { token } = await this.userTokensRepository.create({
      user_id: user.id,
    })

    return { user: new UserOutputDto(user), token }
  }
}
