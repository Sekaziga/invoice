import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'clients'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')

      table.string('name').notNullable()
      table.string('email').notNullable()
      table.string('phone').nullable()
      table.text('address').nullable()

      // ✅ ADD TIMESTAMPS ONLY ONCE
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
