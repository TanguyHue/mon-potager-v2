import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Potager from '#models/potager'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Plante extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_id: number

  @column()
  declare name: string

  @column()
  declare icon: string

  @column()
  declare delai_recolte: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Potager)
  declare potagers: HasMany<typeof Potager>
}
