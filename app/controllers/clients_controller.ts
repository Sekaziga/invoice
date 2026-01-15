import Client from '#models/client'
import type { HttpContext } from '@adonisjs/core/http'

export default class ClientsController {
  // Get all clients for logged-in user
  public async index({ auth }: HttpContext) {
    return Client.query().where('user_id', auth.user!.id)
  }

  // Create new client
  public async store({ auth, request }: HttpContext) {
    const data = request.only([
      'name',
      'email',
      'phone',
      'address',
      'id', // Added id
      'user_id', // Added user_id
    ])

    const client = await Client.create({
      ...data,
      userId: auth.user!.id,
    })

    return client
  }
}
