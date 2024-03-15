import Plante from '#models/plante'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const user1 = await User.findBy('email', 'thue@thue.fr')
    const user2 = await User.findBy('email', 'thue1@thue.fr')
    await Plante.createMany([
      {
        name: 'Tomate',
        icon: '/plantes/default.png',
        delai_recolte: 50,
        user_id: user1?.id,
      },
      {
        name: 'Carotte',
        icon: '/plantes/default.png',
        delai_recolte: 60,
        user_id: user2?.id,
      },
      {
        name: 'Patate',
        icon: '/plantes/default.png',
        delai_recolte: 70,
        user_id: user1?.id,
      },
    ])
  }
}
