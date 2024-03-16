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

  async show({ request, view }: HttpContext) {
    const idPotager = request.param('idPotager')
    const idPlantation = request.param('idPlantation')
    const plantation = await Plantation.query().where('id', idPlantation).preload('plante').first()

    const plantes = await Plante.query().select('name').orderBy('name', 'asc')
    const names = plantes.map((plante) => plante.name)

    if (!idPotager) {
      throw new Error('Potager not found')
    }

    const dates = {
      dateArrosage: plantation?.dateArrosage.toFormat('dd/MM/yyyy'),
      dateCreation: plantation?.createdAt.toFormat('dd/MM/yyyy'),
    }

    return view.render('admin/plantations/show', {
      idPotager: idPotager,
      plantation: plantation,
      plantes: names,
      dates,
    })
  }

  async handleUpdate({ request, response }: HttpContext) {
    const idPotager = request.param('idPotager')
    const idPlantation = request.param('idPlantation')

    const { name, dateArrosage } = request.only(['name', 'dateArrosage'])

    const plantation = await Plantation.findOrFail(idPlantation)
    plantation.name = name
    plantation.date_arrosage = dateArrosage
    await plantation.save()

    return response.redirect().toRoute('admin.monpotager.show', { idPotager })
  }

  async handleDelete({ request, response }: HttpContext) {
    const idPotager = request.param('idPotager')
    const idPlantation = request.param('idPlantation')

    const plantation = await Plantation.findOrFail(idPlantation)
    await plantation.delete()

    return response.redirect().toRoute('admin.monpotager.show', { idPotager })
  }

  async arrosage({ request, response }: HttpContext) {
    const idPlantation = request.param('idPlantation')
    console.log(idPlantation)

    const plantation = await Plantation.query().where('id', idPlantation).first()

    if (plantation) {
      plantation.dateArrosage = DateTime.now()
      plantation.state = 0
      await plantation.save()
    } else {
      return response.status(404).json({ message: 'Plantation not found' })
    }

    return response
      .status(200)
      .json({ dateArrosage: plantation.dateArrosage.toFormat('dd/MM/yyyy') })
  }
}
