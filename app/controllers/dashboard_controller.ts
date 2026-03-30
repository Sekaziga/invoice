import type { HttpContext } from '@adonisjs/core/http'
import Client from '#models/client'
import Invoice from '#models/invoice'

export default class DashboardController {
  public async index({ auth, inertia }: HttpContext) {
    const scopeToUser = () => Client.query().select('id').where('user_id', auth.user!.id)

    const totalInvoicesResult = await Invoice.query()
      .whereIn('client_id', scopeToUser())
      .count('* as total')
      .firstOrFail()
    const paidInvoicesResult = await Invoice.query()
      .whereIn('client_id', scopeToUser())
      .where('status', 'paid')
      .count('* as total')
      .firstOrFail()
    const overdueInvoicesResult = await Invoice.query()
      .whereIn('client_id', scopeToUser())
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
