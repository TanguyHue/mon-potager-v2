import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Plantation extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare idPlante: number

  @column()
  declare dateArrosage: DateTime

  @column()
  declare idPotager: number

  @column()
  declare name: string

  @column()
  declare state: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
