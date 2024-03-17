const AuthController = () => import('#controllers/auth/auth_controller')
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

export default function authRoute() {
  router
    .group(() => {
      router.get('/register', [AuthController, 'register']).as('auth.register')
      router.post('/register', [AuthController, 'handleRegister'])
      router.get('/login', [AuthController, 'login']).as('auth.login')
      router.post('/login', [AuthController, 'handleLogin'])
    })
    .use(middleware.guest())
}
