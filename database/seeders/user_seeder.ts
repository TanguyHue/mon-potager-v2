import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        username: 'thue',
        email: 'thue@thue.fr',
        password: 'aaaaaaaa',
        thumbnail: '/users/thue.png',
      },
      {
        username: 'thue1',
        email: 'thue1@thue.fr',
        password: 'aaaaaaaa',
        thumbnail: '/users/thue.png',
      },
    ])
  }
}
