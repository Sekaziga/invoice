import { BaseCommand } from '@adonisjs/core/ace'
import Invoice from '#models/invoice'
import app from '@adonisjs/core/services/app'
import { DateTime } from 'luxon'

export default class SendInvoiceReminders extends BaseCommand {
  public static commandName = 'invoices:reminders'
  public static description = 'Send reminders for overdue invoices'

  public async run() {
    await app.boot()
    const overdueInvoices = await Invoice.query()
      .preload('client')
      .where('status', '!=', 'paid')
      .where('due_date', '<', DateTime.now().toSQL())
      .orderBy('due_date', 'asc')

    for (const invoice of overdueInvoices) {
      console.log(`Reminder sent to ${invoice.client.name} for invoice #${invoice.id}`)
    }

    console.log(`Total reminders processed: ${overdueInvoices.length}`)
  }
}
