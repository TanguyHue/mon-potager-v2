import { DateTime } from 'luxon'
import { withAuthFinder } from '@adonisjs/auth'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Tache from '#models/tache'
import Plante from '#models/plante'
import DemandeChangement from '#models/demande_changement'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare username: string | null

  @column()
  declare email: string

  @column()
  declare password: string

  @column()
  declare thumbnail: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => Tache)
  declare taches: HasMany<typeof Tache>

  @hasMany(() => Plante)
  declare plantes: HasMany<typeof Plante>

  @hasMany(() => DemandeChangement)
  declare demande_changements: HasMany<typeof DemandeChangement>
}
