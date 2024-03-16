import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Plante from '#models/plante'
import * as relations from '@adonisjs/lucid/types/relations'

export default class Plantation extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare idPlante: string

  @belongsTo(() => Plante, {
    foreignKey: 'idPlante',
  })
  declare plante: relations.BelongsTo<typeof Plante>

  @column()
  declare idPotager: string

  @column()
  declare name: string

  @column()
  declare state: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare dateArrosage: DateTime
}
