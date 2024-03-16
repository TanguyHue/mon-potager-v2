import Plantation from '#models/plantation'
import Plante from '#models/plante'
import Potager from '#models/potager'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    const plantes = await Plante.all()

    if (!plantes.length) {
      return
    }

    const tomateId = plantes.find((plante) => plante.name === 'Tomate')?.id
    const carotteId = plantes.find((plante) => plante.name === 'Carotte')?.id
    const patateId = plantes.find((plante) => plante.name === 'Patate')?.id

    const potagerId = await Potager.query().select('id').where('name', 'Potager #1').first()
    await Plantation.createMany([
      {
        idPlante: tomateId,
        dateArrosage: DateTime.now().minus({ days: 20 }).toFormat('yyyy-MM-dd'),
        idPotager: potagerId?.id,
        name: 'Tomate',
      },
      {
        idPlante: carotteId,
        dateArrosage: DateTime.now().minus({ days: 10 }).toFormat('yyyy-MM-dd'),
        idPotager: potagerId?.id,
        name: 'Carotte',
        createdAt: DateTime.now().minus({ days: 120 }),
      },
      {
        idPlante: patateId,
        dateArrosage: DateTime.now().toFormat('yyyy-MM-dd'),
        idPotager: potagerId?.id,
        name: 'Patate',
      },
    ])
  }
}
