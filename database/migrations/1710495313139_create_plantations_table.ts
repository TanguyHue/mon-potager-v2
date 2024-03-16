import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'plantations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary().defaultTo(this.db.rawQuery('(UUID())').knexQuery)
      table.string('id_plante').references('id').inTable('plantes').onDelete('CASCADE')
      table.dateTime('date_arrosage').notNullable()
      table.string('id_potager').references('id').inTable('potagers').onDelete('CASCADE')
      table.string('name').notNullable()
      // 0: à arroser, 1: arrosé, 2: récolté
      table.integer('state').notNullable().checkIn(['0', '1', '2']).defaultTo('0')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
