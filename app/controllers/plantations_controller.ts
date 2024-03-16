import type { HttpContext } from '@adonisjs/core/http'
import Plante from '#models/plante'
import { createPlantationValidator } from '#validators/plantation'
import Plantation from '#models/plantation'
import { DateTime } from 'luxon'

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

    return view.render('admin/plantations/create', {
      idPotager: idPotager,
      plantes: names,
    })
  }

  async handleCreate({ request, response }: HttpContext) {
    const idPotager = request.param('idPotager')
    const dateArrosage = DateTime.now().toFormat('yyyy-MM-dd')

    const { name, plante } = request.only(['name', 'plante'])
    const idPlante = await Plante.query().where('name', plante).select('id').first()

    const plantations = {
      id_potager: idPotager,
      id_plante: idPlante?.id,
      date_arrosage: dateArrosage,
      name,
    }

    await createPlantationValidator.validate(plantations)
    await Plantation.create(plantations)

    return response.redirect().toRoute('admin.monpotager.show', { idPotager })
  }
}
