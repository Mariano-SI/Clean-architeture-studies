import { productsRouter } from '@/products/infrastructure/http/routes/products.routes'
import { authRouter } from '@/users/infrastructure/http/routes/auth.routes'
import { usersRouter } from '@/users/infrastructure/http/routes/users.routes'
import { Router } from 'express'

const routes = Router()

routes.get('/', (req, res) => {
  return res.json({ message: 'Olá, Dev!' })
})

routes.use('/products', productsRouter)
routes.use('/users', usersRouter)
routes.use('/auth', authRouter)

export { routes }
