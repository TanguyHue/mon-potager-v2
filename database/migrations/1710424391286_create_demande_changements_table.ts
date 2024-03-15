import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'demande_changements'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary().defaultTo(this.db.rawQuery('(UUID())').knexQuery)
      table.string('user_creator_id').references('id').inTable('users').onDelete('CASCADE')
      table.string('user_target_id').references('id').inTable('users').onDelete('CASCADE')
      table.string('plante_id').references('id').inTable('plantes').onDelete('CASCADE')
      // 0: en attente, 1: accepté, 2: refusé
      table.integer('status').notNullable().checkIn(['0', '1', '2'])
      table.string('field').notNullable()
      table.string('old_value').notNullable()
      table.string('new_value').notNullable()
      // 0: ne pas montrer, 1: montrer
      table.integer('show_creator').notNullable().checkIn(['0', '1']).defaultTo('1')
      // 0: ne pas montrer, 1: montrer
      table.integer('show_target').notNullable().checkIn(['0', '1']).defaultTo('1')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
