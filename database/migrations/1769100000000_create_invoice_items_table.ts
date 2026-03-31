import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'invoice_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('invoice_id')
        .unsigned()
        .references('id')
        .inTable('invoices')
        .onDelete('CASCADE')
      table.string('description', 255).notNullable()
      table.decimal('quantity', 10, 2).notNullable().defaultTo(1)
      table.decimal('unit_price', 15, 2).notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    // Data migration: convert existing invoice amounts into a single line item
    this.defer(async (db) => {
      const invoices = await db.from('invoices').select('id', 'amount').where('amount', '>', 0)

      for (const invoice of invoices) {
        await db.table('invoice_items').insert({
          invoice_id: invoice.id,
          description: 'Services',
          quantity: 1,
          unit_price: invoice.amount,
          created_at: new Date(),
          updated_at: new Date(),
        })
      }
    })

    // Drop the manual amount column from invoices
    this.schema.alterTable('invoices', (table) => {
      table.dropColumn('amount')
    })
  }

  async down() {
    // Re-add amount column
    this.schema.alterTable('invoices', (table) => {
      table.decimal('amount', 15, 2).notNullable().defaultTo(0)
    })

    // Restore amounts from item sums
    this.defer(async (db) => {
      const sums = await db
        .from('invoice_items')
        .select('invoice_id')
        .sum('unit_price * quantity as total')
        .groupBy('invoice_id')

      for (const row of sums) {
        await db
          .from('invoices')
          .where('id', row.invoice_id)
          .update({ amount: row.total ?? 0 })
      }
    })

    this.schema.dropTable(this.tableName)
  }
}
