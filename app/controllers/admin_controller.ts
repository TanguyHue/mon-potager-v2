import type { HttpContext } from '@adonisjs/core/http'

export default class AdminController {
  index({ view }: HttpContext) {
    return view.render('admin/dashboard')
  }

  agenda({ view }: HttpContext) {
    return view.render('admin/agenda/index')
  }

  taches({ view }: HttpContext) {
    return view.render('admin/taches/index')
  }

  plantations({ view }: HttpContext) {
    return view.render('admin/plantations/index')
  }

  profile({ view }: HttpContext) {
    return view.render('admin/profile/index')
  }

  settings({ view }: HttpContext) {
    return view.render('admin/settings/index')
  }
}
