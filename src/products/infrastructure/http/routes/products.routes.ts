import { Router } from 'express'
import { createProductController } from '../controllers/create-product.controller'
import { listProductController } from '../controllers/list-product.controller'
import { updateProductController } from '../controllers/update-product-controller'
import { deleteProductController } from '../controllers/delete-product.controller'
import { listProductsController } from '../controllers/list-products.controller'

const productsRouter = Router()


/**
 * @swagger
 * /products:
 *   get:
 *     summary: Returns a paginated list of products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number to retrieve
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *           default: 15
 *         description: Number of items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: null
 *         description: Field to sort by
 *       - in: query
 *         name: sort_dir
 *         schema:
 *           type: string
 *           default: null
 *         description: Sort direction (asc or desc)
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           default: null
 *         description: Filter string to search for specific products
 *     responses:
 *       200:
 *         description: A paginated list of products
 *         content:
 *           application/json:
 *             schema:
 */
productsRouter.get('/', listProductsController)

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - quantity
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id (uuid) of the product
 *         name:
 *           type: string
 *           description: The name of the product
 *         price:
 *           type: number
 *           description: The price of the product
 *         quantity:
 *           type: number
 *           description: The quantity of the product
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date the product was added
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The date the product was last updated
 *       example:
 *         id: 06db518e-613b-4a76-8e4f-2e305fe4f68d
 *         name: Sample Product
 *         price: 29.99
 *         quantity: 100
 *         created_at: 2023-01-01T10:00:00Z
 *         updated_at: 2023-01-01T10:00:00Z
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: The products managing API
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: The product was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Input data not provided or invalid
 *       409:
 *         description: Name already used on another product
 */
productsRouter.post('/', createProductController)

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     responses:
 *       200:
 *         description: The product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: The product was not found
 */
productsRouter.get('/:id', listProductController)

/**
 * @swagger
 * /products/{id}:
 *   patch:
 *     summary: Update a product by ID
 *     description: Updates a product's details. Only the fields provided in the request body will be updated.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: New name of the product
 *                 example: "Updated Product Name"
 *               price:
 *                 type: number
 *                 description: New price of the product
 *                 example: 199.99
 *               quantity:
 *                 type: integer
 *                 description: New quantity of the product
 *                 example: 50
 *     responses:
 *       200:
 *         description: The product was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Input data not provided or invalid
 *       404:
 *         description: The product was not found
 *       409:
 *         description: Name already used on another product
 */

productsRouter.patch('/:id', updateProductController)

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     responses:
 *       204:
 *         description: The product was successfully deleted
 *       404:
 *         description: The product was not found
 */
productsRouter.delete('/:id', deleteProductController)

export { productsRouter }
