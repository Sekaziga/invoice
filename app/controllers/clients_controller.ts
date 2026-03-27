import Client from '#models/client'
import type { HttpContext } from '@adonisjs/core/http'

type ClientListItem = {
  id: number
  name: string
  email: string
  phone: string | null
  address: string | null
}

type ClientInvoiceItem = {
  id: number
  amount: number
  dueDate: string | null
  status: string
}

type ClientDetail = ClientListItem & {
  invoices: ClientInvoiceItem[]
}

function serializeClient(client: Client): ClientListItem {
  return {
    id: client.id,
    name: client.name,
    email: client.email,
    phone: client.phone,
    address: client.address,
  }
}

function serializeClientDetail(client: Client): ClientDetail {
  return {
    ...serializeClient(client),
    invoices: client.invoices.map((invoice) => ({
      id: invoice.id,
      amount: invoice.amount,
      dueDate: invoice.dueDate ? invoice.dueDate.toISODate() : null,
      status: invoice.status,
    })),
  }
}

export default class ClientsController {
  // Get all clients for logged-in user
  public async index({ inertia }: HttpContext) {
    const clients = await Client.all()

    return inertia.render('Clients/Index', {
      clients: clients.map(serializeClient),
    })
  }

  public async create({ inertia }: HttpContext) {
    return inertia.render('Clients/Edit', { client: null })
  }

  // Create new client
  public async store({ request, response }: HttpContext) {
    const data = request.only(['name', 'email', 'phone', 'address'])

    await Client.create(data)

    return response.redirect('/clients')
  }
  public async invoices({ params }: HttpContext) {
    const client = await Client.findOrFail(params.id)

    const invoices = await client.related('invoices').query()

    return invoices
  }
  public async show({ params, inertia }: HttpContext) {
    const client = await Client.findOrFail(params.id)

    await client.load('invoices')

    return inertia.render('Clients/Show', {
      client: serializeClientDetail(client),
    })
  }

  public async edit({ params, inertia }: HttpContext) {
    const client = await Client.findOrFail(params.id)

    return inertia.render('Clients/Edit', {
      client: serializeClient(client),
    })
  }

  public async update({ params, request, response }: HttpContext) {
    const client = await Client.findOrFail(params.id)

    const data = request.only(['name', 'email', 'phone', 'address'])

    client.merge(data)
    await client.save()

    return response.redirect('/clients')
  }

  public async destroy({ params, response }: HttpContext) {
    const client = await Client.findOrFail(params.id)

    await client.delete()

    return response.redirect('/clients')
  }
}
