import type { HttpContext } from '@adonisjs/core/http'
import Invoice from '#models/invoice'
import InvoiceItem from '#models/invoice_item'
import { invoiceItemValidator } from '#validators/invoice_item_validator'

async function findOwnedInvoiceOrFail(invoiceId: number, clientId: number, userId: number) {
  return Invoice.query()
    .where('id', invoiceId)
    .where('client_id', clientId)
    .whereHas('client', (query) => query.where('user_id', userId))
    .firstOrFail()
}

export default class InvoiceItemsController {
  // POST /clients/:client_id/invoices/:invoice_id/items
  public async store({ auth, params, request, response }: HttpContext) {
    const invoice = await findOwnedInvoiceOrFail(
      params.invoice_id,
      params.client_id,
      auth.user!.id
    )

    const data = await request.validateUsing(invoiceItemValidator)

    await invoice.related('items').create({
      description: data.description,
      quantity: data.quantity,
      unitPrice: data.unitPrice,
    })

    return response.redirect(`/clients/${params.client_id}/invoices/${invoice.id}`)
  }

  // PUT /clients/:client_id/invoices/:invoice_id/items/:id
  public async update({ auth, params, request, response }: HttpContext) {
    await findOwnedInvoiceOrFail(params.invoice_id, params.client_id, auth.user!.id)

    const item = await InvoiceItem.query()
      .where('id', params.id)
      .where('invoice_id', params.invoice_id)
      .firstOrFail()

    const data = await request.validateUsing(invoiceItemValidator)

    item.merge({
      description: data.description,
      quantity: data.quantity,
      unitPrice: data.unitPrice,
    })
    await item.save()

    return response.redirect(`/clients/${params.client_id}/invoices/${params.invoice_id}`)
  }

  // DELETE /clients/:client_id/invoices/:invoice_id/items/:id
  public async destroy({ auth, params, response }: HttpContext) {
    await findOwnedInvoiceOrFail(params.invoice_id, params.client_id, auth.user!.id)

    const item = await InvoiceItem.query()
      .where('id', params.id)
      .where('invoice_id', params.invoice_id)
      .firstOrFail()

    await item.delete()

    return response.redirect(`/clients/${params.client_id}/invoices/${params.invoice_id}`)
  }
}
