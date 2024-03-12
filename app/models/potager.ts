import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Potager extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare x: number

  @column()
  declare y: number

  @column()
  declare planteId: number

  @column()
  declare userId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
