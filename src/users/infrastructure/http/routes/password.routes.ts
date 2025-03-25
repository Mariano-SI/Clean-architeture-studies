import { Router } from 'express'
import { sendEmailToResetPasswordController } from '../controllers/send-email-to-reset-password.controller'
import { resetPasswordController } from '../controllers/reset-password.controller'

const passwordRoutes = Router()

passwordRoutes.post('/forgot', sendEmailToResetPasswordController)
passwordRoutes.post('/reset', resetPasswordController)

export { passwordRoutes }
