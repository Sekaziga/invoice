import type { HttpContext } from '@adonisjs/core/http'
import Invoice from '#models/invoice'
import Client from '#models/client'
import { DateTime } from 'luxon'

type ClientSummary = {
  id: number
  name: string
}

type InvoiceItemPayload = {
  id: number
  description: string
  quantity: number
  unitPrice: number
}

type InvoicePayload = {
  id: number
  clientId: number
  total: number
  items: InvoiceItemPayload[]
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

  const items: InvoiceItemPayload[] = (invoice.items ?? []).map((item) => ({
    id: item.id,
    description: item.description,
    quantity: Number(item.quantity),
    unitPrice: Number(item.unitPrice),
  }))

  const total = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)

  return {
    id: invoice.id,
    clientId: invoice.clientId,
    total,
    items,
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

async function findOwnedClientOrFail(clientId: number, userId: number) {
  return Client.query().where('id', clientId).where('user_id', userId).firstOrFail()
}

async function findOwnedInvoiceOrFail(invoiceId: number, userId: number) {
  return Invoice.query()
    .where('id', invoiceId)
    .whereHas('client', (query) => query.where('user_id', userId))
    .preload('client')
    .preload('items')
    .firstOrFail()
}

export default class InvoicesController {
  // GET /invoices (all clients)
  public async all({ auth, inertia }: HttpContext) {
    const invoices = await Invoice.query()
      .whereHas('client', (query) => query.where('user_id', auth.user!.id))
      .preload('client')
      .preload('items')
      .orderBy('created_at', 'desc')

    return inertia.render('Invoices/All', {
      invoices: invoices.map((invoice) => ({
        ...serializeInvoice(invoice),
        client: serializeClient(invoice.client),
      })),
    })
  }

  // GET /clients/:client_id/invoices
  public async index({ auth, params, inertia }: HttpContext) {
    const client = await findOwnedClientOrFail(params.client_id, auth.user!.id)

    const invoices = await Invoice.query()
      .where('client_id', client.id)
      .preload('items')
      .orderBy('created_at', 'desc')

    return inertia.render('Invoices/Index', {
      client: serializeClient(client),
      invoices: invoices.map(serializeInvoice),
    })
  }

  // GET /clients/:client_id/invoices/create
  public async create({ auth, params, inertia }: HttpContext) {
    const client = await findOwnedClientOrFail(params.client_id, auth.user!.id)

    return inertia.render('Invoices/Edit', {
      client: serializeClient(client),
      invoice: null,
    })
  }

  // POST /clients/:client_id/invoices
  public async store({ auth, params, request, response }: HttpContext) {
    const client = await findOwnedClientOrFail(params.client_id, auth.user!.id)

    const data = request.only(['dueDate', 'status', 'items'])

    const invoice = await client.related('invoices').create({
      status: data.status,
      dueDate: DateTime.fromISO(data.dueDate),
    })

    const items = Array.isArray(data.items) ? data.items : []
    for (const item of items) {
      const quantity = Number.parseFloat(item.quantity)
      const unitPrice = Number.parseFloat(item.unitPrice)
      if (!item.description || Number.isNaN(quantity) || Number.isNaN(unitPrice)) continue
      await invoice.related('items').create({
        description: String(item.description).trim(),
        quantity,
        unitPrice,
      })
    }

    return response.redirect(`/clients/${client.id}/invoices/${invoice.id}`)
  }

  // GET /clients/:client_id/invoices/:id
  public async show({ auth, params, inertia }: HttpContext) {
    const invoice = await findOwnedInvoiceOrFail(params.id, auth.user!.id)

    return inertia.render('Invoices/Show', {
      client: serializeClient(invoice.client),
      invoice: serializeInvoice(invoice),
    })
  }

  // GET /clients/:client_id/invoices/:id/edit
  public async edit({ auth, params, inertia }: HttpContext) {
    const invoice = await findOwnedInvoiceOrFail(params.id, auth.user!.id)

    return inertia.render('Invoices/Edit', {
      client: serializeClient(invoice.client),
      invoice: serializeInvoice(invoice),
    })
  }

  // PUT /clients/:client_id/invoices/:id
  public async update({ auth, params, request, response }: HttpContext) {
    const invoice = await findOwnedInvoiceOrFail(params.id, auth.user!.id)

    const data = request.only(['dueDate', 'status', 'items'])

    invoice.merge({
      status: data.status,
      dueDate: DateTime.fromISO(data.dueDate),
    })
    await invoice.save()

    // Replace all items
    await invoice.related('items').query().delete()
    const items = Array.isArray(data.items) ? data.items : []
    for (const item of items) {
      const quantity = Number.parseFloat(item.quantity)
      const unitPrice = Number.parseFloat(item.unitPrice)
      if (!item.description || Number.isNaN(quantity) || Number.isNaN(unitPrice)) continue
      await invoice.related('items').create({
        description: String(item.description).trim(),
        quantity,
        unitPrice,
      })
    }

    return response.redirect(`/clients/${invoice.clientId}/invoices/${invoice.id}`)
  }

  // DELETE /clients/:client_id/invoices/:id
  public async destroy({ auth, params, response }: HttpContext) {
    const invoice = await findOwnedInvoiceOrFail(params.id, auth.user!.id)
    const clientId = invoice.clientId

    await invoice.delete()

    return response.redirect(`/clients/${clientId}/invoices`)
  }

  // GET /overdue (all clients)
  public async overdueAll({ auth, inertia }: HttpContext) {
    const overdueInvoices = await Invoice.query()
      .whereHas('client', (query) => query.where('user_id', auth.user!.id))
      .preload('client')
      .preload('items')
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
  public async overdue({ auth, params, inertia }: HttpContext) {
    const client = await findOwnedClientOrFail(params.client_id, auth.user!.id)

    const overdueInvoices = await Invoice.query()
      .where('client_id', client.id)
      .preload('items')
      .where('status', '!=', 'paid')
      .where('due_date', '<', DateTime.now().toSQL())
      .orderBy('due_date', 'asc')

    return inertia.render('Invoices/Overdue', {
      client: serializeClient(client),
      invoices: overdueInvoices.map(serializeOverdueInvoice),
    })
  }
}
