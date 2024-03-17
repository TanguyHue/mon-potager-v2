import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class AdminController {
  index({ view }: HttpContext) {
    return view.render('admin/dashboard')
  }

  agenda({ view }: HttpContext) {
    const date = new Date()
    const day = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()

    const firstDayOfMonth = new Date(year, month, 1).getDay()
    const numberDaysInMonth = DateTime.fromObject({ year, month: month + 1 }).daysInMonth

    if (!numberDaysInMonth) {
      throw new Error('Invalid month')
    }

    console.log(firstDayOfMonth, numberDaysInMonth)

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

    console.log(days)

    const today = `${year}-${month + 1}-${day}`
    return view.render('admin/agenda/index', { today, days })
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
