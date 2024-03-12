import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Tache extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare idCreateur: number

  @column()
  declare idRealisateur: number

  @column()
  declare titre: string

  @column()
  declare date: DateTime

  @column()
  declare etat: number

  @column()
  declare note: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
