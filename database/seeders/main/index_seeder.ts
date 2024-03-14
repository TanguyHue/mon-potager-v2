import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class IndexSeeder extends BaseSeeder {
  private async seed(Seeder: { default: typeof BaseSeeder }) {
    await new Seeder.default(this.client).run()
  }

  async run() {
    await this.seed(await import('#database/seeders/user_seeder'))
    await this.seed(await import('#database/seeders/potager_seeder'))
    await this.seed(await import('#database/seeders/plante_seeder'))
  }
}
