import type { HttpContext } from '@adonisjs/core/http'
import Potager from '#models/potager'
import { createPotager } from '#validators/potager'
import Plantation from '#models/plantation'
import Plante from '#models/plante'
import { DateTime } from 'luxon'

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
    const { name, description } = await request.validateUsing(createPotager, {
      meta: {
        userId: auth.user?.id,
      },
    })

    await Potager.create({
      name,
      description,
      user_id: userId,
    })
    return this.index({ view, auth } as HttpContext)
  }

  async show({ view, request, auth }: HttpContext) {
    const idPotager = request.param('idPotager', 0)
    if (idPotager === 'undefined' || idPotager === 0) {
      return false
    }
    const potager = await Potager.find(idPotager)

    if (!potager) {
      throw new Error('Potager not found')
    }

    if (potager.user_id !== auth.user?.id) {
      throw new Error('Potager not found')
    }
    const plantations = await Plantation.query()
      .where('id_potager', idPotager)
      .select('name', 'state', 'idPlante', 'dateArrosage', 'createdAt')
      .preload('plante', (query) => {
        query.select('icon', 'delai_arrosage', 'name', 'delai_recolte')
      })
    const today = DateTime.now()
    const plantationsFormatted = await Promise.all(
      plantations.map(async (plante) => {
        const dateRecolte = plante.createdAt
          .plus({ days: plante.plante.delai_recolte })
          .toFormat('dd/MM/yyyy')
        if (plante.state === 0) {
          const delaiArrosage = plante.plante.delai_arrosage
          if (!delaiArrosage) {
            throw new Error('Plante not found')
          }

          if (plante.dateArrosage < today.minus({ days: delaiArrosage })) {
            plante.state = 1
            await Plantation.query().where('idPlante', plante.idPlante).update({ state: 1 })
          }
          return {
            name: plante.name,
            state: plante.state,
            icon: plante.plante.icon,
            plantename: plante.plante.name,
            recolte: dateRecolte,
          }
        } else {
          return {
            name: plante.name,
            state: plante.state,
            icon: plante.plante.icon,
            plantename: plante.plante.name,
            recolte: dateRecolte,
          }
        }
      })
    )
    return view.render('admin/monpotager/show', { potager, plantations: plantationsFormatted })
  }

  async handleUpdate({ response, session }: HttpContext) {
    session.flash({ notification: 'Potager mis à jour avec succès' })
    response.redirect().toRoute('admin/monpotager')
  }

  async handleDelete({ request, response, auth }: HttpContext) {
    const potager = await Potager.findOrFail(request?.param('idPotager'))

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
