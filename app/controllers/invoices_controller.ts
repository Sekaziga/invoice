import type { HttpContextContract as HttpContext } from '@ioc:Adonis/Core/HttpContext'
import Client from '#models/client'
import Invoice from '#models/invoice'

export default class InvoicesController {
  public async index({ params, view }: HttpContext) {
    const client = await Client.findOrFail(params.client_id)
    await client.load('invoices')

    return view.render('pages/invoices/index', {
      client,
      invoices: client.invoices,
    })
  }

  public async store({ params, request, response }: HttpContext) {
    const client = await Client.findOrFail(params.client_id)

    const data = request.only(['amount', 'due_date', 'status'])

    await client.related('invoices').create(data)

    return response.redirect(`/clients/${client.id}/invoices`)
  }

  public async edit({ params, view }: HttpContext) {
    const invoice = await Invoice.findOrFail(params.id)
    await invoice.load('client')

    return view.render('pages/invoices/edit', { invoice })
  }

  public async update({ params, request, response }: HttpContext) {
    const invoice = await Invoice.findOrFail(params.id)

    invoice.merge(request.only(['amount', 'due_date', 'status']))
    await invoice.save()

    return response.redirect(`/clients/${invoice.client_id}/invoices`)
  }

  public async destroy({ params, response }: HttpContext) {
    const invoice = await Invoice.findOrFail(params.id)
    const clientId = invoice.client_id

    await invoice.delete()

    return response.redirect(`/clients/${clientId}/invoices`)
  }
}
