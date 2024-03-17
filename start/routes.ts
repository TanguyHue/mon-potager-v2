/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import router from '@adonisjs/core/services/router'
import adminRoute from '#start/routes/admin'
import authRoute from '#start/routes/auth'

router.on('/').render('pages/home').as('home')
router.on('/project').render('pages/project').as('project')
router.on('/potagers').render('pages/potagers').as('potagers')

adminRoute()
authRoute()
