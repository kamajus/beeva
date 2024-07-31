import { BaseRepository } from './base.repository'

import { ILovedResidences } from '@/assets/@types'
import { supabase } from '@/config/supabase'

export class LovedResidenceRepository extends BaseRepository<ILovedResidences> {
  constructor() {
    super('loved_residences')
  }

  async findByUserId(
    userId: number | string,
  ): Promise<ILovedResidences[] | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId)
      .returns<ILovedResidences[]>()

    if (error) throw error
    return data ?? null
  }
}
