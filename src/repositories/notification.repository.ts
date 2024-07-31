import { BaseRepository } from './base.repository'

import { INotification } from '@/@types'
import { supabase } from '@/config/supabase'

export class NotificationRepository extends BaseRepository<INotification> {
  constructor() {
    super('notifications')
  }

  async create(
    record: Omit<INotification, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<INotification> {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert([record])
      .select('*')
      .single<INotification>()

    if (error) throw error
    return data
  }

  async findByUserId(userId: number | string): Promise<INotification[] | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .order('created_at', { ascending: false })
      .eq('user_id', userId)
      .returns<INotification[]>()

    if (error) throw error
    return data ?? null
  }
}
