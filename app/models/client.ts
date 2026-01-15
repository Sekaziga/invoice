import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Client extends BaseModel {
  @column({ isPrimary: true })
  public id: number | null = null

  @column()
  public userId: number | null = null

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
}
