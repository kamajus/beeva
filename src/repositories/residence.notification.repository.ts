import { BaseRepository } from './base.repository'

import { IResidenceNotification } from '@/assets/@types'
import { supabase } from '@/config/supabase'

export class ResidenceNotificationRepository extends BaseRepository<IResidenceNotification> {
  constructor() {
    super('residence_notifications')
  }

  async findByNotificationId(
    userId: number | string,
  ): Promise<IResidenceNotification | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('notification_id', userId)
      .single<IResidenceNotification>()

    if (error) throw error
    return data ?? null
  }
}
