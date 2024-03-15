import Potager from '#models/potager'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Potager.createMany([
      {
        name: 'Potager #1',
        description: 'Potager de Thue',
        user_id: 1,
      },
      {
        name: 'Potager #1',
        description: 'Potager de Thue1',
        user_id: 2,
      },
    ])
  }
}
