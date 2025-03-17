import { productsRouter } from '@/products/infrastructure/http/routes/products.routes'
import { usersRouter } from '@/users/infrastructure/http/routes/users.routes'
import { Router } from 'express'

const routes = Router()

routes.get('/', (req, res) => {
  return res.json({ message: 'Olá, Dev!' })
})

routes.use('/products', productsRouter)
routes.use('/users', usersRouter)

export { routes }
