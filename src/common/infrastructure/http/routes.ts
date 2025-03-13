import { productsRouter } from '@/products/infrastructure/http/routes/products.routes'
import { Router } from 'express'

const routes = Router()

routes.get('/', (req, res) => {
  return res.json({ message: 'Olá, Dev!' })
})

routes.use('/products', productsRouter)

export { routes }
