import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Client from '#models/client'
import InvoiceItem from '#models/invoice_item'

export default class Invoice extends BaseModel {
  declare isOverdue: boolean

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare public clientId: number

  @column.dateTime()
  declare dueDate: DateTime

  @column()
  declare status: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Client)
  declare public client: BelongsTo<typeof Client>

  @hasMany(() => InvoiceItem)
  declare items: HasMany<typeof InvoiceItem>
}
