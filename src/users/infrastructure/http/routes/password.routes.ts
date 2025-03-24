import { Router } from 'express'
import { sendEmailToResetPasswordController } from '../controllers/send-email-to-reset-password.controller'

const passwordRoutes = Router()

passwordRoutes.post('/forgot', sendEmailToResetPasswordController)

export { passwordRoutes }
