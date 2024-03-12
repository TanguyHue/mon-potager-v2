/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const AuthController = () => import('#controllers/auth_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

router.on('/').render('pages/home').as('home')
router.on('/project').render('pages/project').as('project')
router.on('/potagers').render('pages/potagers').as('potagers')

router.get('/register', [AuthController, 'register']).as('auth.register').use(middleware.guest())
router.post('/register', [AuthController, 'handleRegister']).use(middleware.guest())
router.get('/login', [AuthController, 'login']).as('auth.login').use(middleware.guest())
router.post('/login', [AuthController, 'handleLogin']).use(middleware.guest())
router.post('/logout', [AuthController, 'logout']).as('auth.logout').use(middleware.auth())

router
  .group(() => router.get('/dashboard', [AuthController, 'dashboard']).as('admin.dashboard'))
  .use(middleware.auth())
