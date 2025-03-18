import { UsersRepository } from '@/users/domain/repositories/users.repository'
import { UserOutputDto } from '../dtos/user-output.dto'
import { UploaderProvider } from '@/common/domain/providers/uploader-provider'
import { PayloadTooLargeError } from '@/common/domain/errors/payload-too-large.error'
import { UnprocessableEntityError } from '@/common/domain/errors/unprocessable-entity.error'
import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { randomUUID } from 'crypto'

type Input = {
  user_id: string
  fileName: string
  fileType: string
  fileSize: number
  fileContent: Buffer
}

const MAX_UPLOAD_SIZE = 1024 * 1024 * 3 //3mb
const ACCEPT_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]

export class UpdateAvatarUsecase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly uploaderProvider: UploaderProvider,
  ) {}

  async execute(input: Input): Promise<UserOutputDto> {
    const { user_id, fileName, fileType, fileSize, fileContent } = input

    if (!ACCEPT_IMAGE_TYPES.includes(fileType)) {
      throw new UnprocessableEntityError('Invalid file type')
    }

    if (fileSize > MAX_UPLOAD_SIZE) {
      throw new PayloadTooLargeError('File size must be less than 3mb')
    }

    const user = await this.usersRepository.findById(user_id)

    if (!user) {
      throw new NotFoundError('User not found')
    }

    const uniqueFileName = `${randomUUID()}-${fileName}`

    const uploadedFile = await this.uploaderProvider.upload({
      fileName: uniqueFileName,
      fileContent,
      fileType,
    })

    user.avatar = uploadedFile

    const updatedUser = await this.usersRepository.update(user)

    return new UserOutputDto(updatedUser)
  }
}
