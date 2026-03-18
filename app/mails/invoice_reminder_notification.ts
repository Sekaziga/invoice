import mail from '@adonisjs/mail/services/main'
import Invoice from '#models/invoice'

export default class InvoiceReminderNotification {
  constructor(private invoice: Invoice) {}

  public async send(recipient: { email: string; name?: string }) {
    await mail.send((message) => {
      message
        .to(recipient.email)
        .subject('Invoice Payment Reminder')
        .htmlView('mails/invoice_reminder', {
          invoice: this.invoice,
          client: this.invoice.client,
        })
    })
  }
}
