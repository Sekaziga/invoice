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
}
