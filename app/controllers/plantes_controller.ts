import DemandeChangement from '#models/demande_changement'
import Plante from '#models/plante'
import User from '#models/user'
import { createDemandeChangementValidator } from '#validators/demande_changement'
import { createPlanteValidator, updatePlanteValidator } from '#validators/plante'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { unlink } from 'node:fs'

export default class PlantesController {
  async index({ view }: HttpContext) {
    const plantes = await Plante.query().orderBy('name', 'asc')
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

  async handleUpdate({ request, response, auth }: HttpContext) {
    const userId = auth.user?.id
    const plante = await Plante.findOrFail(request.param('id'))

    if (plante.user_id !== userId) {
      const param = await request.validateUsing(updatePlanteValidator, {
        meta: {
          planteId: request.param('id'),
        },
      })

      for (let [key, value] of Object.entries(param)) {
        if (plante.$attributes[key] === value) {
          continue
        }

        let demande
        if (key === 'icon') {
          if (value instanceof MultipartFile) {
            await value.move(app.makePath('public/plantes/'), {
              name: `${cuid()}.${value.extname}`,
            })
            const path = `/plantes/${value.fileName}`
            demande = {
              user_creatorId: userId,
              user_targetId: plante.user_id,
              planteId: plante.id,
              status: 0,
              field: key,
              old_value: plante.icon,
              new_value: path,
            }
          } else {
            throw new Error('Invalid icon')
          }
        } else {
          demande = {
            user_creatorId: userId,
            user_targetId: plante.user_id,
            planteId: plante.id,
            status: 0,
            field: key,
            old_value: plante.$attributes[key].toString(),
            new_value: value?.toString() || '',
          }
        }

        createDemandeChangementValidator.validate(demande)

        if (
          await DemandeChangement.query()
            .where('field', key)
            .where('user_targetId', plante.user_id)
            .where('user_creatorId', userId)
            .where('plante_id', plante.id)
            .first()
        ) {
          if (demande.field === 'icon') {
            const lastIcon = await DemandeChangement.query()
              .where('field', 'icon')
              .where('user_targetId', plante.user_id)
              .where('user_creatorId', userId)
              .where('plante_id', plante.id)
              .select('new_value')

            if (lastIcon) {
              unlink(app.makePath(`public${lastIcon[0].new_value}`), (err) => {
                if (err) throw err
                console.log('path/file.txt was deleted')
              })
            }
          }
          await DemandeChangement.query()
            .where('field', key)
            .where('user_targetId', plante.user_id)
            .where('user_creatorId', userId)
            .where('plante_id', plante.id)
            .update(demande)
        } else {
          await DemandeChangement.create(demande)
        }
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { name, icon, delai_recolte } = await request.validateUsing(updatePlanteValidator, {
        meta: {
          planteId: request.param('id'),
        },
      })
      if (icon) {
        await icon.move(app.makePath('public/plantes/'), {
          name: `${cuid()}.${icon.extname}`,
        })
      }

      const path = `/plantes/${icon ? icon.fileName : 'default.png'}`
      plante.name = name?.toString() || plante.name
      plante.icon = icon ? path : plante.icon
      plante.delai_recolte = delai_recolte || plante.delai_recolte
      plante.save()
    }
    response.redirect().toRoute('admin.plantes.index')
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
