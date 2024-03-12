import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'taches'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('id_createur')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table
        .integer('id_realisateur')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table.string('titre').notNullable()
      table.timestamp('date').notNullable()
      table.integer('etat').notNullable().defaultTo(0).checkIn(['0', '1'])
      table.string('note').notNullable().defaultTo('')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
