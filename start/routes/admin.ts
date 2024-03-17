const AdminController = () => import('#controllers/admin/admin_controller')
const AuthController = () => import('#controllers/auth/auth_controller')
const DemandesController = () => import('#controllers/admin/demandes_controller')
const MonpotagersController = () => import('#controllers/admin/monpotagers_controller')
const PlantationsController = () => import('#controllers/admin/plantations_controller')
const PlantesController = () => import('#controllers/admin/plantes_controller')
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

export default function adminRoute() {
  router
    .group(() => {
      router.get('/', [AdminController, 'index']).as('dashboard')
      router
        .group(() => {
          router.get('/', [MonpotagersController, 'index']).as('index')
          router.get('/create', [MonpotagersController, 'create']).as('create')
          router.post('/create', [MonpotagersController, 'handleCreate']).as('store')
          router
            .group(() => {
              router.get('/', [MonpotagersController, 'show']).as('show')
              router.post('/', [MonpotagersController, 'handleUpdate']).as('update')
              router.post('/delete', [MonpotagersController, 'handleDelete']).as('delete')

              router
                .group(() => {
                  router.get('/create', [PlantationsController, 'create']).as('create')
                  router.post('/create', [PlantationsController, 'handleCreate']).as('store')
                  router.get('/show/:idPlantation', [PlantationsController, 'show']).as('show')
                  router
                    .post('/show/:idPlantation', [PlantationsController, 'handleUpdate'])
                    .as('update')
                  router
                    .post('/delete/:idPlantation', [PlantationsController, 'handleDelete'])
                    .as('delete')
                  router
                    .post('/arrosage/:idPlantation', [PlantationsController, 'arrosage'])
                    .as('arrosage')
                })
                .as('plantations')
                .prefix('plantations')
            })
            .prefix(':idPotager')
        })
        .as('monpotager')
        .prefix('monpotager')

      router.get('/agenda', [AdminController, 'agenda']).as('agenda')
      router.get('/taches', [AdminController, 'taches']).as('taches')

      router
        .group(() => {
          router.get('/', [PlantesController, 'index']).as('index')
          router.get('/create', [PlantesController, 'create']).as('create')
          router.post('/create', [PlantesController, 'handleCreate']).as('store')
          router.get('/:id', [PlantesController, 'show']).as('show')
          router.post('/:id', [PlantesController, 'handleUpdate']).as('update')
          router.post('/:id/delete', [PlantesController, 'handleDelete']).as('delete')
        })
        .as('plantes')
        .prefix('plantes')

      router.get('/profile', [AdminController, 'profile']).as('profile')
      router.get('/settings', [AdminController, 'settings']).as('settings')
      router.post('/settings', [AuthController, 'handleUpdate']).as('settings.update')

      router.get('/demandes', [DemandesController, 'index']).as('demandes')
      router.post('/demandes', [DemandesController, 'actionDemande']).as('demandes.action')

      router.post('/logout', [AuthController, 'logout']).as('logout')
    })
    .use(middleware.auth())
    .prefix('admin')
    .as('admin')
}
