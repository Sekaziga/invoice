import Client from '#models/client'
import type { HttpContext } from '@adonisjs/core/http'

export default class ClientsController {
  // Get all clients for logged-in user
  public async index({ view }: HttpContext) {
    const clients = await Client.all()
    return view.render('pages/clients/index', { clients })
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
  public async show({ params, view }: HttpContext) {
    const client = await Client.findOrFail(params.id)

    await client.load('invoices')

    return view.render('pages/clients/show', { client })
  }
  public async edit({ params, view }: HttpContext) {
    const client = await Client.findOrFail(params.id)

    return view.render('pages/clients/edit', { client })
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
