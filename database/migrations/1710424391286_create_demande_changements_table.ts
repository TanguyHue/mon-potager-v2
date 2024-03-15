import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'demande_changements'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('user_creator_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table
        .integer('user_target_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.integer('plante_id').unsigned().references('id').inTable('plantes').onDelete('CASCADE')
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
