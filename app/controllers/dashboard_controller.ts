import type { HttpContext } from '@adonisjs/core/http'
import Invoice from '#models/invoice'

export default class DashboardController {
  public async index({ inertia }: HttpContext) {
    const totalInvoicesResult = await Invoice.query().count('* as total').firstOrFail()
    const paidInvoicesResult = await Invoice.query()
      .where('status', 'paid')
      .count('* as total')
      .firstOrFail()
    const overdueInvoicesResult = await Invoice.query()
      .where('status', '!=', 'paid')
      .where('due_date', '<', new Date())
      .count('* as total')
      .firstOrFail()

    const totalInvoices = Number(totalInvoicesResult.$extras.total)
    const paidInvoices = Number(paidInvoicesResult.$extras.total)
    const overdueInvoices = Number(overdueInvoicesResult.$extras.total)

    return inertia.render('dashboard', {
      totalInvoices,
      paidInvoices,
      overdueInvoices,
    })
  }
}
