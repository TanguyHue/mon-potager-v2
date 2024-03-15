import Potager from '#models/potager'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    const user1 = await User.findBy('email', 'thue@thue.fr')
    const user2 = await User.findBy('email', 'thue1@thue.fr')
    await Potager.createMany([
      {
        name: 'Potager #1',
        description: 'Potager de Thue',
        user_id: user1?.id,
      },
      {
        name: 'Potager #1',
        description: 'Potager de Thue1',
        user_id: user2?.id,
      },
    ])
  }
}
