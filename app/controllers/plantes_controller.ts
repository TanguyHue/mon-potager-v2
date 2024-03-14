import Plante from '#models/plante'
import User from '#models/user'
import { createPlanteValidator } from '#validators/plante'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { unlink } from 'node:fs'

export default class PlantesController {
  async index({ view }: HttpContext) {
    const plantes = await Plante.all()
    return view.render('admin/plantations/index', { plantes })
  }

  async create({ view }: HttpContext) {
    return view.render('admin/plantations/create')
  }

  async handleCreate({ view, request, auth }: HttpContext) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { name, icon, delai_recolte } = await request.validateUsing(createPlanteValidator)
    const userId = auth.user?.id

    if (icon) {
      await icon.move(app.makePath('public/plantes/'), {
        name: `${cuid()}.${icon.extname}`,
      })
    }

    const path = `/plantes/${icon ? icon.fileName : 'default.png'}`
    await Plante.create({
      name,
      icon: path,
      delai_recolte,
      user_id: userId,
    })
    return this.index({ view } as HttpContext)
  }

  async show({ view, request, auth }: HttpContext) {
    const idPlante = request.param('id')
    const plante = await Plante.find(idPlante)

    if (!plante) {
      throw new Error('Plante not found')
    }

    let username = auth.user?.username
    if (plante.user_id !== auth.user?.id) {
      const user = await User.findOrFail(plante.user_id)
      username = user.username
    }

    return view.render('admin/plantations/show', { plante, username })
  }

  async handleUpdate({ response, session }: HttpContext) {
    session.flash({ notification: 'Plante mis à jour avec succès' })
    response.redirect().toRoute('admin/plantations')
  }

  async handleDelete({ request, view, auth }: HttpContext) {
    const plante = await Plante.findOrFail(request?.param('id'))

    if (!plante) {
      throw new Error('Plante not found')
    }

    if (plante.user_id !== auth.user?.id) {
      throw new Error('Not authorized to delete this plante')
    }

    const icon = plante.icon
    if (icon !== '/plantes/default.png') {
      unlink(app.makePath(`public${icon}`), (err) => {
        if (err) throw err
        console.log('path/file.txt was deleted')
      })
    }

    await plante.delete()
    this.index({ view } as HttpContext)
  }
}
