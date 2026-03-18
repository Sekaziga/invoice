import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Invoice from '#models/invoice'
import InvoiceReminderNotification from '#mails/invoice_reminder_notification'

export default class Client extends BaseModel {
  @column({ isPrimary: true })
  declare public id: number

  // @column()
  // public userId: number | null = null

  @hasMany(() => Invoice)
  declare public invoices: HasMany<typeof Invoice>

  @column()
  public name: string = ''

  @column()
  public email: string = ''

  @column()
  public phone: string | null = null

  @column()
  public address: string | null = null

  @belongsTo(() => User)
  declare public user: BelongsTo<typeof User>

  public async notify(notification: InvoiceReminderNotification) {
    await notification.send(this)
  }
}
