import type { HttpContext } from '@adonisjs/core/http'
import Invoice from '#models/invoice'
import Client from '#models/client'

export default class InvoicesController {
  public async store({ params, request, response }: HttpContext) {
    const client = await Client.findOrFail(params.id)

    const data = request.only(['amount', 'due_date', 'status'])

    await client.related('invoices').create(data)

    return response.redirect(`/clients/${client.id}/invoices`)
  }
}
