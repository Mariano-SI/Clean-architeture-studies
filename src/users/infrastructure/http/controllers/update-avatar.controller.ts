import { BadRequestError } from '@/common/domain/errors/bad-request-error'
import { Request, Response } from 'express'
import { z } from 'zod'
import { UsersRepositoryPG } from '../../database/user.repository.pg'
import { UpdateAvatarUsecase } from '@/users/application/usecases/update-avatar-usecase'
import { UploaderProviderR2 } from '@/common/infrastructure/providers/uploader-provider.r2'

export async function updateAvatarController(
  req: Request,
  res: Response,
): Promise<Response> {
  const fileSchema = z.any().refine(file => {
    return !!file
  }, 'File is required')

  const isValidFileSchema = fileSchema.safeParse(req.file)

  if (!isValidFileSchema.success) {
    throw new BadRequestError(
      `${isValidFileSchema.error.errors.map(error => {
        return `${error.path} -> ${error.message}`
      })}`,
    )
  }

  const { buffer, originalname, size, mimetype } = isValidFileSchema.data

  const usersRepository = UsersRepositoryPG.getInstance()
  const uploadProvider = new UploaderProviderR2()
  const updateUserAvatarUsecase = new UpdateAvatarUsecase(
    usersRepository,
    uploadProvider,
  )

  const updatedUser = await updateUserAvatarUsecase.execute({
    fileContent: buffer,
    fileName: originalname.split(' ').join('-'),
    fileSize: size,
    fileType: mimetype,
    user_id: req.user.id,
  })

  return res.status(200).json(updatedUser)
}
