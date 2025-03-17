import { UsersRepository } from '@/users/domain/repositories/users.repository'
import { UserOutputDto } from '../dtos/user-output.dto'
import { ConflictError } from '@/common/domain/errors/conflict-error'

type Input = {
  name: string
  email: string
  password: string
}

export class CreateUserUsecase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(props: Input): Promise<UserOutputDto> {
    const user = await this.usersRepository.findByEmail(props.email)

    if (user) {
      throw new ConflictError('User with this email already exists')
    }

    const createdUser = await this.usersRepository.create(props)

    return new UserOutputDto(createdUser)
  }
}
