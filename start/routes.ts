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
const MonpotagersController = () => import('#controllers/monpotagers_controller')
const AdminController = () => import('#controllers/admin_controller')

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
    router
      .group(() => {
        router.get('/', [MonpotagersController, 'index']).as('index')
        router.get('/create', [MonpotagersController, 'create']).as('create')
        router.post('/create', [MonpotagersController, 'handleCreate']).as('store')
        router.get('/:id', [MonpotagersController, 'show']).as('show')
        router.post('/:id', [MonpotagersController, 'handleUpdate']).as('update')
        router.get('/:id/edit', [MonpotagersController, 'edit']).as('edit')
        router.post('/:id/delete', [MonpotagersController, 'handleDelete']).as('delete')
      })
      .as('monpotager')
      .prefix('monpotager')
    router.get('/agenda', [AdminController, 'agenda']).as('agenda')
    router.get('/taches', [AdminController, 'taches']).as('taches')
    router.get('/plantations', [AdminController, 'plantations']).as('plantations')

    router.get('/profile', [AdminController, 'profile']).as('profile')
    router.get('/settings', [AdminController, 'settings']).as('settings')
    router.post('/settings', [AuthController, 'handleUpdate']).as('settings.update')

    router.post('/logout', [AuthController, 'logout']).as('logout')
  })
  .use(middleware.auth())
  .prefix('admin')
  .as('admin')
