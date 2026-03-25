import type { HttpContext } from '@adonisjs/core/http'
import Invoice from '#models/invoice'

export default class DashboardController {
  public async index({ view }: HttpContext) {
    const totalInvoices = await Invoice.query().count('* as total')
    const paidInvoices = await Invoice.query().where('status', 'paid').count('* as total')
    const overdueInvoices = await Invoice.query()
      .where('status', '!=', 'paid')
      .where('due_date', '<', new Date())
      .count('* as total')

    return view.render('pages/dashboard', {
      total: totalInvoices[0].$extras.total,
      paid: paidInvoices[0].$extras.total,
      overdue: overdueInvoices[0].$extras.total,
    })
  }
}
