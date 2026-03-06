import type { HttpContext } from '@adonisjs/core/http'
import Invoice from '#models/invoice'
import Client from '#models/client'
import { DateTime } from 'luxon'

export default class InvoicesController {
  // GET /clients/:client_id/invoices
  public async index({ params, view }: HttpContext) {
    const client = await Client.findOrFail(params.client_id)
    await client.load('invoices')

    return view.render('pages/invoices/index', {
      client,
      invoices: client.invoices,
    })
  }

  // GET /clients/:client_id/invoices/create
  public async create({ params, view }: HttpContext) {
    const client = await Client.findOrFail(params.client_id)
    return view.render('pages/invoices/create', { client })
  }

  // POST /clients/:client_id/invoices
  public async store({ params, request, response }: HttpContext) {
    const client = await Client.findOrFail(params.client_id)

    const data = request.only(['amount', 'dueDate', 'status'])

    await client.related('invoices').create({
      amount: data.amount,
      status: data.status,
      dueDate: DateTime.fromISO(data.dueDate), // ✅ FIX HERE
    })

    return response.redirect(`/clients/${client.id}/invoices`)
  }

  // GET /clients/:client_id/invoices/:id
  public async show({ params, view }: HttpContext) {
    const invoice = await Invoice.findOrFail(params.id)
    return view.render('pages/invoices/show', { invoice })
  }

  // GET /clients/:client_id/invoices/:id/edit
  public async edit({ params, view }: HttpContext) {
    const invoice = await Invoice.findOrFail(params.id)
    return view.render('pages/invoices/edit', { invoice })
  }

  // PUT /clients/:client_id/invoices/:id
  public async update({ params, request, response }: HttpContext) {
    const invoice = await Invoice.findOrFail(params.id)

    invoice.merge(request.only(['amount', 'dueDate', 'status']))
    await invoice.save()

    return response.redirect(`/clients/${invoice.clientId}/invoices`)
  }

  // DELETE /clients/:client_id/invoices/:id
  public async destroy({ params, response }: HttpContext) {
    const invoice = await Invoice.findOrFail(params.id)
    const clientId = invoice.clientId

    await invoice.delete()

    return response.redirect(`/clients/${clientId}/invoices`)
  }
}
