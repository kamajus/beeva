import { BaseRepository } from './base.repository'

import { ILovedResidences } from '@/@types'
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

  async countLovesByResidenceId(
    residenceId: number | string,
  ): Promise<number | null> {
    const { count, error } = await supabase
      .from(this.tableName)
      .select('*', { count: 'exact' })
      .eq('residence_id', residenceId)

    if (error) throw error
    return count ?? null
  }
}
