import { UnauthorizedError } from '@/common/domain/errors/unauthorized-error'
import { HashProvider } from '@/common/domain/providers/hash-provider'
import { UsersRepository } from '@/users/domain/repositories/users.repository'
import { UserOutputDto } from '../dtos/user-output.dto'

type Input = {
  email: string
  password: string
}

export class AuthenticateUserUsecase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private hashProvider: HashProvider,
  ) {}
  async execute(input: Input): Promise<UserOutputDto> {
    const user = await this.usersRepository.findByEmail(input.email)

    if (!user) {
      throw new UnauthorizedError('Invalid credentials')
    }

    const passwordMatches = await this.hashProvider.compareHash(
      input.password,
      user.password,
    )

    if (!passwordMatches) {
      throw new UnauthorizedError('Invalid credentials')
    }

    return new UserOutputDto(user)
  }
}
