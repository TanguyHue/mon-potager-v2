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
import AdminController from '#controllers/admin_controller'

router.on('/').render('pages/home').as('home')
router.on('/project').render('pages/project').as('project')
router.on('/potagers').render('pages/potagers').as('potagers')

router
  .group(() => {
    router.get('/register', [AuthController, 'register']).as('auth.register')
    router.post('/register', [AuthController, 'handleRegister'])
    router.get('/login', [AuthController, 'login']).as('auth.login')
    router.post('/login', [AuthController, 'handleLogin'])
  })
  .use(middleware.guest())

router
  .group(() => {
    router.get('/', [AdminController, 'index']).as('dashboard')
    router.get('/monpotager', [AdminController, 'monpotager']).as('monpotager')
    router.get('/agenda', [AdminController, 'agenda']).as('agenda')
    router.get('/taches', [AdminController, 'taches']).as('taches')
    router.get('/plantations', [AdminController, 'plantations']).as('plantations')

    router.get('/profile', [AdminController, 'profile']).as('profile')
    router.get('/settings', [AdminController, 'settings']).as('settings')

    router.post('/logout', [AuthController, 'logout']).as('logout')
  })
  .use(middleware.auth())
  .prefix('admin')
  .as('admin')
