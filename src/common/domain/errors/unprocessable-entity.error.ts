import { AppError } from './app-error'

export class UnprocessableEntityError extends AppError {
  constructor(message: string) {
    super(message, 422)
    this.name = 'UnprocessableEntityError'
  }
}
