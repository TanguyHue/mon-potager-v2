import Plantation from '#models/plantation'
import Potager from '#models/potager'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class AdminController {
  index({ view }: HttpContext) {
    return view.render('admin/dashboard')
  }

  async agenda({ view, auth }: HttpContext) {
    const date = new Date()
    const month = date.getMonth()
    const year = date.getFullYear()

    const firstDayOfMonth = new Date(year, month, 1).getDay()
    const numberDaysInMonth = DateTime.fromObject({ year, month: month + 1 }).daysInMonth

    if (!numberDaysInMonth) {
      throw new Error('Invalid month')
    }

    let days = []
    for (let i = 1; i < 7 * 5 + 1; i++) {
      if (i < firstDayOfMonth) {
        days.push('')
      } else if (i > numberDaysInMonth + firstDayOfMonth - 1) {
        days.push('')
      } else {
        days.push(i - firstDayOfMonth + 1)
      }
    }

    const idUser = auth.use('web').user?.id

    if (!idUser) {
      throw new Error('User not found')
    }

    const plantation = await Plantation.query()
      .preload('potager', (query) => {
        query.where('user_id', idUser)
      })
      .preload('plante')
      .select('createdAt', 'idPotager', 'idPlante', 'name')

    let plantationFiltered = plantation.map((plantationItem) => {
      if (plantationItem.$preloaded.potager !== null) {
        return plantationItem
      } else {
        return null
      }
    })

    plantationFiltered = plantationFiltered.filter((item) => item !== null)

    const dataPlantation = plantationFiltered.map((item) => {
      if (item !== null) {
        return {
          dateRecolte: item.createdAt
            .plus({ days: item.plante.delai_recolte })
            .toFormat(' dd/MM/yyyy'),
          icon: item.plante.icon,
          namePlantation: item.name,
          namePlante: item.plante.name,
          namePotager: item.potager.name,
          idPotager: item.potager.id,
        }
      }
    })

    return view.render('admin/agenda/index', { days, plantations: dataPlantation })
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
