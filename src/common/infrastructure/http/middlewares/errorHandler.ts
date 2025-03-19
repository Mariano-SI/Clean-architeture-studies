import { AppError } from '@/common/domain/errors/app-error'
import { NextFunction, Request, Response } from 'express'
import { MulterError } from 'multer'

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): Response {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    })
  }

  if (error instanceof MulterError) {
    return res.status(400).json({
      status: 'error',
      message: error.message,
    })
  }

  console.error(error)

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  })
}
