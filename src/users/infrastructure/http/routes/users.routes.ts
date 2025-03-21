import { Router } from 'express'
import { createUserController } from '../controllers/create-user.controller'
import { listUsersController } from '../controllers/list-users.controller'
import { isAuthenticated } from '@/common/infrastructure/http/middlewares/isAuthenticated'
import multer from 'multer'
import { BadRequestError } from '@/common/domain/errors/bad-request-error'
import { updateAvatarController } from '../controllers/update-avatar.controller'

const usersRouter = Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 3,
  },
  fileFilter: (request, file, callback) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

    if (!allowedMimes.includes(file.mimetype)) {
      callback(
        new BadRequestError('.jpg, .jpeg, .png and .webp files are accepted'),
      )
    }
    callback(null, true)
  },
})

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - passowrd
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id (uuid) of the user
 *         name:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         passowrd:
 *           type: string
 *           description: The passowrd of the user
 *         avatar:
 *           type: string
 *           description: The avatar of the user
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date the user was added
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The date the user was last updated
 *       example:
 *         id: 06db518e-613b-4a76-8e4f-2e305fe4f68d
 *         name: Sample User
 *         email: sampleuser@mail.com
 *         password: $2a$06$tPOF8dcfc5sIvII3NTLQh.QF5sR4iBbgAihVn.l2M07WoDyD7b1Ge
 *         avatar: null
 *         created_at: 2023-01-01T10:00:00Z
 *         updated_at: 2023-01-01T10:00:00Z
 *     UserListResponse:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *         total:
 *           type: integer
 *           description: Total number of users
 *         current_page:
 *           type: integer
 *           description: Current page number
 *         last_page:
 *           type: integer
 *           description: Last page number
 *         per_page:
 *           type: integer
 *           description: Number of items per page
 *       example:
 *         items:
 *           - id: 06db518e-613b-4a76-8e4f-2e305fe4f68d
 *             name: Sample User
 *             email: sampleuser@mail.com
 *             password: $2a$06$tPOF8dcfc5sIvII3NTLQh.QF5sR4iBbgAihVn.l2M07WoDyD7b1Ge
 *             avatar: null
 *             created_at: 2023-01-01T10:00:00Z
 *             updated_at: 2023-01-01T10:00:00Z
 *         total: 150
 *         current_page: 1
 *         last_page: 10
 *         per_page: 15
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: The user was successfully created
 *       400:
 *         description: Input data not provided or invalid
 *       409:
 *         description: Email already used on another user
 */

usersRouter.post('/', createUserController)
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Returns a paginated list of users
 *     tags: [Users]
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
 *         description: Filter string to search for specific users
 *     responses:
 *       200:
 *         description: A paginated list of users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserListResponse'
 */

usersRouter.get('/', isAuthenticated, listUsersController)
/**
 * @swagger
 * /users/avatar:
 *   patch:
 *     summary: Upload an image for a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: file
 *                 format: binary
 *                 description: The image file to upload
 *     responses:
 *       200:
 *         description: The image was successfully uploaded
 *       400:
 *         description: Bad request
 *       404:
 *         description: The user was not found
 *       500:
 *         description: Some server error
 */
usersRouter.patch(
  '/avatar',
  isAuthenticated,
  upload.single('file'),
  updateAvatarController,
)

export { usersRouter }
