import mail from '@adonisjs/mail/services/main'
import Invoice from '#models/invoice'

export default class InvoiceReminderNotification {
  constructor(private invoice: Invoice) {}

  public async send(recipient: { email: string; name?: string }) {
    const items = this.invoice.items ?? []
    const total = items.reduce((sum, item) => sum + Number(item.quantity) * Number(item.unitPrice), 0)

    await mail.send((message) => {
      message
        .to(recipient.email)
        .subject('Invoice Payment Reminder')
        .htmlView('mails/invoice_reminder', {
          invoice: this.invoice,
          client: this.invoice.client,
          total,
        })
    })
  }
}
