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
  total: number
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
      total: (invoice.items ?? []).reduce(
        (sum, item) => sum + Number(item.quantity) * Number(item.unitPrice),
        0
      ),
      dueDate: invoice.dueDate ? invoice.dueDate.toISODate() : null,
      status: invoice.status,
    })),
  }
}

async function findOwnedClientOrFail(clientId: number, userId: number) {
  return Client.query().where('id', clientId).where('user_id', userId).firstOrFail()
}

export default class ClientsController {
  // Get all clients for logged-in user
  public async index({ auth, inertia }: HttpContext) {
    const clients = await Client.query()
      .where('user_id', auth.user!.id)
      .orderBy('created_at', 'desc')

    return inertia.render('Clients/Index', {
      clients: clients.map(serializeClient),
    })
  }

  public async create({ inertia }: HttpContext) {
    return inertia.render('Clients/Edit', { client: null })
  }

  // Create new client
  public async store({ auth, request, response }: HttpContext) {
    const data = request.only(['name', 'email', 'phone', 'address'])

    await Client.create({
      ...data,
      userId: auth.user!.id,
    })

    return response.redirect('/clients')
  }

  public async invoices({ auth, params }: HttpContext) {
    const client = await findOwnedClientOrFail(params.id, auth.user!.id)

    const invoices = await client.related('invoices').query()

    return invoices
  }

  public async show({ auth, params, inertia }: HttpContext) {
    const client = await findOwnedClientOrFail(params.id, auth.user!.id)

    await client.load('invoices', (query) => query.preload('items'))

    return inertia.render('Clients/Show', {
      client: serializeClientDetail(client),
    })
  }

  public async edit({ auth, params, inertia }: HttpContext) {
    const client = await findOwnedClientOrFail(params.id, auth.user!.id)

    return inertia.render('Clients/Edit', {
      client: serializeClient(client),
    })
  }

  public async update({ auth, params, request, response }: HttpContext) {
    const client = await findOwnedClientOrFail(params.id, auth.user!.id)

    const data = request.only(['name', 'email', 'phone', 'address'])

    client.merge(data)
    await client.save()

    return response.redirect('/clients')
  }

  public async destroy({ auth, params, response }: HttpContext) {
    const client = await findOwnedClientOrFail(params.id, auth.user!.id)

    await client.delete()

    return response.redirect('/clients')
  }
}
