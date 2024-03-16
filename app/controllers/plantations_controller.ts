import type { HttpContext } from '@adonisjs/core/http'
import Plante from '#models/plante'

export default class PlantationsController {
  /**
   * Display form to create a new record
   */
  async create({ request, view }: HttpContext) {
    const idPotager = await request.param('idPotager')

    if (!idPotager) {
      throw new Error('Potager not found')
    }

    const plantes = await Plante.query().select('name').orderBy('name', 'asc')
    const names = plantes.map((plante) => plante.name)

    return view.render('admin/plantations/create', { idPotager: idPotager, plantes: names })
  }
}
