/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import AutoSwagger from 'adonis-autoswagger'
import router from '@adonisjs/core/services/router'
import swagger from '#config/swagger'
import { middleware } from './kernel.js'

const AuthController = () => import('#controllers/auth_controller')
const AppController = () => import('#controllers/app_controller')

// Swagger routes
router.get('/swagger', async () => {
  return AutoSwagger.default.json(router.toJSON(), swagger)
})

router.get('/docs', async () => {
  return AutoSwagger.default.ui('/swagger', swagger)
})

// Public routes
router
  .group(() => {
    router.get('health', [AppController, 'health']).as('app.health')
  })
  .prefix('public')

// Auth routes
router
  .group(() => {
    router.post('/register', [AuthController, 'register']).as('auth.register')
    router.post('/login', [AuthController, 'login']).as('auth.login')
    router.delete('/logout', [AuthController, 'logout']).as('auth.logout').use(middleware.auth())
    router.get('/me', [AuthController, 'me']).as('auth.me').use(middleware.auth())
  })
  .prefix('auth')
