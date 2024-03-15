import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Tache extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare idCreateur: string

  @column()
  declare idRealisateur: string

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
