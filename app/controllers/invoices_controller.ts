import type { HttpContext } from '@adonisjs/core/http'
import Invoice from '#models/invoice'
import Client from '#models/client'
import { DateTime } from 'luxon'

type ClientSummary = {
  id: number
  name: string
}

type InvoicePayload = {
  id: number
  clientId: number
  amount: number
  dueDate: string | null
  status: string
  isOverdue: boolean
  createdAt: string | null
  updatedAt: string | null
}

type OverdueInvoicePayload = InvoicePayload & {
  daysLate: number
  client?: ClientSummary
}

function serializeClient(client: Client): ClientSummary {
  return {
    id: client.id,
    name: client.name,
  }
}

function serializeInvoice(invoice: Invoice): InvoicePayload {
  const now = DateTime.now()
  const isOverdue = now > invoice.dueDate && invoice.status !== 'paid'

  return {
    id: invoice.id,
    clientId: invoice.clientId,
    amount: invoice.amount,
    dueDate: invoice.dueDate ? invoice.dueDate.toISODate() : null,
    status: invoice.status,
    isOverdue,
    createdAt: invoice.createdAt ? invoice.createdAt.toISO() : null,
    updatedAt: invoice.updatedAt ? invoice.updatedAt.toISO() : null,
  }
}

function serializeOverdueInvoice(invoice: Invoice): OverdueInvoicePayload {
  const serialized = serializeInvoice(invoice)
  const dueDate = invoice.dueDate
  const daysLate = dueDate ? Math.max(0, Math.floor(DateTime.now().diff(dueDate, 'days').days)) : 0

  return {
    ...serialized,
    daysLate,
  }
}

export default class InvoicesController {
  // GET /invoices (all clients)
  public async all({ inertia }: HttpContext) {
    const invoices = await Invoice.query().preload('client').orderBy('created_at', 'desc')

    return inertia.render('Invoices/All', {
      invoices: invoices.map((invoice) => ({
        ...serializeInvoice(invoice),
        client: serializeClient(invoice.client),
      })),
    })
  }

  // GET /clients/:client_id/invoices
  public async index({ params, inertia }: HttpContext) {
    const client = await Client.findOrFail(params.client_id)
    await client.load('invoices')

    return inertia.render('Invoices/Index', {
      client: serializeClient(client),
      invoices: client.invoices.map(serializeInvoice),
    })
  }

  // GET /clients/:client_id/invoices/create
  public async create({ params, inertia }: HttpContext) {
    const client = await Client.findOrFail(params.client_id)

    return inertia.render('Invoices/Edit', {
      client: serializeClient(client),
      invoice: null,
    })
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
  public async show({ params, inertia }: HttpContext) {
    const invoice = await Invoice.findOrFail(params.id)
    await invoice.load('client')

    return inertia.render('Invoices/Show', {
      client: serializeClient(invoice.client),
      invoice: serializeInvoice(invoice),
    })
  }

  // GET /clients/:client_id/invoices/:id/edit
  public async edit({ params, inertia }: HttpContext) {
    const invoice = await Invoice.findOrFail(params.id)
    await invoice.load('client')

    return inertia.render('Invoices/Edit', {
      client: serializeClient(invoice.client),
      invoice: serializeInvoice(invoice),
    })
  }

  // PUT /clients/:client_id/invoices/:id
  public async update({ params, request, response, session }: HttpContext) {
    const invoice = await Invoice.findOrFail(params.id)

    const data = request.only(['amount', 'dueDate', 'status'])
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

    invoice.merge({
      amount,
      status: data.status,
      dueDate: DateTime.fromISO(data.dueDate),
    })
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
  public async overdueAll({ inertia }: HttpContext) {
    const overdueInvoices = await Invoice.query()
      .preload('client')
      .where('status', '!=', 'paid')
      .where('due_date', '<', DateTime.now().toSQL())
      .orderBy('due_date', 'asc')

    return inertia.render('Invoices/OverdueAll', {
      invoices: overdueInvoices.map((invoice) => ({
        ...serializeOverdueInvoice(invoice),
        client: serializeClient(invoice.client),
      })),
    })
  }

  // GET /clients/:client_id/invoices/overdue
  public async overdue({ params, inertia }: HttpContext) {
    const client = await Client.findOrFail(params.client_id)

    const overdueInvoices = await Invoice.query()
      .where('client_id', params.client_id)
      .where('status', '!=', 'paid')
      .where('due_date', '<', DateTime.now().toSQL())
      .orderBy('due_date', 'asc')

    return inertia.render('Invoices/Overdue', {
      client: serializeClient(client),
      invoices: overdueInvoices.map(serializeOverdueInvoice),
    })
  }
}
