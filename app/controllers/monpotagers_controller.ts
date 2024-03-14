import type { HttpContext } from '@adonisjs/core/http'
import Potager from '#models/potager'
import { createPotager } from '#validators/potager'

export default class MonpotagersController {
  async index({ view, auth }: HttpContext) {
    const userId = auth.user?.id
    if (!userId) {
      throw new Error('User not found')
    }

    let potager = await Potager.query().where('user_id', userId)
    return view.render('admin/monpotager/index', { idPotager: potager })
  }

  async create({ view }: HttpContext) {
    return view.render('admin/monpotager/create')
  }

  async handleCreate({ request, view, auth }: HttpContext) {
    const userId = auth.user?.id
    if (!userId) {
      throw new Error('User not found')
    }
    const { name, description, longueur, largeur } = await request.validateUsing(createPotager, {
      meta: {
        userId: auth.user?.id,
      },
    })
    await Potager.create({
      name,
      description,
      size_x: longueur,
      size_y: largeur,
      user_id: userId,
    })
    return this.index({ view, auth } as HttpContext)
  }

  async show({ view }: HttpContext) {
    return view.render('admin/monpotager/show')
  }

  async handleUpdate({ response, session }: HttpContext) {
    session.flash({ notification: 'Potager mis à jour avec succès' })
    response.redirect().toRoute('admin/monpotager')
  }

  async edit({ view }: HttpContext) {
    return view.render('admin/monpotager/edit')
  }

  async handleDelete({ response, session }: HttpContext) {
    session.flash({ notification: 'Potager supprimé avec succès' })
    response.redirect().toRoute('admin/monpotager')
  }
}