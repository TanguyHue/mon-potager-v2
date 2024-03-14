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

  async show({ view, request, auth }: HttpContext) {
    const idPotager = request.param('id')
    const potager = await Potager.find(idPotager)

    if (!potager) {
      throw new Error('Potager not found')
    }

    if (potager.user_id !== auth.user?.id) {
      throw new Error('Potager not found')
    }

    return view.render('admin/monpotager/show', { potager })
  }

  async handleUpdate({ response, session }: HttpContext) {
    session.flash({ notification: 'Potager mis à jour avec succès' })
    response.redirect().toRoute('admin/monpotager')
  }

  async handleDelete({ request, response, auth }: HttpContext) {
    const potager = await Potager.findOrFail(request?.param('id'))

    if (!potager) {
      throw new Error('Potager not found')
    }

    if (potager.user_id !== auth.user?.id) {
      throw new Error('Potager not found')
    }

    await potager.delete()
    response.redirect().toRoute('admin.monpotager.index')
  }
}
