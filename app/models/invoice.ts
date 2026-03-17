import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Client from '#models/client'

export default class Invoice extends BaseModel {
  // @column()
  // declare status: string

  declare isOverdue: boolean
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare public clientId: number

  @column()
  declare amount: number

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
}
