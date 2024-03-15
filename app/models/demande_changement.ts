import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Plante from './plante.js'
import * as relations from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class DemandeChangement extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare user_creatorId: string

  @belongsTo(() => User, {
    foreignKey: 'user_creatorId',
  })
  declare user_creator: relations.BelongsTo<typeof User>

  @column()
  declare user_targetId: string

  @belongsTo(() => User, {
    foreignKey: 'user_targetId',
  })
  declare user_target: relations.BelongsTo<typeof User>

  @column()
  declare planteId: string

  @belongsTo(() => Plante)
  declare plante: relations.BelongsTo<typeof Plante>

  @column()
  declare status: number

  @column()
  declare field: string

  @column()
  declare old_value: string

  @column()
  declare new_value: string

  @column()
  declare show_creator: number

  @column()
  declare show_target: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
