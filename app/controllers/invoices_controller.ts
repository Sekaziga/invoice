import type { HttpContext } from '@adonisjs/core/http'
import Invoice from '#models/invoice'
import Client from '#models/client'
import { DateTime } from 'luxon'

export default class InvoicesController {
  // GET /clients/:client_id/invoices
  public async index({ params, view }: HttpContext) {
    const client = await Client.findOrFail(params.client_id)
    await client.load('invoices')

    for (const invoice of client.invoices) {
      invoice.isOverdue = DateTime.now() > invoice.dueDate && invoice.status !== 'paid'
    }

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
  public async store({ params, request, response, session }: HttpContext) {
    const client = await Client.findOrFail(params.client_id)

    const data = request.only(['amount', 'dueDate', 'status'])

    // ✅ Validation
    const amount = Number.parseFloat(data.amount)

    if (Number.isNaN(amount)) {
      session.flash('error', 'Amount must be a valid number')
      return response.redirect().back()
    }

    if (amount <= 0) {
      session.flash('error', 'Amount must be greater than 0')
      return response.redirect().back()
    }

    if (amount > 9999999999.99) {
      session.flash('error', 'Amount is too large. Maximum allowed is 9,999,999,999.99')
      return response.redirect().back()
    }

    await client.related('invoices').create({
      amount: amount,
      status: data.status,
      dueDate: DateTime.fromISO(data.dueDate),
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

  // GET /overdue (all clients)
  public async overdueAll({ view }: HttpContext) {
    const overdueInvoices = await Invoice.query()
      .preload('client')
      .where('status', '!=', 'paid')
      .where('due_date', '<', DateTime.now().toSQL())
      .orderBy('due_date', 'asc')

    return view.render('pages/invoices/overdue_all', {
      invoices: overdueInvoices,
    })
  }

  // GET /clients/:client_id/invoices/overdue
  public async overdue({ params, view }: HttpContext) {
    const client = await Client.findOrFail(params.client_id)

    const overdueInvoices = await Invoice.query()
      .where('client_id', params.client_id)
      .where('status', '!=', 'paid')
      .where('due_date', '<', DateTime.now().toSQL())
      .orderBy('due_date', 'asc')

    return view.render('pages/invoices/overdue', {
      client,
      invoices: overdueInvoices,
    })
  }
}
