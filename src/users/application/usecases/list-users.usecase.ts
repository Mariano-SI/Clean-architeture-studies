import { UsersRepository } from '@/users/domain/repositories/users.repository'
import { UserOutputDto } from '../dtos/user-output.dto'

type Input = {
  page?: number
  per_page?: number
  sort?: string
  sort_dir?: string
  filter?: string
}

type Output = {
  items: UserOutputDto[]
  per_page: number
  total: number
  current_page: number
  sort: string | null
  sort_dir: string | null
  filter: string | null
}

export class ListUsersUseCase {
  constructor(private readonly userRepository: UsersRepository) {}

  async execute(input: Input): Promise<Output> {
    const listResult = await this.userRepository.selectAll(input)

    const formattedUsers: UserOutputDto[] = listResult.items.map(
      user => new UserOutputDto(user),
    )

    return {
      items: formattedUsers,
      per_page: listResult.per_page,
      current_page: listResult.current_page,
      sort: listResult.sort,
      sort_dir: listResult.sort_dir,
      filter: listResult.filter,
      total: listResult.total,
    }
  }
}
