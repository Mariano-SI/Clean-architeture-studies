import { AppError } from './app-error'

export class PayloadTooLargeError extends AppError {
  constructor(message: string) {
    super(message, 413)
    this.name = 'PayloadTooLargeError'
  }
}
