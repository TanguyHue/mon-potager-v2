import { BaseSeeder } from '@adonisjs/lucid/seeders'
import fs from 'node:fs'

export default class IndexSeeder extends BaseSeeder {
  private async seed(Seeder: { default: typeof BaseSeeder }) {
    await new Seeder.default(this.client).run()
  }

  private deleteFiles(imagePath: string) {
    fs.readdir(imagePath, (err, files) => {
      if (err) {
        console.error(err)
        return
      }

      files.forEach((file) => {
        if (file === 'default.png') {
          return
        }
        fs.unlink(`${imagePath}/${file}`, (errUnlink) => {
          if (errUnlink) {
            console.error(errUnlink)
            return
          }
          console.log(`${file} has been deleted`)
        })
      })
    })
  }

  async run() {
    const imagePath = 'public/plantes'
    this.deleteFiles(imagePath)
    const userPath = 'public/users'
    this.deleteFiles(userPath)
    await this.seed(await import('#database/seeders/user_seeder'))
    await this.seed(await import('#database/seeders/potager_seeder'))
    await this.seed(await import('#database/seeders/plante_seeder'))
    await this.seed(await import('#database/seeders/plantation_seeder'))
  }
}
