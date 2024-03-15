import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'plantes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary().defaultTo(this.db.rawQuery('(UUID())').knexQuery)
      table.string('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.string('name').notNullable()
      table.string('icon').notNullable()
      table.integer('delai_recolte').notNullable()
      table.integer('delai_arrosage').notNullable().defaultTo(1)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
