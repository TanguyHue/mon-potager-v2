import Plante from '#models/plante'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Plante.createMany([
      {
        name: 'Tomate',
        icon: '/plantes/default.png',
        delai_recolte: 50,
        user_id: 1,
      },
      {
        name: 'Carotte',
        icon: '/plantes/default.png',
        delai_recolte: 50,
        user_id: 1,
      },
      {
        name: 'Salade',
        icon: '/plantes/default.png',
        delai_recolte: 50,
        user_id: 2,
      },
    ])
  }
}
