import DemandeChangement from '#models/demande_changement'
import Plante from '#models/plante'
import type { HttpContext } from '@adonisjs/core/http'
import { unlink } from 'node:fs'

export default class DemandesController {
  async index({ view, auth }: HttpContext) {
    const userId = auth.user?.id
    if (!userId) {
      return 'User not found'
    }
    const demandesRecues = await DemandeChangement.query()
      .preload('plante')
      .preload('user_creator', (query) => {
        query.select('username')
      })
      .preload('plante', (query) => {
        query.select('name', 'icon')
      })
      .select(
        'id',
        'field',
        'old_value',
        'new_value',
        'status',
        'updated_at',
        'user_creatorId',
        'planteId',
        'status',
        'show_creator',
        'show_target'
      )
      .where('user_targetId', userId)
      .where('show_target', 1)
      .orderBy('status', 'asc')
      .orderBy('updated_at', 'asc')

    const demandesRecuesFormatted = demandesRecues.map((demande) => {
      return {
        id: demande.id,
        field: demande.field,
        old_value: demande.old_value,
        new_value: demande.new_value,
        status: demande.status,
        updated_at: demande.updatedAt.toFormat('dd/MM/yyyy'),
        user_creator: demande.user_creator.username,
        plante: demande.plante.name,
        icon: demande.plante.icon,
        show_creator: demande.show_creator,
        show_target: demande.show_target,
      }
    })

    const demandesEnvoyees = await DemandeChangement.query()
      .preload('plante')
      .preload('user_target', (query) => {
        query.select('username')
      })
      .preload('plante', (query) => {
        query.select('name', 'icon')
      })
      .select(
        'id',
        'field',
        'old_value',
        'new_value',
        'status',
        'updated_at',
        'user_targetId',
        'planteId',
        'status',
        'show_creator',
        'show_target'
      )
      .where('user_creatorId', userId)
      .where('show_creator', 1)
      .orderBy('status', 'desc')
      .orderBy('updated_at', 'asc')

    const demandesEnvoyeesFormatted = demandesEnvoyees.map((demande) => {
      return {
        id: demande.id,
        field: demande.field,
        old_value: demande.old_value,
        new_value: demande.new_value,
        status: demande.status,
        updated_at: demande.updatedAt.toFormat('dd/MM/yyyy'),
        user_target: demande.user_target.username,
        plante: demande.plante.name,
        icon: demande.plante.icon,
        show_creator: demande.show_creator,
        show_target: demande.show_target,
      }
    })

    return view.render('admin/demandes/index', {
      demandesRecues: demandesRecuesFormatted,
      demandesEnvoyees: demandesEnvoyeesFormatted,
    })
  }

  async actionDemande({ request, response, auth }: HttpContext) {
    const demande = await DemandeChangement.find(request.input('id'))
    if (!demande) {
      return response.status(404).send('Demande not found')
    }

    const user = auth.user?.id
    if (user !== demande.user_targetId && user !== demande.user_creatorId) {
      return response.status(403).send('Unauthorized')
    }

    if (request.input('accept') && user === demande.user_targetId) {
      demande.status = 1
      demande.save()

      const plante = await Plante.find(demande.planteId)
      if (!plante) {
        return response.status(404).send('Plante not found')
      }

      plante.$attributes[demande.field] = demande.new_value
      await plante.save()
    }

    if (request.input('reject') && user === demande.user_targetId) {
      demande.status = 2
      demande.save()
    }

    if (request.input('delete')) {
      return this.handleHide({ request, response, auth } as HttpContext)
    }

    return response.redirect().toRoute('admin.demandes')
  }

  async handleHide({ request, response, auth }: HttpContext) {
    const demande = await DemandeChangement.find(request.input('id'))
    if (!demande) {
      return response.status(404).send('Demande not found')
    }

    const user = auth.user?.id
    if (user === demande.user_creatorId) {
      demande.show_creator = 0

      if (demande.show_target === 0) {
        if (demande.field === 'icon' && demande.old_value !== '/plantes/default.png') {
          unlink(`public${demande.old_value}`, (err) => {
            if (err) {
              console.error(err)
            }
          })
        }

        if (
          demande.field === 'icon' &&
          demande.new_value !== '/plantes/default.png' &&
          demande.status === 2
        ) {
          unlink(`public${demande.new_value}`, (err) => {
            if (err) {
              console.error(err)
            }
          })
        }
        demande.delete()
      } else {
        demande.save()
      }
    } else if (user === demande.user_targetId) {
      demande.show_target = 0

      if (demande.show_creator === 0) {
        if (
          demande.field === 'icon' &&
          demande.new_value !== '/plantes/default.png' &&
          demande.status === 2
        ) {
          unlink(`public${demande.new_value}`, (err) => {
            if (err) {
              console.error(err)
            }
          })
        }
        demande.delete()
      } else {
        demande.save()
      }
    } else {
      return response.status(403).send('Unauthorized')
    }

    return response.redirect().toRoute('admin.demandes')
  }
}
