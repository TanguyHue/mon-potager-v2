import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'potagers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('x').notNullable()
      table.integer('y').notNullable()
      table
        .integer('plante_id')
        .notNullable()
        .references('id')
        .inTable('plantes')
        .onDelete('CASCADE')
      table
        .integer('user_id')
        .notNullable()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
