import vine from '@vinejs/vine'

export const invoiceItemValidator = vine.compile(
  vine.object({
    description: vine.string().trim().minLength(1).maxLength(255),
    quantity: vine.number().positive().max(9999),
    unitPrice: vine.number().positive().max(9999999999),
  })
)
